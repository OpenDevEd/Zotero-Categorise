import Zotero from 'zotero-lib';

type ZoterItem = {
  title: string;
  abstractNote: string;
  tags: [{ tag: string }];
  collections: string[];
};

type ZoteroCollections = {
  terms: string[];
  collection: string;
  collection_name: string;
  situation: string;
}[];

function getCollectionLetters(collection: string) {
  if (collection.includes('/')) {
    const words = collection.split('/');
    return words[words.length - 1];
  }
  return collection;
}

async function addItemToCollection(
  itemId: string,
  zotero: Zotero,
  listCollections: ZoteroCollections,
  testmode: boolean,
  FinalOutput: string,
  ignoretag?: string,
  addtag?: string
) {
  let result: ZoterItem;
  try {
    result = await zotero.item({ key: itemId });

    if (ignoretag) {
      for (const elTag of result.tags) {
        if (elTag.tag.toLowerCase() === ignoretag.toLowerCase()) {
          FinalOutput += 'Item ' + itemId + ' has the tag ' + ignoretag + ' so it will be ignored' + '\n';
          console.log('Item ' + itemId + ' has the tag ' + ignoretag + ' so it will be ignored');
          return FinalOutput;
        }
      }
    }
    if (addtag) {
      result.tags.push({ tag: addtag });
      await zotero.update_item({
        key: itemId,
        json: { tags: result.tags },
        verbose: false,
      });
      FinalOutput += 'Add tag ' + addtag + ' to item ' + itemId + '\n';
      console.log('Add tag ' + addtag + ' to item ' + itemId);
    }
    FinalOutput += 'Get item data :' + itemId + '\n';
    console.log('Get item data :' + itemId);
    if (!result) throw new Error('not found');
    // check if the item is already in the collection
    for (const el of listCollections) {
      if (result.collections.includes(getCollectionLetters(el.collection))) el.situation = 'already_exist';
    }
    const alreadyCollections = listCollections.filter(
      (item: { situation: string }) => item.situation === 'already_exist'
    );
    const alreadyCollectionsFiltered = alreadyCollections.map((item) => getCollectionLetters(item.collection));
    FinalOutput +=
      `Subcollections that already have the item ${itemId}: ` + JSON.stringify(alreadyCollectionsFiltered) + '\n';
    console.log(`Subcollections that already have the item ${itemId}: ` + JSON.stringify(alreadyCollectionsFiltered));

    // get the item data and check if it contains the terms of the sub collections
    for (const element of listCollections) {
      if (element.situation === 'already_exist') continue;
      for (const term of element.terms) {
        const searchFor = term.toLowerCase();
        const resultIncludes =
          result.title.toLowerCase().includes(searchFor) ||
          result.abstractNote.toLowerCase().includes(searchFor) ||
          result.tags.some((tag: { tag: string }) => tag.tag.toLowerCase().includes(searchFor));
        if (resultIncludes) {
          element.situation = 'to_add';
          break;
        }
      }
    }
  } catch (error) {
    console.log(`error happend when retreving ${itemId}`);
    process.exit(0);
  }
  // get the sub collections that will have the item
  const targetCollections = listCollections.filter((item: { situation: string }) => item.situation === 'to_add');
  const targetCollectionsFiltered = targetCollections.map((item) => getCollectionLetters(item.collection));
  FinalOutput +=
    'Collections where item ' + itemId + ' will be added:  ' + JSON.stringify(targetCollectionsFiltered) + '\n';
  console.log('Collections where item ' + itemId + ' will be added:  ' + JSON.stringify(targetCollectionsFiltered));

  if (testmode) {
    return FinalOutput;
  }
  // add the item to the sub collections
  if (targetCollectionsFiltered.length) {
    try {
      await zotero.item({
        key: itemId,
        addtocollection: targetCollectionsFiltered,
        verbose: false,
      });
    } catch (error) {
      console.log(`error happend when retreving ${itemId}`);
      process.exit(0);
    }
  }
  return FinalOutput;
}
export { addItemToCollection };
