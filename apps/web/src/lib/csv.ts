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

const TEMPLATE_HEADER = 'id,ownerAddress,image,Name,Description,Category,Skin,Eyes,Ears,Decos,Energy Ring,Background,Rarity';

const TEMPLATE_ROWS = [
  '1,UQB5HQfjevz9su4ZQGcDT_4IB0IUGh5PM2vAXPU2e4O6_YBm,https://static.tbook.vip/img/9eb7347d164647ab9fe80c61e0e238fb,Vampire Bookie,"Vampire Bookie thrives after sunset. It moves elegantly through shadows, feeding on secrets, ambition, and weak souls.",Travel Bookies,Metal,Red,Orange,Headwear,None,Unique Scenario,SSR',
  '2,UQARnT3j0MJJRJxic1MXTQ89MVTRx7_Mj-OZ2VPVgV2Lu20P,https://static.tbook.vip/img/d789ab90f9264398b23db1f1bc10294e,Elysium Scout Bookie,"Elysium Scout Bookie watches over the gates to the sky, calm and unblinking, its ethereal presence inspiring awe and quiet hesitation in all who approach.",Travel Bookies,Ceramic,Red,Orange,Earrings,None,Unique Scenario,SSR',
  '3,UQC-bfP-GF8v3Ph96BRBHEiadYrdGnPb3o81xnWXUPuBzB3E,https://static.tbook.vip/img/d43fb1ff6a6a4a409d3835e43c5cb53d,Bookie 668,"The trendsetters. Dressed to impress, they wear high-end fashion and embody the sophistication of high-value assets.",Style Bookies,Metal,Red,Metal,Headwear,None,Gradient ,SR',
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

  // Mandatory columns check
  const mandatory = ['owneraddress', 'name', 'description', 'image'];
  const missing = [];
  for (const m of mandatory) {
    if (!headerLower.includes(m)) {
      missing.push(m);
    }
  }

  if (missing.length > 0) {
    return {
      items: [],
      errors: [
        {
          row: 1,
          message: `Missing required column(s): ${missing.join(', ')}. Expected headers like: ${TEMPLATE_HEADER}`,
        },
      ],
    };
  }

  const colIndex = {
    id: headerLower.indexOf('id'),
    ownerAddress: headerLower.indexOf('owneraddress'),
    name: headerLower.indexOf('name'),
    description: headerLower.indexOf('description'),
    image: headerLower.indexOf('image'),
  };

  // Identify trait columns (anything not id, ownerAddress, Name, Description, image)
  const traitCols: Array<{ index: number; trait_type: string }> = [];
  headerLower.forEach((h, i) => {
    if (!['id', 'owneraddress', 'name', 'description', 'image'].includes(h)) {
      traitCols.push({ index: i, trait_type: headerFields[i].trim() });
    }
  });

  const items: BatchMintItem[] = [];
  const errors: CsvParseError[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCsvRow(line);
    const rowNum = i + 1;

    const ownerAddress = fields[colIndex.ownerAddress]?.trim() ?? '';
    const name = fields[colIndex.name]?.trim() ?? '';
    const description = fields[colIndex.description]?.trim() ?? '';
    const image = fields[colIndex.image]?.trim() ?? '';

    // Validate required fields
    const rowErrors: string[] = [];

    if (!ownerAddress) {
      rowErrors.push('ownerAddress is required');
    } else if (!/^(UQ|EQ|0Q)[A-Za-z0-9_-]{46,64}$/.test(ownerAddress)) {
      rowErrors.push(`ownerAddress format invalid: "${ownerAddress}"`);
    }

    if (!name) rowErrors.push('name is required');
    if (!description) rowErrors.push('description is required');

    if (!image) {
      rowErrors.push('image is required');
    } else if (!/^https?:\/\/.+/.test(image)) {
      rowErrors.push(`image must be a valid URL: "${image}"`);
    }

    // Process attributes from dynamic columns
    const attributes: Array<{ trait_type: string; value: string }> = [];
    for (const tc of traitCols) {
      const value = fields[tc.index]?.trim() ?? '';
      if (value) {
        attributes.push({ trait_type: tc.trait_type, value });
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
  if (items.length === 0) return TEMPLATE_HEADER + '\n';

  // Extract all unique trait types across all items
  const allTraits = new Set<string>();
  items.forEach((item) => {
    item.attributes.forEach((attr) => allTraits.add(attr.trait_type));
  });

  const traitList = Array.from(allTraits);
  const header = ['id', 'ownerAddress', 'image', 'Name', 'Description', ...traitList];

  const rows = items.map((item, index) => {
    const rowData: string[] = [
      String(index + 1),
      item.ownerAddress,
      item.image,
      item.name,
      item.description,
    ];

    traitList.forEach((trait) => {
      const attr = item.attributes.find((a) => a.trait_type === trait);
      rowData.push(attr?.value ?? '');
    });

    return rowData.map((field) => escapeCsvField(field)).join(',');
  });

  return [header.join(','), ...rows].join('\n') + '\n';
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
  if (value === undefined || value === null) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }
  return stringValue;
}
