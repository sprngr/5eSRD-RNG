// Retrieve 5eSRD content, and use to make mashups

const axios = require('axios').default;

const BASE_URI = 'https://www.dnd5eapi.co';
const supportedCollections = [
    'classes',
    'conditions',
    'damage-types',
    'equipment', 
    'features',
    'languages',
    'magic-items', 
    'magic-schools', 
    'monsters',
    'races',
    'skills',
    'spells',
    'subclasses',
    'subraces',
    'traits',
    'weapon-properties',
];

const args = process.argv.slice(2);

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function getEntries(api, count) {
    const results = [];

    // GET collection
    const collection = (await axios.get(`${BASE_URI}/api/${api}/`)).data;

    // Store indexes per entry required for uniqueness
    let usedIndexes = [];

    for (let i = 0; i < count; i++) {
        let index;

        while(index === undefined || usedIndexes.indexOf(index) > -1) {
            index = getRandom(collection.count);
        }

        usedIndexes.push(index);

        results.push((await axios.get(`${BASE_URI}${collection.results[index].url}`)).data);
    }

    return results;
}

function printResults(results) {
    results.forEach(result => {
        const output = {
            name: result[0].name,
            description: result[0].desc,
            url: `${BASE_URI}${result[0].url}`
        }
        console.log(output);
    });
}

if (args.length === 0) {
    console.log("At least one choice, and optionally a count separated by an = sign; Example: spells=2");
    console.log("Collections available: ", supportedCollections.join(', '));
    console.log("We're going to pick 2 at random anyway.")

    args.push(supportedCollections[getRandom(supportedCollections.length)]);
    args.push(supportedCollections[getRandom(supportedCollections.length)]);
}

const entries = [];

args.forEach(arg => {
    const choices = arg.split('=');

    if (supportedCollections.indexOf(choices[0]) > -1) {
        const collection = choices[0];
        const count = (!isNaN(choices[1]) ? choices[1] : 1);
        entries.push(getEntries(collection, parseInt(count)));
    }
});

console.log("Grabbing resources from SRD, let's make something fun with:", args.join('; '));
Promise.all(entries).then((results) => printResults(results));
