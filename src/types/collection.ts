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
  recursive?: boolean;
};

export type Collection = {
  data: {
    name: string;
    key: string;
  };
  meta?: { numCollections: number; numItems: number };
  children: Collection[];
};

export type Options = {
  key: string[];
  top?: boolean;
  verbose?: boolean;
  recursive?: boolean;
};

export type ZoteroCollections = {
  terms: { term: string; type: string }[];
  collection: string;
  collection_name: string;
  situation: string;
}[];
