import { promises as fs } from 'fs';
import csv from 'csv-parse/lib/sync';

const TOTAL = 2020;

const main = async () => {
    const input = await fs.readFile('./input.txt');
    const data = csv(input, {
        skipEmptyLines: true,
        columns: ['val'],
    }) as Array<{val: string}>;
    const vals = data.map(x => parseInt(x.val, 10));
    for (let i = 0; i < vals.length; i++) {
        for (let j = i+1; j < vals.length; j++) {
            if (vals[i] + vals[j] === TOTAL) {
                console.log('product of two', vals[i] * vals[j])
            }
            for (let k = j + 1; k < vals.length; k++) {
                if (vals[i] + vals[j] + vals[k] === TOTAL) {
                    console.log('product of three', vals[i] * vals[j] * vals[k])
                }
            }
        }
    }
};

main().catch(e => console.error(e.stack ?? e.message ?? e))