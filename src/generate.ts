import Zotero from 'zotero-lib';
import fs from 'fs';
import { Collection, CommanderOptions, Options, ResCollection, ResList } from './types/generate';

/**
 * Generates a list of collections and subcollections from Zotero based on the provided options.
 *
 * @param {CommanderOptions} commanderOptions - The options passed from commander.
 * @returns {Promise<void>} - A Promise that resolves when the operation is finished.
 */
async function generate(commanderOptions: CommanderOptions) {
  let zotero: Zotero;
  const groupid = commanderOptions.group;
  if (!groupid) {
    zotero = new Zotero({ verbose: false });
  } else {
    zotero = new Zotero({ verbose: false, 'group-id': groupid });
  }
  if (!commanderOptions.collection) {
    console.log('You must provide at least one collection');
    return;
  }

  const list: ResList = {};
  list.library = groupid;
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
    if (!result || !result.data) {
      console.log(`There is no collection with this key ${collectionId}`);
      continue;
    }
    collectionList.source_collection_name = result.data.name;
    if (list.library === undefined) list.library = result.library.id;
    // fetch the subcollections
    const results: any = await zotero.collections(options);
    // fs.writeFileSync('collection.json', JSON.stringify(results));

    async function addChildren(collection: Collection[], parent: any) {
      for (const child of parent.children) {
        // console.log('child name', child.data.name);
        collection.push({
          collection_name: child.data.name,
          collection: `zotero://select/groups/${list.library}/collections/${child.key}`,
          terms: [{ term: child.data.name, description: 'main', type: 'word' }],
        });
        if (child.children.length > 0) {
          addChildren(collection, child);
        }
      }
    }

    // make a list of the subcollections with the collection name, the collection key and the terms
    for (const collectionkey of results) {
      collectionList.collections.push({
        collection_name: collectionkey.data.name,
        collection: `zotero://select/groups/${list.library}/collections/${collectionkey.key}`,
        terms: [{ term: collectionkey.data.name, description: 'main', type: 'word' }],
      });

      if (commanderOptions.recursive && collectionkey.children?.length > 0) {
        await addChildren(collectionList.collections, collectionkey);
      }
      console.log(collectionkey.data);
    }
    list.source_collections.push(collectionList);
  }
  list.ignoretag = [];
  list.addtag = [];

  const filename = commanderOptions.name;
  fs.writeFileSync(filename, JSON.stringify(list));
}

export { generate, CommanderOptions };
