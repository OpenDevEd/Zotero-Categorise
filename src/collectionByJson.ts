import fs from 'fs';
import { collection } from './collection';
import Zotero from 'zotero-lib';
import { addItemToCollection } from './addItemToCollection';

type Subcollections = {
  collection_name: string;
  collection: string;
  terms: { term: string; description: string }[];
};

type ResCollection = {
  collections?: Subcollections[];
  source_collection: string;
  source_collection_name?: string;
};

type ResList = {
  library: string;
  source_collections: ResCollection[];
};
type CommanderOptions = {
  item: string[];
  collection: string[];
  group: string;
  test: boolean;
  name: string;
  json?: string;
  ignoretag?: string;
  addtag?: string;
};

type ZoteroCollections = {
  terms: string[];
  collection: string;
  collection_name: string;
  situation: string;
}[];


// this function is used to categorize items from a JSON file into Zotero collections
async function generateByJSon(commanderOptions: CommanderOptions) {
  // check if the user provided a json file
  if (!commanderOptions.json) {
    console.log('Please provide a json file');
    return;
  }

  const itemId = commanderOptions.item;
  if (!itemId || !itemId.length) {
    console.log('Please provide an item');
    return;
  }
  const groupid = commanderOptions.group;
  let zotero;
  if (groupid) {
    zotero = new Zotero({ verbose: false, 'group-id': groupid });
  } else {
    zotero = new Zotero({ verbose: false });
  }

  const jsonFile = commanderOptions.json;
  const data = fs.readFileSync(jsonFile, 'utf8');
  const json: ResList = JSON.parse(data);
  if (!json.source_collections) {
    console.log('Please provide a json file with collections');
    return;
  }
  const ignoretag = commanderOptions.ignoretag;
  const addtag = commanderOptions.addtag;
  const testmode = commanderOptions.test;

  const resultcollcections: ZoteroCollections = [];
  // get the collections from the json file
  // make a list of collections with their terms,name and situation
  for (const element of json.source_collections) {
    if (!element.collections) continue;

    for (const collle of element.collections) {
      const termsList: string[] = [];
      for (const term of collle.terms) {
        termsList.push(term.term);
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
  for (const item of itemId) {
    FinalOutput += '\n\nItem ' + item + ' :\n';
    FinalOutput = await addItemToCollection(item, zotero, resultcollcections, testmode, FinalOutput, ignoretag, addtag);
    for (const element of resultcollcections) {
      element.situation = 'nothing';
    }
  }
  console.log(FinalOutput);
}

export { generateByJSon };
