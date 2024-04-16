#!/usr/bin/env node
import { Command } from 'commander';
import { generate } from './generate';
import { collection } from './collection';
import { collectionByJson } from './collectionByJson';
import { CommanderOptions } from 'types/collection';

const program = new Command();

program.version('0.0.1');

program.option('-d, --debug', 'debug').option('--quiet', 'do not print output to command line');

async function runner(fn: (options: CommanderOptions) => Promise<void>, options: CommanderOptions) {
  await fn(options);
}
program
  .command('help')
  .description('Display help information.')
  .action(() => {
    program.help();
  });

program
  .command('collection')
  .description('place an item into a collection after checking its title/description and tags')
  .option('-c, --collection [collection...]', 'Collection Id to place item in')
  .option('-i, --item [item...]', 'Item Id to place in collection')
  .option('--itemsfromcollection <collection>', 'Process items in the provided collection')
  .option('--itemswithtag <tag>', 'Process items with this tag')
  .option('--itemswithouttag <tag>', 'Process items that do not have this tag')
  .option('--itemsfromlibrary', 'Process all items in the library')
  .option('--matchfield [fields...]', 'Fields to match. Can be one or more of title, tags, description or all')
  .option('-g, --group <group>', 'Group Id to place item in')
  .option('-t, --test', 'test mode, do not actually place item in collection')
  .option('--ignoretag [ignoretag...]', 'Ignore Items with the Zotero tag')
  .option('--addtag [addtag...]', 'Add a tag to the item')
  .option('-r, --recursive', 'Recursively add subcollections to the list')
  .action(async (options: CommanderOptions) => {
    runner(collection, options);
  });

program
  .command('generate ')
  .description('create a JSON file that maps keywords to collections')
  .option('-g --group [group]', 'Zotero group ID')
  .option('-c --collection [collection...]', 'Zotero collection ID')
  .option('-n --name [name]', 'Name of the json file', 'list.json')
  .option('-r --recursive', 'Recursively add subcollections to the list')
  .option('--addtags', 'creates a tag that is the same as the collection name')
  .option('--tagprefix [prefix]', 'add prefix to the tag')
  .action(async (options: CommanderOptions) => {
    runner(generate, options);
  });

program
  .command('collectionByJson')
  .description('categorize items from a JSON file into Zotero collections.')
  .option('-j, --json <json>', 'json file')
  .option('-i, --item [item...]', 'Item Id to place in collection')
  .option('--itemsfromcollection <collection>', 'Process items in the provided collection')
  .option('--itemswithtag <tag>', 'Process items with this tag')
  .option('--itemswithouttag <tag>', 'Process items that do not have this tag')
  .option('--itemsfromlibrary', 'Process all items in the library')
  .option('--matchfield [fields...]', 'Fields to match. Can be one or more of title, tags, description or all')
  .option('-t, --test', 'test mode, do not actually place item in collection')
  .option('--ignoretag [ignoretag...]', 'Ignore Items with the Zotero tags')
  .option('--addtag [addtag...]', 'Add a tags to the item')
  .action(async (options: CommanderOptions) => {
    runner(collectionByJson, options);
  });

program.parse(process.argv);

module.exports = program;
