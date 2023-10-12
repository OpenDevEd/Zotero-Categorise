# Zotero Categorise

A command-line tool to manage Zotero collections by placing items into specific collections based on their title, description, and tags.

## Installation

To use this tool, you need to have Node.js installed on your system. You can install the required dependencies and run the tool with the following steps:

### Clone this repository to your local machine:

```
git clone https://github.com/OpenDevEd/Zotero-Categorise.git
cd Zotero-Categorise
npm install
```

## Usage

You can use the `collection` command to manage Zotero collections. Here are the available options:

```
npm start -- -c <collection> -i <item...>
```

or

```
npm start -- -c zotero://select/groups/${Group-id}/collections/${CollectionId} -i zotero://select/Groups//${group-id}/items/${ItemId}
```

- `-c, --collection <collection>`: The Collection Id where you want to place the items.
- `-i, --item [item...]`: One or more Item Ids that you want to place in the collection.

### Generating Keyword-Collection Mapping

The `generate` command allows you to create a JSON file that maps keywords to collections. This mapping is useful for automating the categorization process by periodically scanning your Zotero items.

```
npm run generate -- -c [collection1] [collection2]
```

**Options:**

- `-g, --group [group]`: Specifies the Zotero group ID to work with.
- `-c, --collection [collection...]`: Lists the Zotero collection IDs to include in the mapping.
- `-n, --name [name]`: (Optional) Specifies the name of the JSON file that will be generated (default is 'list.json').

### Categorize Items from JSON File

The `collectionByJson` command enables you to categorize items from a JSON file into Zotero collections.

```
npm run collectionByJson -- -j [json file] -i [item...] 
```


**Options:**

- `-j, --json [json]`: Specifies the JSON file that contains the keyword-collection mapping.
- `-i, --item [item...]`: One or more Item Ids that you want to categorize into collections.
- `-g, --group [group]`: The Group Id where you want to place the item(s).
- `-t, --test`: Use test mode, which does not actually place items in the collection. This is useful for verification and testing.

