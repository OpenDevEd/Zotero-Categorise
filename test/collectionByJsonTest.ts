import { collectionByJSon } from '../src/collectionByJSon';

async function main() {
  await collectionByJSon({
    item: ['4AHCJ6P4'],
    json: '../list.json',
    group: '2259720',
    test: false,
  }); // categorize items from a JSON file into Zotero collections based on the items id.

  // await collectionByJSon({
  //   json: '../list.json',
  //   group: '2259720',
  //   test: false,
  //   itemsfromlibrary: true,
  // }); // categorize items from a JSON file into Zotero collections based on the items in the library.

  await collectionByJSon({
    json: '../list.json',
    group: '2259720',
    test: false,
    itemswithtag: 'test',
  }); // categorize items from a JSON file into Zotero collections based on the items with the tag 'test'.

  await collectionByJSon({
    json: '../list.json',
    group: '2259720',
    test: false,
    itemsfromcollection: 'WNVPT6C7',
  }); // categorize items from a JSON file into Zotero collections based on the items in the collection 'test'.

  // await collectionByJSon({
  //   json: '../list.json',
  //   group: '2259720',
  //   test: false,
  //   itemswithouttag: 'test',
  // }); // categorize items from a JSON file into Zotero collections based on the items without the tag 'test'.
}

main();
