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
      const typeGuardsRegex = /function .*\)\:[\w\s]+is[\w\s\.]+;/;
      if (typeGuardsRegex.test(line)) {
        // Exclude any type guard functions as these are for internal-use only
        continue;
      }

      // Remove any `declare` statements since we're now wrapping the whole file in our own `declare`
      const cleanedUpLine = line.replace('declare ', '');

      // Pad with 4 spaces to keep indentation correct
      cleanedLines.push(`    ${cleanedUpLine}`);
    }

    let removeNext = false;

    const filteredLines = cleanedLines.filter((line, index) => {
      if (removeNext) {
        removeNext = false;
        return false;
      }

      if (index + 1 >= cleanedLines.length) {
        return true;
      }

      const nextLine = cleanedLines[index + 1];
      if (line.endsWith('{') && nextLine.endsWith('}')) {
        // Remove empty blocks
        removeNext = true;
        return false;
      }

      return true;
    });

    const finalLines = [
      `declare module "consequences/${moduleName}" {`,
      ...filteredLines,
      '}'
    ];
    const finalContents = finalLines.reduce((file, line) => `${file}${line}\n`, '');
    fs.writeFileSync(outputFileLocation, finalContents);
  });
}

generateModule('addons');
generateModule('api');
