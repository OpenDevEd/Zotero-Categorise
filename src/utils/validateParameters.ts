export function validateMatchfield(matchfield?: string[]) {
  // default matchfields
  if (!matchfield || matchfield.includes('all')) {
    matchfield = ['title', 'tags', 'description'];
  }

  for (const field of matchfield) {
    if (!['title', 'tags', 'description'].includes(field)) {
      console.log(`--matchfield only accepts one or more of title, tags, description or all, separated by commas`);
      process.exit(1);
    }
  }

  return matchfield;
}
