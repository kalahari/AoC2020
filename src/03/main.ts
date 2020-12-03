import assert from 'assert';
import { promises as fs } from 'fs';
import csv from 'csv-parse/lib/sync';

const main = async () => {
    const input = await fs.readFile('./input.txt');
    const data = csv(input, {
        skipEmptyLines: true,
        columns: ['val'],
    }) as Array<{ val: string }>;
    const parsed = data.map(x => x.val);
    const rows = parsed.length;
    const rowLen = parsed[0].length;
    let coll = 3;
    let trees = 0;
    for (let i = 1; i < rows; i++) {
        if (parsed[i][coll % rowLen] === '#') {
            trees++;
        }
        coll += 3;
    }
    console.log('tree count part 1', trees);
};

main().catch(e => console.error(e.stack ?? e.message ?? e))