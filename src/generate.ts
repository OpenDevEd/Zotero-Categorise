import Zotero from 'zotero-lib';
import fs from 'fs';

type CommanderOptions = {
  collection: string[];
  group: string;
  test: boolean;
  name: string;
  json?: string;
  recursive?: boolean;
  addtags?: boolean;
  tagprefix?: string;
};

type Options = {
  key: string[];
  top?: boolean;
  verbose?: boolean;
  recursive?: boolean;
};

type Collection = {
  topic: string;
  collection: string;
  terms: [{ term: string; description: string; type: string }];
  tags?: string[];
};

type ResCollection = {
  collections?: Collection[];
  source_collection?: string;
  source_collection_name?: string;
};

type ResList = {
  library?: string;
  source_collections?: ResCollection[];
  addtag?: string[];
  ignoretag?: string[];
};

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

async function generate(commanderOptions: CommanderOptions) {
  let zotero: Zotero = getZotero(commanderOptions.group);
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

  const filename = commanderOptions.name;
  fs.writeFileSync(filename, JSON.stringify(list, null, 4));
}

export { generate, CommanderOptions };
