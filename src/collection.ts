import Zotero from 'zotero-lib';
type CommanderOptions = {
  item: string[];
  collection: string;
  group: string;
  test: boolean;
};

type Collection = {
  data: {
    name: string;
    key: string;
  };
  meta?: { numCollections: number; numItems: number };
};
type ZoterItem = {
  title: string;
  abstractNote: string;
  tags: [{ tag: string }];
  collections: string[];
};

async function addItemToCollection(
  itemId: string,
  zotero: Zotero,
  listCollections: [string, string, boolean][],
  testmode:boolean,
  FinalOutput:string
) {
  let result: ZoterItem;
  try {
    result = await zotero.item({ key: itemId });
    FinalOutput+="Get item data :"+itemId+"\n";
    if (!result) throw new Error('not found');
    for (const el of listCollections) {
      if (result.collections.includes(el[1])) el[2] = true;
    }
    // get list of collections that 3rd element is true
    const listCollectionsForOutput = listCollections
      .filter((item: [string, string, boolean]) => item[2] === true)
      .map((item: [string, string, boolean]) => [item[0], item[1]]);
    FinalOutput+="Subcollections that already have the item: "+JSON.stringify(listCollectionsForOutput)+"\n";

    listCollections = listCollections.filter(
      (item: [string, string, boolean]) => item[2] !== true
    );
    FinalOutput+="Subcollections that do not have the item : "+JSON.stringify(listCollections)+"\n";
    
    listCollections.map(async (collectionkey: [string, string, boolean]) => {
      const searchFor = collectionkey[0].toLowerCase();
      const resultIncludes =
        result.title.toLowerCase().includes(searchFor) ||
        result.abstractNote.toLowerCase().includes(searchFor) ||
        result.tags.some((tag: { tag: string }) =>
          tag.tag.toLowerCase().includes(searchFor)
        );
      if (resultIncludes) collectionkey[2] = true;
    });
  } catch (error) {
    console.log(`error happend when retreving ${itemId}`);
    process.exit(0);
  }
  const secondElements = listCollections
    .filter((item: [string, string, boolean]) => item[2] === true)
    .map((item: [string, string, boolean]) => item[1]);
  FinalOutput+="Collections where item "+itemId+" will be added:  "+JSON.stringify(secondElements)+"\n";
  
  if(testmode)
  {
    console.log("\n\nFinalOutput:",FinalOutput);
    return;    
  }
  if(secondElements.length)
  {
    try {
      await zotero.item({
        key: itemId,
        addtocollection: secondElements,
        verbose: false,
      });
    } catch (error) {
      console.log(`error happend when retreving ${itemId}`);
      process.exit(0);
    }
  }
}

type Options = {
  key: string[];
  group?: string;
  top?: boolean;
  verbose?: boolean

};

async function collection(commanderOptions: CommanderOptions) {
  let FinalOutput="";
  const itemId = commanderOptions.item;
  const collectionId = commanderOptions.collection;
  const testmode=commanderOptions.test;
  if (!itemId.length || !collectionId) {
    console.log('Please provide an item, collection, and group id');
    return;
  }
  const groupid = commanderOptions.group;

  const zotero = new Zotero({ verbose: false });
  const options: Options = {
    top: false,
    key: [collectionId],
    verbose: false
  };
  if (groupid) {
    options.group = groupid;
  }
  const listCollections: [string, string, boolean][] = [];
  let result: Collection;
  try {
    result = await zotero.collection(options);
    FinalOutput+="Number of subcollections for "+JSON.stringify(collectionId)+"  : ";
    
    if (!result)
    throw new Error(`There is no collection with this key ${collectionId}`);
    FinalOutput+=result.meta?.numCollections+"\n";
    if (result.meta?.numCollections == 0)
      throw new Error(
        `There is no sub collection in this collection ${collectionId} please add a sub collection`
      );

    const results: Collection[] = await zotero.collections(options);
    results.forEach(async (collectionkey: Collection) => {
      listCollections.push([
        collectionkey.data.name,
        collectionkey.data.key,
        false,
      ]);
    });
    // make list without 3rd element
    const listCollectionsForOutput = listCollections.map(
      (item: [string, string, boolean]) => [item[0], item[1]]
    );
    FinalOutput+="Subcollections :"+JSON.stringify(listCollectionsForOutput)+"\n";
  } catch (error) {
    console.log((error as Error).message);
  }
  if (!listCollections.length) return;
  for (const item of itemId) {
    await addItemToCollection(item, zotero, listCollections,testmode,FinalOutput);
  }
}

export { collection, CommanderOptions };
