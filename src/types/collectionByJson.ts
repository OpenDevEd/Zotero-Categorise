type Subcollections = {
  collection_name: string;
  collection: string;
  terms: { term: string; description: string; type: string }[];
};

type ResCollection = {
  collections?: Subcollections[];
  source_collection: string;
  source_collection_name?: string;
};

export type ResList = {
  library: string;
  source_collections: ResCollection[];
  addtag: string[];
  ignoretag: string[];
};

export type CommanderOptions = {
  item: string[];
  itemsfromcollection: string;
  itemswithtag: string;
  itemswithouttag: string;
  itemsfromlibrary: boolean;
  matchfield?: string[];
  collection: string[];
  group: string;
  test: boolean;
  name: string;
  json?: string;
  ignoretag?: string[];
  addtag?: string[];
};

export type ZoteroCollections = {
  terms: { term: string; type: string }[];
  collection: string;
  collection_name: string;
  situation: string;
}[];
