import assert from 'assert';
import { promises as fs } from 'fs';
import csv from 'csv-parse/lib/sync';

const PRE_LEN = 25;

const main = async () => {
    const input = await fs.readFile('./input.txt');
    const data = csv(input, {
        skipEmptyLines: true,
        columns: ['val'],
    }) as Array<{val: string}>;
    const vals = data.map(x => parseInt(x.val, 10));
    let invalid = 0;    
    for (let i = PRE_LEN; i < vals.length; i++) {
        const val = vals[i];
        let valid = false;
        for (let j = i - PRE_LEN; !valid && j < i - 1; j++) {
            for (let k = j + 1; !valid && k < i; k++) {
                const v1 = vals[j], v2 = vals[k];
                if (v1 !== v2 && v1 + v2 === val) {
                    valid = true;
                }
            }
        }
        if (!valid) {
            invalid = val;
            console.log('invalid number', invalid);
            break;
        }
    }   
    for (let i = 0; i < vals.length - 1; i++) {
        let acc = 0;
        let j = i;
        while(acc < invalid && j < vals.length) {
            acc += vals[j];
            j++;
        }
        if (acc === invalid && j > i + 1) {
            const range = vals.slice(i, j).sort((a, b) => b - a);
            console.log('encryption weakness', range[0] + range[range.length - 1]);
            break;
        }
    }
};

main().catch(e => console.error(e.stack ?? e.message ?? e))