export type ZoteroItem = {
  key: string;
  title: string;
  abstractNote: string;
  tags: [{ tag: string }];
  collections: string[];
};

export type ZoteroCollections = {
  terms: { term: string; type: string }[];
  collection: string;
  collection_name: string;
  situation: string;
}[];
