/**
 * Type representing the options passed to commander.
 */
export type CommanderOptions = {
  /** Array of item IDs to process */
  item: string[];
  /** Collection ID from which to process items */
  itemsfromcollection?: string;
  /** Tag with which to process items */
  itemswithtag?: string;
  /** Tag without which to process items */
  itemswithouttag?: string;
  /** Boolean indicating whether to process all items in the library */
  itemsfromlibrary?: boolean;
  /** Array of fields to match. Can be one or more of title, tags, description or all */
  matchfield?: string[];
  /** Array of collection IDs to place item in */
  collection: string[];
  /** Group ID to place item in */
  group: string;
  /** Boolean indicating whether to run in test mode, i.e., do not actually place item in collection */
  test: boolean;
  /** Name of the JSON file */
  name?: string;
  /** JSON file from which to categorize items into Zotero collections */
  json?: string;
  /** Array of Zotero tags to ignore when processing items */
  ignoretag?: string[];
  /** Array of tags to add to the item */
  addtag?: string[];
  /** Boolean indicating whether to recursively add subcollections to the list */
  recursive?: boolean;
};

/**
 * Type representing a Zotero collection.
 */
export type Collection = {
  data: {
    name: string;
    key: string;
  };
  meta?: { numCollections: number; numItems: number };
  children: Collection[];
};

/**
 * Type representing the options for fetching items from Zotero.
 */
export type Options = {
  key: string[];
  top?: boolean;
  verbose?: boolean;
  recursive?: boolean;
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
