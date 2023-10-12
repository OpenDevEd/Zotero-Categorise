import fs from 'fs';
import { collection } from './collection';

type ResCollection = {
  terms?: string[];
  collection: string;
  collection_name?: string;
};

type ResList = {
  library?: string;
  collections: ResCollection[];
};
type CommanderOptions = {
  item: string[];
  collection: string[];
  group: string;
  test: boolean;
  name: string;
  json?: string;
};

async function generateByJSon(commanderOptions: CommanderOptions) {
  if (!commanderOptions.json) {
    console.log('Please provide a json file');
    return;
  }
  const jsonFile = commanderOptions.json;
  const data = await fs.readFileSync(jsonFile, 'utf8');
  const json: ResList = JSON.parse(data);
  if (!json.collections) {
    console.log('Please provide a json file with collections');
    return;
  }
  for (const element of json.collections) {
    const commanderOptions2: CommanderOptions = {
      item: commanderOptions.item,
      collection: [element.collection],
      group: commanderOptions.group,
      test: commanderOptions.test,
      name: commanderOptions.name,
    };
    console.log(commanderOptions2);
    await collection(commanderOptions2);
  }
}

export { generateByJSon };
