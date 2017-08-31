#!/usr/bin/env node

const exec = require('child_process').exec;
const fs = require('fs');

function generateModule(moduleName) {
  const outputFileLocation = `./types/${moduleName}/index.d.ts`;
  const command = `./node_modules/.bin/dts-bundle-generator ./types/${moduleName}/index.ts -o ${outputFileLocation}`;

  exec(command, (error) => {
    if (error) {
      throw new Error(error);
    }

    const fileContents = fs.readFileSync(outputFileLocation);
    const fileLines = fileContents.toString().split('\n');
    const cleanedLines = [];

    for (const line of fileLines) {
      if (line.includes('function validate')) {
        // Exclude any "validate*" functions as these are for internal-use only
        continue;
      }

      // Remove any `declare` statements since we're now wrapping the whole file in our own `declare`
      const cleanedUpLine = line.replace('declare ', '');

      // Pad with 4 spaces to keep indentation correct
      cleanedLines.push(`    ${cleanedUpLine}`);
    }

    const finalLines = [
      `declare module "consequences/${moduleName}" {`,
      ...cleanedLines,
      '}'
    ];
    const finalContents = finalLines.reduce((file, line) => `${file}${line}\n`, '');
    fs.writeFileSync(outputFileLocation, finalContents);
  });
}

generateModule('addons');
generateModule('api');
