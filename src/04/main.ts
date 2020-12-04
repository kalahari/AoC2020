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
    const valid1 = parsed.reduce((acc, pp) => {
        requiredFields.every(f => pp.some(x => x.key === f)) && acc++;
        return acc;
    }, 0);
    console.log('valid part 1', valid1);
    const validYear = (x: string, min: number, max: number) => {
        if (!/^\d{4}$/.test(x)) return false;
        const numVal = parseInt(x, 10);
        return !isNaN(numVal) && numVal >= min && numVal <= max;
    };
    const validators: Array<{ key: string, valid: (x: string) => boolean }> = [
        { key: 'byr', valid: x => validYear(x, 1920, 2002) },
        { key: 'iyr', valid: x => validYear(x, 2010, 2020) },
        { key: 'eyr', valid: x => validYear(x, 2020, 2030) },
        { key: 'hgt', valid: x => {
            const m = x.match(/^(\d+)(cm|in)$/);
            if (m == null) return false;
            const num = parseInt(m[1], 10);
            if (isNaN(num)) return false;
            switch (m[2]) {
                case 'cm':
                    return num >= 150 && num <= 193;
                case 'in':
                    return num >= 59 && num <= 76;
                default:
                    return false;
            }
        } },
        { key: 'hcl', valid: x => /^\#[0-9a-f]{6}$/.test(x) },
        { key: 'ecl', valid: x => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(x)  },
        { key: 'pid', valid: x => /^\d{9}$/.test(x) },
    ];
    const valid2 = parsed.reduce((acc, pp) => {
        validators.every(v => pp.some(x => x.key === v.key && v.valid(x.val))) && acc++;
        return acc;
    }, 0);
    console.log('valid part 2', valid2);
};

main().catch(e => console.error(e.stack ?? e.message ?? e))