/**
 * Client-side CSV utilities for batch minting.
 * No external dependencies — handles quoting, escaping, and validation.
 */

export type BatchMintItem = {
  ownerAddress: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
  _error?: string;
};

export type CsvParseError = {
  row: number;
  message: string;
};

export type CsvParseResult = {
  items: BatchMintItem[];
  errors: CsvParseError[];
};

const TEMPLATE_HEADER = 'ownerAddress,name,description,image,attributes';

const TEMPLATE_ROWS = [
  'UQB5HQfjevz9su4ZQGcDT_4IB0IUGh5PM2vAXPU2e4O6_YBm,Genesis #1,First NFT in the collection,https://example.com/1.png,"[{""trait_type"":""Tier"",""value"":""Gold""}]"',
  'UQAoVzGcKCJ2Cs8ggxqiSb9rf51RgyzWcJx-oZWF1RryME2u,Genesis #2,Second NFT in the collection,https://example.com/2.png,"[{""trait_type"":""Tier"",""value"":""Silver""},{""trait_type"":""Rarity"",""value"":""Rare""}]"',
];

/**
 * Generate CSV template content with example rows.
 */
export function generateCsvTemplate(): string {
  return [TEMPLATE_HEADER, ...TEMPLATE_ROWS].join('\n') + '\n';
}

/**
 * Trigger a browser download for the given CSV content.
 */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse a CSV file into batch mint items.
 */
export async function parseCsvFile(file: File): Promise<CsvParseResult> {
  const text = await file.text();
  return parseCsvText(text);
}

/**
 * Parse CSV text content.
 */
export function parseCsvText(text: string): CsvParseResult {
  const lines = splitCsvLines(text);

  if (lines.length === 0) {
    return { items: [], errors: [{ row: 0, message: 'CSV file is empty.' }] };
  }

  // Parse and validate header
  const headerFields = parseCsvRow(lines[0]);
  const headerLower = headerFields.map((h) => h.trim().toLowerCase());
  const expectedColumns = ['owneraddress', 'name', 'description', 'image', 'attributes'];

  for (const expected of expectedColumns) {
    if (!headerLower.includes(expected)) {
      return {
        items: [],
        errors: [{ row: 1, message: `Missing required column: "${expected}". Expected columns: ${TEMPLATE_HEADER}` }],
      };
    }
  }

  const colIndex = Object.fromEntries(expectedColumns.map((col) => [col, headerLower.indexOf(col)])) as Record<
    string,
    number
  >;

  const items: BatchMintItem[] = [];
  const errors: CsvParseError[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCsvRow(line);
    const rowNum = i + 1;

    const ownerAddress = fields[colIndex.owneraddress]?.trim() ?? '';
    const name = fields[colIndex.name]?.trim() ?? '';
    const description = fields[colIndex.description]?.trim() ?? '';
    const image = fields[colIndex.image]?.trim() ?? '';
    const attributesRaw = fields[colIndex.attributes]?.trim() ?? '';

    // Validate required fields
    const rowErrors: string[] = [];

    if (!ownerAddress) {
      rowErrors.push('ownerAddress is required');
    } else if (!/^(UQ|EQ|0Q)[A-Za-z0-9_-]{46}$/.test(ownerAddress)) {
      rowErrors.push(`ownerAddress format invalid: "${ownerAddress}"`);
    }

    if (!name) rowErrors.push('name is required');
    if (!description) rowErrors.push('description is required');

    if (!image) {
      rowErrors.push('image is required');
    } else if (!/^https?:\/\/.+/.test(image)) {
      rowErrors.push(`image must be a valid URL: "${image}"`);
    }

    // Parse attributes
    let attributes: Array<{ trait_type: string; value: string }> = [];

    if (!attributesRaw) {
      rowErrors.push('attributes is required (use [] for empty)');
    } else {
      try {
        const parsed = JSON.parse(attributesRaw) as unknown;

        if (!Array.isArray(parsed)) {
          rowErrors.push('attributes must be a JSON array');
        } else {
          for (let j = 0; j < parsed.length; j++) {
            const attr = parsed[j] as Record<string, unknown>;
            if (typeof attr.trait_type !== 'string' || typeof attr.value !== 'string') {
              rowErrors.push(`attributes[${j}] must have "trait_type" and "value" strings`);
            }
          }

          if (rowErrors.length === 0) {
            attributes = parsed as Array<{ trait_type: string; value: string }>;
          }
        }
      } catch {
        rowErrors.push(`attributes JSON parse error: ${attributesRaw.substring(0, 60)}`);
      }
    }

    if (rowErrors.length > 0) {
      const errorMessage = rowErrors.join('; ');
      errors.push({ row: rowNum, message: errorMessage });
      items.push({ ownerAddress, name, description, image, attributes, _error: errorMessage });
    } else {
      items.push({ ownerAddress, name, description, image, attributes });
    }
  }

  return { items, errors };
}

/**
 * Convert batch mint items back to CSV text.
 */
export function itemsToCsv(items: BatchMintItem[]): string {
  const rows = items.map((item) => {
    return [
      escapeCsvField(item.ownerAddress),
      escapeCsvField(item.name),
      escapeCsvField(item.description),
      escapeCsvField(item.image),
      escapeCsvField(JSON.stringify(item.attributes)),
    ].join(',');
  });

  return [TEMPLATE_HEADER, ...rows].join('\n') + '\n';
}

// ── Internal helpers ──────────────────────────────────────────────────

/**
 * Split CSV text into lines, respecting quoted fields that contain newlines.
 */
function splitCsvLines(text: string): string[] {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i++;
      }
      lines.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    lines.push(current);
  }

  return lines;
}

/**
 * Parse a single CSV row into fields, handling quoted values.
 */
function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }

  fields.push(current);
  return fields;
}

/**
 * Escape a field for CSV output.
 */
function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}
