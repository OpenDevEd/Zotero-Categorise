import Zotero from 'zotero-lib';
import fs from 'fs';
import { ZoteroItem, addItemToCollection } from './addItemToCollection';
type CommanderOptions = {
  item: string[];
  itemsfromcollection: string;
  itemswithtag: string;
  itemswithouttag: string;
  itemsfromlibrary: boolean;
  collection: string[];
  group: string;
  test: boolean;
  name: string;
  json?: string;
  ignoretag?: string[];
  addtag?: string[];
  recursive?: boolean;
};

type Collection = {
  data: {
    name: string;
    key: string;
  };
  meta?: { numCollections: number; numItems: number };
  children: Collection[];
};

type Options = {
  key: string[];
  top?: boolean;
  verbose?: boolean;
  recursive?: boolean;
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

  const ignoretag = commanderOptions.ignoretag || [];
  const addtag = commanderOptions.addtag || [];

  if (!collectionId) {
    console.log('Please provide a collection');
    return;
  }

  const { itemsfromcollection, itemswithtag, itemswithouttag, itemsfromlibrary } = commanderOptions;
  const itemOptions = [itemId, itemsfromcollection, itemswithtag, itemswithouttag, itemsfromlibrary];

  if (itemOptions.filter(Boolean).length > 1) {
    console.log('Only one of these options should be used at a time:');
    console.log('--item');
    console.log('--itemsfromcollection');
    console.log('--itemswithtag');
    console.log('--itemswithouttag');
    console.log('--itemsfromlibrary');
    return;
  }

  const groupid = commanderOptions.group;
  let zotero;
  if (groupid) {
    zotero = new Zotero({ verbose: false, 'group-id': groupid });
  } else {
    zotero = new Zotero({ verbose: false });
  }

  let items: (string | ZoteroItem)[] = itemId;
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

  const options: Options = {
    top: false,
    key: [collectionId[0]],
    verbose: false,
    recursive: commanderOptions.recursive,
  };
  const listCollections: ZoteroCollections = [];
  let result: Collection;
  try {
    // fetch the collection
    result = await zotero.collection(options);
    FinalOutput += 'Number of subcollections for ' + JSON.stringify(collectionId[0]) + '  : ';

    if (!result) {
      throw new Error(`There is no collection with this key ${collectionId[0]}`);
    }
    FinalOutput += result.meta?.numCollections + '\n';
    console.log(
      'Number of subcollections for ' + JSON.stringify(collectionId[0]) + '  : ' + result.meta?.numCollections
    );
    // check if there is sub collections
    if (result.meta?.numCollections == 0)
      throw new Error(`There is no sub collection in this collection ${collectionId[0]} please add a sub collection`);

    async function addChildren(listCollections: any, parent: any) {
      for (const child of parent.children) {
        listCollections.push({
          terms: [child.data.name],
          collection: child.data.key,
          collection_name: child.data.name,
          situation: 'nothing',
        });
        if (child.children.length > 0) {
          await addChildren(listCollections, child);
        }
      }
      // console.log('child', parent.children[0].data.name);
    }
    // fetch the sub collections
    const results: Collection[] = await zotero.collections(options);
    results.forEach(async (collectionkey: Collection) => {
      listCollections.push({
        terms: [collectionkey.data.name],
        collection: collectionkey.data.key,
        collection_name: collectionkey.data.name,
        situation: 'nothing',
      });
      if (options.recursive && collectionkey.children.length > 0) {
        await addChildren(listCollections, collectionkey);
      }
    });
    // fs.writeFileSync('listCollections.json', JSON.stringify(listCollections));
    const listCollectionsForOutput = listCollections.map((item) => [item.collection_name, item.collection]);
    FinalOutput += 'Subcollections :' + JSON.stringify(listCollectionsForOutput) + '\n';
    console.log('Subcollections :' + JSON.stringify(listCollectionsForOutput));
  } catch (error) {
    console.log((error as Error).message);
  }
  if (!listCollections.length) return;

  for (const item of items) {
    // add item to collection
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
