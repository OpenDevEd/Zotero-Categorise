import fs from 'fs';
import { collection } from './collection';
import Zotero from 'zotero-lib';
import { ZoteroItem, addItemToCollection } from './addItemToCollection';
import { validateMatchfield } from './utils/validateParameters';

type Subcollections = {
  collection_name: string;
  collection: string;
  terms: { term: string; description: string; type: string }[];
};

type ResCollection = {
  collections?: Subcollections[];
  source_collection: string;
  source_collection_name?: string;
};

type ResList = {
  library: string;
  source_collections: ResCollection[];
  addtag: string[];
  ignoretag: string[];
};
type CommanderOptions = {
  item?: string[];
  itemsfromcollection?: string;
  itemswithtag?: string;
  itemswithouttag?: string;
  itemsfromlibrary?: boolean;
  matchfield?: string[];
  // collection: string[];
  group: string;
  test: boolean;
  name?: string;
  json?: string;
  ignoretag?: string[];
  addtag?: string[];
};

type ZoteroCollections = {
  terms: { term: string; type: string }[];
  collection: string;
  collection_name: string;
  situation: string;
}[];

// this function is used to categorize items from a JSON file into Zotero collections
async function collectionByJSon(commanderOptions: CommanderOptions) {
  // check if the user provided a json file
  if (!commanderOptions.json) {
    console.log('Please provide a json file');
    return;
  }

  const { itemsfromcollection, itemswithtag, itemswithouttag, itemsfromlibrary } = commanderOptions;
  const itemOptions = [commanderOptions.item, itemsfromcollection, itemswithtag, itemswithouttag, itemsfromlibrary];

  if (itemOptions.filter(Boolean).length > 1) {
    console.log('Only one of these options should be used at a time:');
    console.log('--item');
    console.log('--itemsfromcollection');
    console.log('--itemswithtag');
    console.log('--itemswithouttag');
    console.log('--itemsfromlibrary');
    return;
  }

  const matchfield = validateMatchfield(commanderOptions.matchfield);

  const groupid = commanderOptions.group;
  let zotero;
  if (groupid) {
    zotero = new Zotero({ verbose: false, 'group-id': groupid });
  } else {
    zotero = new Zotero({ verbose: false });
  }

  let items: (string | ZoteroItem)[] = commanderOptions.item || [];
  let fetched: { data: ZoteroItem }[] = [];

  if (itemsfromcollection) {
    fetched = await zotero.items({ collection: itemsfromcollection });
  } else if (itemswithtag) {
    fetched = await zotero.items({ filter: { tag: itemswithtag } });
  } else if (itemswithouttag) {
    fetched = await zotero.items({ filter: { tag: `-${itemswithouttag}` } });
  } else if (itemsfromlibrary) {
    fetched = await zotero.items({});
  }
  if (fetched.length) {
    items = fetched.map((item) => item.data);
  }

  if (!items || !items.length) {
    console.log('No items to process');
    return;
  }

  const jsonFile = commanderOptions.json;
  const data = fs.readFileSync(jsonFile, 'utf8');
  const json: ResList = JSON.parse(data);
  if (!json.source_collections) {
    console.log('Please provide a json file with collections');
    return;
  }
  if (commanderOptions.ignoretag) {
    json.ignoretag = [...(json.ignoretag || []), ...commanderOptions.ignoretag];
  }

  if (commanderOptions.addtag) {
    json.addtag = [...(json.addtag || []), ...commanderOptions.addtag];
  }
  const testmode = commanderOptions.test;

  const resultcollcections: ZoteroCollections = [];
  // get the collections from the json file
  // make a list of collections with their terms,name and situation
  for (const element of json.source_collections) {
    if (!element.collections) continue;

    for (const collle of element.collections) {
      const termsList: { term: string; type: string }[] = [];
      for (const term of collle.terms) {
        termsList.push({ term: term.term, type: term.type });
      }

      resultcollcections.push({
        terms: termsList,
        collection: collle.collection,
        collection_name: collle.collection_name,
        situation: 'nothing',
      });
    }
  }
  let FinalOutput = '';
  // add the items to the collections for each item
  for (const item of items) {
    const id = typeof item === 'string' ? item : item.key;

    FinalOutput += '\n\nItem ' + id + ' :\n';
    FinalOutput = await addItemToCollection(
      item,
      zotero,
      matchfield,
      resultcollcections,
      testmode,
      FinalOutput,
      json.ignoretag,
      json.addtag
    );
    for (const element of resultcollcections) {
      element.situation = 'nothing';
    }
  }
  console.log(FinalOutput);
}

export { collectionByJSon };
