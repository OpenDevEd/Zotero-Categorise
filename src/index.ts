import { Command } from 'commander';
import { collection, CommanderOptions } from './collection';


const program = new Command();

program.version('0.0.1');

program
  .option('-d, --debug', 'debug')
  .option('--quiet', 'do not print output to command line');

async function runner(
  fn: (options: CommanderOptions) => Promise<void>,
  options: CommanderOptions
) {
  await fn( options);
}

program
  .command('collection')
  .description(
    'place an item into a collection after checking its title/description and tags'
  )
  .option('-c, --collection <collection>', 'Collection Id to place item in')
  .option('-i, --item [item...]', 'Item Id to place in collection')
  .option('-g, --group <group>', 'Group Id to place item in')
  .option('-t, --test', 'test mode, do not actually place item in collection')
  .action(async (options) => {
    runner(collection, options);
  });

program.parse(process.argv);
