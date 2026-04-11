const fs = require('fs');
const path = require('path');

function parseCsv(text) {
    const rows = [];
    let current = '';
    let row = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const next = text[i + 1];

        if (char === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === ',' && !inQuotes) {
            row.push(current);
            current = '';
            continue;
        }

        if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && next === '\n') {
                i += 1;
            }
            row.push(current);
            current = '';
            if (row.some((cell) => cell !== '')) {
                rows.push(row);
            }
            row = [];
            continue;
        }

        current += char;
    }

    row.push(current);
    if (row.some((cell) => cell !== '')) {
        rows.push(row);
    }

    return rows;
}

function toAttributeKey(header) {
    return header.trim();
}

function buildMetadata(row) {
    const attributes = [];
    const reserved = new Set(['id', 'ownerAddress', 'image', 'Name', 'Description']);

    for (const [key, value] of Object.entries(row)) {
        if (reserved.has(key)) {
            continue;
        }

        const normalized = value.trim();
        if (!normalized) {
            continue;
        }

        attributes.push({
            trait_type: toAttributeKey(key),
            value: normalized,
        });
    }

    return {
        name: row.Name.trim(),
        description: row.Description.trim(),
        image: row.image.trim(),
        attributes,
    };
}

function main() {
    const cwd = process.cwd();
    const inputArg = process.argv[2] || 'getgems_batch_mint_template.csv';
    const outputArg = process.argv[3] || path.join('metadata', 'generated', path.parse(inputArg).name);

    const inputPath = path.resolve(cwd, inputArg);
    const outputDir = path.resolve(cwd, outputArg);

    if (!fs.existsSync(inputPath)) {
        throw new Error(`Input CSV not found: ${inputPath}`);
    }

    const raw = fs.readFileSync(inputPath, 'utf8').replace(/^\uFEFF/, '');
    const rows = parseCsv(raw);

    if (rows.length < 2) {
        throw new Error('CSV must include a header row and at least one data row');
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    const items = dataRows.map((cells, index) => {
        if (cells.length !== headers.length) {
            throw new Error(`Row ${index + 2} has ${cells.length} cells, expected ${headers.length}`);
        }

        const row = {};
        headers.forEach((header, headerIndex) => {
            row[header] = cells[headerIndex] ?? '';
        });
        return row;
    });

    fs.mkdirSync(outputDir, { recursive: true });

    const manifest = items.map((row) => {
        const id = row.id.trim();
        const fileName = `${id}.json`;
        const metadata = buildMetadata(row);
        fs.writeFileSync(path.join(outputDir, fileName), `${JSON.stringify(metadata, null, 2)}\n`);

        return {
            id,
            ownerAddress: row.ownerAddress.trim(),
            fileName,
            name: row.Name.trim(),
            image: row.image.trim(),
        };
    });

    fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

    console.log(`Generated ${manifest.length} metadata files in ${outputDir}`);
}

main();
