import Zotero from 'zotero-lib';
import { addItemToCollection } from './addItemToCollection';
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

type Collection = {
  data: {
    name: string;
    key: string;
  };
  meta?: { numCollections: number; numItems: number };
};

type Options = {
  key: string[];
  top?: boolean;
  verbose?: boolean;
};

type ZoteroCollections = {
  terms: string[];
  collection: string;
  collection_name: string;
  situation: string;
}[];

async function collection(commanderOptions: CommanderOptions) {
  let FinalOutput = '';
  const itemId = commanderOptions.item;
  const collectionId = commanderOptions.collection;
  const testmode = commanderOptions.test;
  const ignoretag = commanderOptions.ignoretag;
  const addtag = commanderOptions.addtag;
  if (!itemId || !itemId.length || !collectionId) {
    console.log('Please provide an item, collection');
    return;
  }
  const groupid = commanderOptions.group;
  let zotero;
  if (groupid) {
    zotero = new Zotero({ verbose: false, 'group-id': groupid });
  } else {
    zotero = new Zotero({ verbose: false });
  }

  const options: Options = {
    top: false,
    key: [collectionId[0]],
    verbose: false,
  };
  const listCollections: ZoteroCollections = [];
  let result: Collection;
  try {
    result = await zotero.collection(options);
    FinalOutput += 'Number of subcollections for ' + JSON.stringify(collectionId[0]) + '  : ';

    if (!result) {
      throw new Error(`There is no collection with this key ${collectionId[0]}`);
    }
    FinalOutput += result.meta?.numCollections + '\n';
    console.log(
      'Number of subcollections for ' + JSON.stringify(collectionId[0]) + '  : ' + result.meta?.numCollections
    );
    if (result.meta?.numCollections == 0)
      throw new Error(`There is no sub collection in this collection ${collectionId[0]} please add a sub collection`);

    const results: Collection[] = await zotero.collections(options);
    results.forEach(async (collectionkey: Collection) => {
      listCollections.push({
        terms: [collectionkey.data.name],
        collection: collectionkey.data.key,
        collection_name: collectionkey.data.name,
        situation: 'nothing',
      });
    });
    const listCollectionsForOutput = listCollections.map((item) => [item.collection_name, item.collection]);
    FinalOutput += 'Subcollections :' + JSON.stringify(listCollectionsForOutput) + '\n';
    console.log('Subcollections :' + JSON.stringify(listCollectionsForOutput));
  } catch (error) {
    console.log((error as Error).message);
  }
  if (!listCollections.length) return;

  for (const item of itemId) {
    FinalOutput = await addItemToCollection(item, zotero, listCollections, testmode, FinalOutput, ignoretag, addtag);
    for (const element of listCollections) {
      element.situation = 'nothing';
    }
  }
  if (testmode) {
    console.log('\n\nOutput:\n' + FinalOutput);
  }
}

export { collection, CommanderOptions };
