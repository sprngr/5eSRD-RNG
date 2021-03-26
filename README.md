# 5eSRD RNG

Randomly pull entries from the 5e SRD API provided by https://www.dnd5eapi.co

Use at your own risk, and for fun :)

I use it to get ideas for homebrew 5e stuff.

## Usage

To use, at least for now, you can provide it any number of valid collections from the 5e API. It will pull a random entry for it and print out a basic object.

`node index.js <collection> <collection> ...`

*Collections*

```
[
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
]
```
