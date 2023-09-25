
# Zotero Categorise

A command-line tool to manage Zotero collections by placing items into specific collections based on their title, description, and tags.

## Installation

To use this tool, you need to have Node.js installed on your system. You can install the required dependencies and run the tool with the following steps:
Clone this repository to your local machine:


#### Clone this repository to your local machine:

1. Clone this repository to your local machine:

 ```bash
 git clone https://github.com/OpenDevEd/Zotero-Categorise.git
  ```

2. Navigate to the project directory:

```bash
  cd Zotero-Categorise
```

3. Install the required Node.js packages:

```bash
  npm install
```

## Usage

You can use the collection command to manage Zotero collections. Here are the available options:

```
npm start -- collection -c <collection> -i <item...> 
```

or

```
npm start -- collection -c zotero://select/groups/${Group-id}/collections/${CollectionId} -i zotero://select/Groups//${group-id}/items/${ItemId}
```

- -c, --collection <collection>: The Collection Id where you want to place the items.
- -i, --item [item...]: One or more Item Ids that you want to place in the collection.
