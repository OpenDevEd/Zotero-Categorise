import { collection } from '../src/collection';

async function main() {
  console.log('Test No. 1');

  await collection({
    item: ['4AHCJ6P4'],
    collection: ['7XAM9PEM'],
    group: '2259720',
    test: false,
  }); // Place an item into a collection after checking its title/description and tags
  console.log('\n\n\n\nTest No. 2');

  await collection({
    item: ['4AHCJ6P4'],
    collection: ['7XAM9PEM'],
    group: '2259720',
    test: false,
    itemswithtag: '',
    itemswithouttag: '',
    itemsfromlibrary: false,
    itemsfromcollection: '',
  }); // check items if they have a tag or not or if they are from a collection or not or if they are from the library

  console.log('\n\n\n\nTest No. 3');
  await collection({
    item: ['4AHCJ6P4'],
    collection: ['7XAM9PEM'],
    group: '2259720',
    test: false,
    matchfield: ['title'],
  }); // check if the title of the item matches the title of the collection

  console.log('\n\n\n\nTest No. 4');
  await collection({
    item: ['4AHCJ6P4'],
    collection: ['7XAM9PEM'],
    group: '2259720',
    test: false,
    recursive: true,
  }); // Recursively add subcollections to the list
}

main();
