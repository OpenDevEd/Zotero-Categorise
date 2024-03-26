/**
 * Type representing a Zotero item.
 */
export type ZoteroItem = {
  key: string;
  title: string;
  abstractNote: string;
  tags: [{ tag: string }];
  collections: string[];
};

/**
 * Type representing a list of Zotero collections.
 */
export type ZoteroCollections = {
  terms: { term: string; type: string }[];
  collection: string;
  collection_name: string;
  situation: string;
}[];
