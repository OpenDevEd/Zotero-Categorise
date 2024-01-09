import Zotero from 'zotero-lib';
import fs from 'fs';

type CommanderOptions = {
  item: string[];
  collection: string[];
  group: string;
  test: boolean;
  name: string;
  json?: string;
};

type Options = {
  key: string[];
  top?: boolean;
  verbose?: boolean;
};


type Collection = {
  collection_name: string;
  collection: string;
  terms: [{ term: string; description: string }];
};

type ResCollection = {
  collections?: Collection[];
  source_collection?: string;
  source_collection_name?: string;
};

type ResList = {
  library?: string;
  source_collections?: ResCollection[];
};

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
    
    // make a list of the subcollections with the collection name, the collection key and the terms
    for (const collectionkey of results) {
      collectionList.collections.push({
        collection_name: collectionkey.data.name,
        collection: `zotero://select/groups/${list.library}/collections/${collectionkey.key}`,
        terms: [{ term: collectionkey.data.name, description: 'main' }],
      });
      console.log(collectionkey.data);
    }
    list.source_collections.push(collectionList);
  }

  const filename = commanderOptions.name;
  fs.writeFileSync(filename, JSON.stringify(list));
}

export { generate, CommanderOptions };
