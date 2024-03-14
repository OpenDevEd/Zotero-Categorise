export type CommanderOptions = {
  item: string[];
  collection: string[];
  group: string;
  test: boolean;
  name: string;
  json?: string;
  recursive?: boolean;
};

export type Options = {
  key: string[];
  top?: boolean;
  verbose?: boolean;
  recursive?: boolean;
};

export type Collection = {
  collection_name: string;
  collection: string;
  terms: [{ term: string; description: string; type: string }];
};

export type ResCollection = {
  collections?: Collection[];
  source_collection?: string;
  source_collection_name?: string;
};

export type ResList = {
  library?: string;
  source_collections?: ResCollection[];
  addtag?: string[];
  ignoretag?: string[];
};
