import assert from 'assert';
import { promises as fs } from 'fs';
import csv from 'csv-parse/lib/sync';

const main = async () => {
    const input = await fs.readFile('./input.txt');
    const data = csv(input, {
        skipEmptyLines: false,
        columns: ['val'],
    }) as Array<{ val: string }>;
    const parsed1 = data
        .map(x => x.val)
        .reduce((acc, line) => {
            if (line == null || line.length <= 0) {
                acc.unshift({});
            } else {
                [...line].forEach(x => acc[0][x] = true);
            }
            return acc;
        }, [{} as { [key: string]: boolean }])
        .reverse();
    // console.log('parsed1', parsed1);
    console.log('sum part 1', parsed1
        .map(x => ({ answers: x, count: Object.keys(x).length }))
        .reduce((acc, x) => acc + x.count, 0));

    const parsed2 = data
        .map(x => x.val)
        .reduce((acc, line) => {
            if (line == null || line.length <= 0) {
                acc.unshift([]);
            } else {
                acc[0].push(line);
            }
            return acc;
        }, [[]] as string[][])
        .reverse();
    console.log('sum part 2', parsed2
        .map(x => [...x[0]].filter(c => x.every(o => o.includes(c))).length)
        .reduce((acc, x) => acc + x, 0));
};

main().catch(e => console.error(e.stack ?? e.message ?? e))