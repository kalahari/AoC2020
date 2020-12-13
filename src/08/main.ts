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
    const { acc } = runCode(code); 
    console.log('acc part 1', acc);
    for (let i = 0; i < code.length; i++) {
        if (code[i].instruction === 'acc') continue;
        const r = runCode(code.map((op, idx) => {
            if (idx !== i) return op;
            if (op.instruction === 'jmp') {
                return { instruction: 'nop', change: op.change };
            }
            return { instruction: 'jmp', change: op.change };
        }));
        if (r.complete) {
            console.log('acc part 2', r.acc);
            break;
        }
    }
};

const runCode = (code: Array<{
    instruction: string;
    change: number;
}>) => {
    const visited: { [key: number]: boolean } = {};
    let acc = 0;
    let i = 0;
    while (i !== code.length) {
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
    return { acc, complete: i === code.length };
}

main().catch(e => console.error(e.stack ?? e.message ?? e))