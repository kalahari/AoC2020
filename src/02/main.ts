import assert from 'assert';
import { promises as fs } from 'fs';
import csv from 'csv-parse/lib/sync';

const INPUT_REGEX = new RegExp(/^(\d+)-(\d+) ([a-z]): ([a-z]+)$/);

const main = async () => {
    const input = await fs.readFile('./input.txt');
    const data = csv(input, {
        skipEmptyLines: true,
        columns: ['val'],
    }) as Array<{ val: string }>;
    const parsed = data.map(x => {
        const match = x.val.match(INPUT_REGEX);
        assert(match != null, 'match must not be null');
        const min = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);
        const char = match[3];
        const pass = match[4];
        return { min, max, char, pass };
    });
    // console.log('parsed input', parsed);
    const valid = parsed.map<number>(p => {
        let idx = p.pass.indexOf(p.char);
        let count = 0;
        while (idx >= 0) {
            count++;
            idx = p.pass.indexOf(p.char, idx + 1);
        }
        if (count >= p.min && count <= p.max) return 1;
        return 0;
    }).reduce((acc, v) => acc + v, 0);
    console.log('valid count', valid)
};

main().catch(e => console.error(e.stack ?? e.message ?? e))