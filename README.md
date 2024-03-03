# Zotero Categorise

A command-line tool to manage Zotero collections by placing items into specific collections based on their title, description, and tags.

## Configuration

To create a `zotero-cli.toml` file, follow these steps:

1. Open the terminal and create the `zotero-cli.toml` file using the `nano` text editor:

   ```bash
   mkdir -p ~/.config/zotero-cli
   nano ~/.config/zotero-cli/zotero-cli.toml
   ```

2. Inside the zotero-cli.toml file, add the following content:
   ```
   api-key = "YOUR_ZOTERO_API_KEY"
   group-id = 123
   library-type = "group"
   indent = 4
   ```

## Installation

To use this tool, you need to have Node.js installed on your system. You can install the required dependencies and run the tool with the following steps:

### Clone this repository to your local machine:

```
git clone https://github.com/OpenDevEd/Zotero-Categorise.git
cd Zotero-Categorise
npm install
```

### Binary

The package includes a binary `zotero-categorise`. You can install this with 
```
npm build
npm link
```
If you do that, you can use `zotero-categorise` below.

## Usage
Help:
```
zotero-categorise
zotero-categorise collection -h
zotero-categorise generate -h
zotero-categorise collectionByJson -h
```

### The `collection` command
You can use the `collection` command to place items into collections.

Here are the available options:

```
zotero-categorise collection -c <collection> -i <item...>
```

or

```
zotero-categorise collection -c zotero://select/groups/${Group-id}/collections/${CollectionId} -i zotero://select/Groups//${group-id}/items/${ItemId}
```

In this command, the option have this function:

- `-c, --collection <collection>`: The id of a collection, which has sub-collections in which you want to place the items.
- `-i, --item [item...]`: One or more Item Ids that you want to place in the collection.
- `--itemsfromcollection <collection>`: Process items in the provided collection.
- `--itemswithtag <tag>`: Process items with this tag.
- `--itemswithouttag <tag>`: Process items that do not have this tag.
- `--itemsfromlibrary`: Process all items in the library.

For example, if your collection structure is this:

```
Countries
- Sierra Leone
- Zambia
- Zimbabwe
```

Then by providing the collection id for 'Countries', items will be matched against Sierra Leone, Zambia, Zimbabwe, and placed in those collections.

### Generating Keyword-Collection Mapping

The `generate` command allows you to create a JSON file that maps keywords to collections. This mapping is useful for automating the categorization process by periodically scanning your Zotero items.

```
zotero-categorise generate -- -c [collection1] [collection2]
```

**Options:**

- `-g, --group [group]`: Specifies the Zotero group ID to work with.
- `-c, --collection [collection...]`: Lists the Zotero collection IDs to include in the mapping.
- `-n, --name [name]`: (Optional) Specifies the name of the JSON file that will be generated (default is 'list.json').

### Categorize Items from JSON File

The `collectionByJson` command enables you to categorize items from a JSON file into Zotero collections.

```
zotero-categorise collectionByJson -- -j [json file] -i [item...]
```

**Options:**

- `-j, --json [json]`: Specifies the JSON file that contains the keyword-collection mapping.
- `-i, --item [item...]`: One or more Item Ids that you want to categorize into collections.
- `--itemsfromcollection <collection>`: Process items in the provided collection.
- `--itemswithtag <tag>`: Process items with this tag.
- `--itemswithouttag <tag>`: Process items that do not have this tag.
- `--itemsfromlibrary`: Process all items in the library.
- `-t, --test`: Use test mode, which does not actually place items in the collection. This is useful for verification and testing.
