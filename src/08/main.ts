import assert from 'assert';
import { promises as fs } from 'fs';
import csv from 'csv-parse/lib/sync';

const main = async () => {
    const input = await fs.readFile('./input.txt');
    const data = csv(input, {
        skipEmptyLines: true,
        columns: ['val'],
    }) as Array<{val: string}>;
    const code = data.map(x => {
        const m = x.val.match(/^(acc|jmp|nop)\s([+-]\d+)$/);
        assert(m != null, `code line does not match: ${x.val}`);
        return { instruction: m[1], change: parseInt(m[2], 10) };
    });
    const visited: { [key: number]: boolean } = {};
    let acc = 0;
    let i = 0;
    while (true) {
        if (visited[i] != null) {
            break;
        }
        visited[i] = true;
        const op = code[i];
        switch(op.instruction) {
            case 'acc':
                acc += op.change;
                i++;
                    break;
            case 'jmp':
                i += op.change;
                break;
            default:
                // nop
                i++;
                break;
        }
        // console.log('i', i, 'acc', acc, 'op', op);
    }
    console.log('acc', acc);
};

main().catch(e => console.error(e.stack ?? e.message ?? e))