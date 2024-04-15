import { generate } from '../src/generate';

generate({
  collection: ['7XAM9PEM'],
  group: '2259720',
  test: true,
  name: 'generateTest1.json',
}); // generates a JSON file that maps keywords to collections

generate({
  collection: ['7XAM9PEM'],
  group: '2259720',
  test: true,
  recursive: true,
  name: 'generateTest2.json',
}); // generates a JSON file that maps keywords to collections with recursive subcollections

generate({
  collection: ['7XAM9PEM'],
  group: '2259720',
  test: true,
  name: 'generateTest3.json',
  addtags: true,
  tagprefix: 'Region:',
}); // generates a JSON file that maps keywords to collections with tags and tagprefix
