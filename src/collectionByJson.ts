import fs from 'fs';
import { collection } from './collection';
import Zotero from 'zotero-lib';

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

async function generateByJSon(commanderOptions: CommanderOptions) {
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

  const resultcollcections = [];
  for (const element of json.source_collections) {
    // const commanderOptions2: CommanderOptions = {
    //   item: commanderOptions.item,
    //   collection: [element.collection],
    //   group: json.library,
    //   test: commanderOptions.test,
    //   name: commanderOptions.name,
    // };
    // console.log(element);
    if (!element.collections) continue;

    for (const collle of element.collections) {
      const termsList = [];
      for (const term of collle.terms) {
        termsList.push(term.term);
      }
      // console.log(termsList);
      resultcollcections.push({
        terms: termsList,
        collection: collle.collection,
        collection_name: collle.collection_name,
      });

      // await collection(commanderOptions2);
    }

    // await collection(commanderOptions2);
  }
  console.log(resultcollcections);
  let FinalOutput = '';
  FinalOutput += "list of collections' terms: " + JSON.stringify(resultcollcections) + '\n';

  for (const item of itemId) {
    await addItemToCollection(item, zotero, resultcollcections, testmode, FinalOutput, ignoretag, addtag);
  }
}

export { generateByJSon };
