/**
 * Type representing the options passed to commander.
 */
export type CommanderOptions = {
  /** Zotero Group ID*/
  group: string;
  /** Array of Zotero collection IDs */
  collection: string[];
  /** Name of the JSON file that maps keywords to collections */
  name?: string;
  /** Boolean indicating whether to recursively add subcollections to the list */
  recursive?: boolean;
  /** Boolean indicating whether to run in test mode, i.e., do not actually place item in collection */
  test: boolean;
  /** JSON file from which to categorize items into Zotero collections */
  json?: string;
  /** Boolean indicating whether to create a tag that is the same as the collection name */
  addtags?: boolean;
  /** String to add as prefix to the tag */
  tagprefix?: string;
};

/**
 * Type representing the options for fetching items.
 */
export type Options = {
  key: string[];
  top?: boolean;
  verbose?: boolean;
  recursive?: boolean;
};

/**
 * Type representing a collection.
 */
export type Collection = {
  topic: string;
  collection: string;
  terms: [{ term: string; description: string; type: string }];
  tags?: string[];
};

/**
 * Type representing a response collection.
 */
export type ResCollection = {
  collections?: Collection[];
  source_collection?: string;
  source_collection_name?: string;
};

/**
 * Type representing a response list.
 */
export type ResList = {
  library?: string;
  source_collections?: ResCollection[];
  addtag?: string[];
  ignoretag?: string[];
};
