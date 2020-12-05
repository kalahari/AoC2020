import assert from 'assert';
import { promises as fs } from 'fs';
import csv from 'csv-parse/lib/sync';

const ROW_INDICATOR_LENGTH = 7;

const main = async () => {
    const input = await fs.readFile('./input.txt');
    const data = csv(input, {
        skipEmptyLines: true,
        columns: ['val'],
    }) as Array<{ val: string }>;
    const parsed = data.map(x => ({ row: x.val.slice(0, ROW_INDICATOR_LENGTH), col: x.val.slice(ROW_INDICATOR_LENGTH) }));
    const ids = parsed.map(x => {
        const row = binaryPartitionExtract(x.row, 'F', 'B');
        const col = binaryPartitionExtract(x.col, 'L', 'R');
        return { addr: x, row, col, id: row * 8 + col };
    })
    // console.log('ids', ids)
    console.log('max seat id', ids.map(x => x.id).reduce((acc, id) => acc > id ? acc : id, 0));
};

const binaryPartitionExtract = (address: string, lowerIndicator: string, upperIndicator: string) => {
    const len = address.length;
    let min = 0, max = Math.pow(2, len);
    for (let i = 0; i < len; i++) {
        const indicator = address[i], diff = (max - min) / 2;
        if (indicator === lowerIndicator) {
            max -= diff;
        } else if (indicator === upperIndicator) {
            min += diff;
        } else {
            throw Error(`unexpected indicator: ${indicator}`)
        }
    }
    return min;
}

main().catch(e => console.error(e.stack ?? e.message ?? e))