import Zotero from 'zotero-lib';
import { ZoteroCollections, ZoteroItem } from './types/addItemToCollection';

/**
 * Extracts the collection ID.
 *
 * @param {string} collection - The collection string to process.
 * @returns {string} - The last part of the collection string after the last '/' character,
 * or the original string if there is no '/' character.
 */
function getCollectionLetters(collection: string) {
  if (collection.includes('/')) {
    const words = collection.split('/');
    return words[words.length - 1];
  }
  return collection;
}

/**
 * Adds an item to a Zotero collection based on the provided options.
 *
 * @param {string | ZoteroItem} item - The item to be added to the collection. Can be a string or a ZoteroItem.
 * @param {Zotero} zotero - The Zotero instance to use for the operation.
 * @param {string[]} matchfield - The fields to match against when adding the item.
 * @param {ZoteroCollections} listCollections - The list of collections to add the item to.
 * @param {boolean} testmode - Whether to run the function in test mode.
 * @param {string} FinalOutput - The final output string.
 * @param {string[]} ignoretag - tags to ignore when adding the item.
 * @param {string[]} addtag - tags to add to the item.
 * @returns {Promise<string>} - A Promise that resolves with the final output string when the operation is finished.
 */
async function addItemToCollection(
  item: string | ZoteroItem,
  zotero: Zotero,
  matchfield: string[],
  listCollections: ZoteroCollections,
  testmode: boolean,
  FinalOutput: string,
  ignoretag: string[],
  addtag?: string[]
) {
  let result: ZoteroItem;
  const itemId = typeof item === 'string' ? item : item.key;

  try {
    if (typeof item === 'string') {
      result = await zotero.item({ key: item });
    } else {
      result = item;
    }

    for (const ignore of ignoretag) {
      for (const elTag of result.tags) {
        if (elTag.tag.toLowerCase() === ignore.toLowerCase()) {
          FinalOutput += 'Item ' + itemId + ' has the tag "' + ignore + '" so it will be ignored' + '\n';
          console.log('Item ' + itemId + ' has the tag "' + ignore + '" so it will be ignored');
          return FinalOutput;
        }
      }
    }

    if (addtag?.length) {
      for (const ell of addtag) {
        result.tags.push({ tag: ell });
      }
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
      if (!result.collections) el.situation = 'is_attachment';
      else if (result.collections.includes(getCollectionLetters(el.collection))) el.situation = 'already_exist';
    }
    const alreadyCollections = listCollections.filter(
      (item: { situation: string }) => item.situation === 'already_exist' || item.situation === 'is_attachment'
    );
    const alreadyCollectionsFiltered = alreadyCollections.map((item) => getCollectionLetters(item.collection));
    FinalOutput +=
      `Subcollections that already have the item ${itemId}: ` + JSON.stringify(alreadyCollectionsFiltered) + '\n';
    console.log(`Subcollections that already have the item ${itemId}: ` + JSON.stringify(alreadyCollectionsFiltered));

    // get the item data and check if it contains the terms of the sub collections
    for (const element of listCollections) {
      if (element.situation === 'already_exist') continue;
      for (const term of element.terms) {
        let searchFor: RegExp;
        if (term.type === 'word')
          searchFor = new RegExp('\\b' + term.term + '\\b', 'i'); // \b is for word boundary
        else if (term.type === 'regex') searchFor = new RegExp(term.term, 'i');
        else if (term.type === 'words') {
          // make the regex for the words
          const parts = term.term.split('/');
          const regex = parts[0] + '(?:' + parts.slice(1).join('|') + '?)';
          searchFor = new RegExp('\\b' + regex + '\\b', 'i');
        } else searchFor = new RegExp('\\b' + term.term + '\\b', 'i');
        const resultIncludes =
          (matchfield.includes('title') && searchFor.test(result.title)) ||
          (matchfield.includes('description') && searchFor.test(result.abstractNote)) ||
          (matchfield.includes('tags') && result.tags && result.tags.some((tag) => searchFor.test(tag.tag)));
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
