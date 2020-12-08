import assert from 'assert';
import { promises as fs } from 'fs';
import csv from 'csv-parse/lib/sync';

const SHINY_GOLD = 'shiny gold';

type Bag = { [color: string]: number };

const main = async () => {
    const input = await fs.readFile('./input.txt');
    const data = csv(input, {
        delimiter: '|', // don't split on comma
        skipEmptyLines: true,
        columns: ['val'],
    }) as Array<{ val: string }>;
    const bags: { [color: string]: Bag } = {}; 
    data.forEach(x => {
        const line = x.val;
        const [color, contents] = line.split(' bags contain ', 2);
        const bag: Bag = {};
        bags[color] = bag;
        if (contents === 'no other bags.') return;
        const colors = contents.slice(0, contents.length - 1).split(', ');
        colors.forEach(c => {
            const m = c.match(/^(\d+)\s(\w[\w\s]*\w)\sbags?$/);
            assert(m != null, 'color does not match');
            bag[m[2]] = parseInt(m[1]);
        })
    });
    // console.log('bags', bags)
    const containsGold = Object.keys(bags).filter(b => bags[b][SHINY_GOLD] != null);
    const additions = () => Object.keys(bags).filter(b => !containsGold.includes(b) && containsGold.some(cg => bags[b][cg] != null));
    while(true) {
        const add = additions();
        if (add.length <= 0) break;
        containsGold.push(...add);
    }
    console.log('containsGold', containsGold, containsGold.length)
    const childCounts: { [color: string]: number } = {};
    const childCount = (color: string): number => {
        if (childCounts[color] != null) return childCounts[color];
        const bag = bags[color];
        const count = Object
            .keys(bag)
            .reduce((acc, c) => acc + bag[c] * (childCount(c) + 1), 0);
        childCounts[color] = count;
        console.log('childCount', color, count);
        return count;
    };
    console.log('gold contans', childCount(SHINY_GOLD))
};

main().catch(e => console.error(e.stack ?? e.message ?? e))