/**
 * Type representing the options passed to commander.
 */
export type CommanderOptions = {
  /** Zotero Group ID*/
  group: string;
  /** Array of Zotero collection IDs */
  collection: string[];
  /** Name of the JSON file that maps keywords to collections */
  name: string;
  /** Boolean indicating whether to recursively add subcollections to the list */
  recursive?: boolean;
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
  collection_name: string;
  collection: string;
  terms: [{ term: string; description: string; type: string }];
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
