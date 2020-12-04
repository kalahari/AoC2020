import assert from 'assert';
import { promises as fs } from 'fs';
import csv from 'csv-parse/lib/sync';

const main = async () => {
    const input = await fs.readFile('./input.txt');
    const data = csv(input, {
        skipEmptyLines: false,
        columns: ['val'],
    }) as Array<{ val: string }>;
    const parsed = data
        .map(x => x.val)
        .reduce((acc, line) => {
            if (line == null || line.length <= 0) {
                acc.unshift('');
            } else {
                acc[0] += ` ${line}`;
            }
            return acc;
        }, [''])
        .reverse()
        .map(line => line.split(' ')
            .filter(x => x.includes(':'))
            .map(x => x.split(':'))
            .map(x => ({ key: x[0], val: x[1] })));
    // console.log('parsed', parsed);
    const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid' /*, 'cid'*/];
    const valid = parsed.reduce((acc, pp) => {
        requiredFields.every(f => pp.some(x => x.key === f)) && acc++;
        return acc;
    }, 0)
    console.log('valid', valid);
};

main().catch(e => console.error(e.stack ?? e.message ?? e))