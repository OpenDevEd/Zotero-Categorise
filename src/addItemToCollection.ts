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

function get_collection_letters(collection: string) {
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
      for (const el_tag of result.tags) {
        if (el_tag.tag.toLowerCase() === ignoretag.toLowerCase()) {
          FinalOutput += 'Item ' + itemId + ' has the tag ' + ignoretag + ' so it will be ignored' + '\n';
          console.log('Item ' + itemId + ' has the tag ' + ignoretag + ' so it will be ignored');
          return FinalOutput;
        }
      }
    }
    if (addtag) {
      result.tags.push({ tag: addtag });
      const upres = await zotero.update_item({
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
    for (const el of listCollections) {
      if (result.collections.includes(get_collection_letters(el.collection))) el.situation = 'already_exist';
    }
    const alreadyCollections = listCollections.filter(
      (item: { situation: string }) => item.situation === 'already_exist'
    );
    const alreadyCollectionsFiltered = alreadyCollections.map((item) => get_collection_letters(item.collection));
    FinalOutput +=
      `Subcollections that already have the item ${itemId}: ` + JSON.stringify(alreadyCollectionsFiltered) + '\n';
    console.log(`Subcollections that already have the item ${itemId}: ` + JSON.stringify(alreadyCollectionsFiltered));

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

  const targetCollections = listCollections.filter((item: { situation: string }) => item.situation === 'to_add');
  const targetCollectionsFiltered = targetCollections.map((item) => get_collection_letters(item.collection));
  FinalOutput +=
    'Collections where item ' + itemId + ' will be added:  ' + JSON.stringify(targetCollectionsFiltered) + '\n';
  console.log('Collections where item ' + itemId + ' will be added:  ' + JSON.stringify(targetCollectionsFiltered));

  if (testmode) {
    return FinalOutput;
  }
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
