import Zotero from 'zotero-lib';

type CommanderOptions = {
  item: string[];
  collection: string;
  group: string;
};

type Collection = {
  data: {
    name: string;
    key: string;
  };
  meta?:{ numCollections: number; numItems: number }
};
type ZoterItem={
  title:string;
  abstractNote:string;
  tags:[{tag:string}];
}

async function addItemToCollection(
  itemId: string,
  zotero: Zotero,
  listCollections: [string, string, boolean][]
) {
  let result:ZoterItem;
  try {
    result = await zotero.item({key: itemId});
    if(!result)
      throw new Error("not found");
      
    
    listCollections.map(async (collectionkey: [string, string, boolean]) => {
      const searchFor = collectionkey[0].toLowerCase();
      collectionkey[2] =
        result.title.toLowerCase().includes(searchFor) ||
        result.abstractNote.toLowerCase().includes(searchFor) ||
        result.tags.some((tag: { tag: string }) =>
          tag.tag.toLowerCase().includes(searchFor)
        );
    });
  }catch (error) {
    console.log(`error happend when retreving ${itemId}`);
    process.exit(0);
  }
  const secondElements = listCollections
    .filter((item: [string, string, boolean]) => item[2] === true)
    .map((item: [string, string, boolean]) => item[1]);
  try {
    await zotero.item({
      key: itemId,
      addtocollection: secondElements,
      verbose: true,
    });

  } catch (error) {
    console.log(`error happend when retreving ${itemId}`);
    process.exit(0);

  }
}


type Options = {
  key: string[];
  group?: string;
  top?: boolean;
};

async function collection(commanderOptions: CommanderOptions) {
  const itemId = commanderOptions.item;
  const collectionId = commanderOptions.collection;
  if (!itemId.length || !collectionId) {
    console.log('Please provide an item, collection, and group id');
    return;
  }
  const groupid = commanderOptions.group;

  const zotero = new Zotero({ verbose: true });
  const options: Options = {
    top: false,
    key: [collectionId],
  };
  if (groupid) {
    options.group = groupid;
  }  
  const listCollections: [string, string, boolean][] = [];
  let result: Collection ;
  try {
    result =  await zotero.collection(options);
    if(!result)
      throw new Error(`There is no collection with this key ${collectionId}`);
    if(result.meta?.numCollections==0)
      throw new Error(`There is no sub collection in this collection ${collectionId} please add a sub collection`);

    const results:Collection[]=await zotero.collections(options);
    results.forEach(async (collectionkey: Collection) => {
      listCollections.push([
        collectionkey.data.name,
        collectionkey.data.key,
        false,
      ]);
    });
  }catch (error) {
    console.log((error as Error).message);
  
  }

  for (const item of itemId) {
    
    await addItemToCollection(item, zotero, listCollections);
  }
}

export { collection, CommanderOptions };