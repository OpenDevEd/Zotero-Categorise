import Zotero from 'zotero-lib';
import fs from 'fs';
import { Collection, CommanderOptions, Options, ResCollection, ResList } from './types/generate';

function getZotero(groupid: string) {
  if (!groupid) {
    return new Zotero({ verbose: false });
  }
  return new Zotero({ verbose: false, 'group-id': groupid });
}

async function addChildren(collection: Collection[], parent: any, list: ResList, commanderOptions: CommanderOptions) {
  for (const child of parent.children) {
    collection.push({
      topic: child.data.name,
      collection: `zotero://select/groups/${list.library}/collections/${child.key}`,
      tags: commanderOptions.addtags
        ? [commanderOptions.tagprefix ? `${commanderOptions.tagprefix}${child.data.name}` : child.data.name]
        : [],
      terms: [{ term: child.data.name, description: 'main', type: 'word' }],
    });
    if (child.children.length > 0) {
      await addChildren(collection, child, list, commanderOptions);
    }
  }
}

async function makelist(
  collectionList: ResCollection,
  list: ResList,
  commanderOptions: CommanderOptions,
  results: any
) {
  for (const collectionkey of results) {
    collectionList.collections = collectionList.collections || [];
    collectionList.collections.push({
      topic: collectionkey.data.name,
      collection: `zotero://select/groups/${list.library}/collections/${collectionkey.key}`,
      tags: commanderOptions.addtags
        ? [
            commanderOptions.tagprefix
              ? `${commanderOptions.tagprefix}${collectionkey.data.name}`
              : collectionkey.data.name,
          ]
        : [],
      terms: [{ term: collectionkey.data.name, description: 'main', type: 'word' }],
    });

    if (commanderOptions.recursive && collectionkey.children?.length > 0) {
      await addChildren(collectionList.collections, collectionkey, list, commanderOptions);
    }
    console.log(collectionkey.data);
  }
}

/**
 * Generates a list of collections and subcollections from Zotero based on the provided options.
 *
 * @param {CommanderOptions} commanderOptions - The options passed from commander.
 * @returns {Promise<void>} - A Promise that resolves when the operation is finished.
 */
async function generate(commanderOptions: CommanderOptions) {
  const zotero: Zotero = getZotero(commanderOptions.group);
  if (!commanderOptions.collection) {
    console.log('You must provide at least one collection');
    return;
  }

  const list: ResList = {};
  list.library = commanderOptions.group;
  list.source_collections = [];

  for (const collectionId of commanderOptions.collection) {
    const collectionList: ResCollection = {};
    collectionList.source_collection_name = '';
    collectionList.source_collection = collectionId;
    collectionList.collections = [];

    const options: Options = {
      top: false,
      key: [collectionId],
      verbose: false,
      recursive: commanderOptions.recursive,
    };
    // fetch the collection
    const result: any = await zotero.collection(options);
    // check if the collection exists
    if (!result?.data) {
      console.log(`There is no collection with this key ${collectionId}`);
      continue;
    }
    collectionList.source_collection_name = result.data.name;
    if (list.library === undefined) list.library = result.library.id;
    // fetch the subcollections
    const results: any = await zotero.collections(options);
    // make a list of the subcollections with the collection name, the collection key and the terms
    await makelist(collectionList, list, commanderOptions, results);
    list.source_collections.push(collectionList);
  }
  list.ignoretag = [];
  list.addtag = [];

  const filename = commanderOptions.name ?? 'list.json';
  fs.writeFileSync(filename, JSON.stringify(list, null, 4));
}

export { generate, CommanderOptions };
