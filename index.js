// Retrieve 5eSRD content, and use to make mashups

const axios = require('axios').default;

const BASE_URI = 'https://www.dnd5eapi.co';
const supportedCollections = ['conditions', 'damage-types', 'equipment', 'features', 'magic-items', 'magic-schools', 'monsters', 'spells'];

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

if (args.length === 0) {
    console.log("At least one choice, and a count separated by an = sign; Example: spells=2");
    console.log("Collections: ", supportedCollections.join(', '));
} else {
    const entries = [];

    args.forEach(arg => {
        const choices = arg.split('=');
    
        if (supportedCollections.indexOf(choices[0]) > -1) {
            const collection = choices[0];
            const count = (!isNaN(choices[1]) ? choices[1] : 1);
            entries.push(getEntries(collection, count));
        }
    });
    
    console.log("Grabbing resources from SRD, let's make something fun");
    Promise.all(entries).then((results) => console.log(results));
}
