import fs from 'fs';
import path from 'path';
import dirTree from 'directory-tree';
import simpleGit from 'simple-git';
import shell from 'shelljs';
import {
  isDirectory,
} from '@hexlet/immutable-fs-trees';

const checkStructure = (source, expectedTree) => {
  const projectTree = dirTree(source, { attributes: ['type'] });

  const search = (canonicalTree, actualTree) => {
    const errors = canonicalTree.reduce((acc, item) => {
      const found = actualTree.find(({ name, type }) => item.name === name && item.type === type);
      if (!found) {
        return [...acc, {
          id: `structureError.${item.type}`,
          values: {
            name: item.name,
          },
        }];
      }

      if (isDirectory(item) && found) {
        return [...acc, ...search(item.children || [], found.children || [])];
      }

      return acc;
    }, []);

    return errors;
  };

  return search(expectedTree.children || [], projectTree.children || []);
};

const checkScripts = (filePath) => {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const commands = ['start', 'start:debug', 'lint'];
  const { scripts } = content;

  if (!scripts) {
    return [{ id: 'scripts.sectionMissing', }];
  }

  return commands.reduce((acc, command) => {
    if (!(command in scripts)) {
      return [
        ...acc,
        {
          id: 'scripts.commandMissing',
          values: { command }
        }
      ]
    }

    return acc;
  }, []);
};

const checkTrackingFiles = async (source, files) => {
  const git = simpleGit(source);

  return await files.reduce(async (errorsPromise, { fileName, pattern }) => {
    let errors = await errorsPromise;
    const filePath = path.join(source, fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, 'change');

    const status = await git.status();
    const isFoundNotAdded = status.not_added.find((file) =>
      path.basename(file) === path.basename(fileName)
    );
    const isFoundModified = status.modified.find((file) =>
      path.basename(file) === path.basename(fileName)
    );
    fs.unlinkSync(filePath);

    if (isFoundNotAdded || isFoundModified) {
      errors.push({
        id: 'trackingError',
        values: { pattern },
      });
    }

    return errors;
  }, []);
}

const checkEslint = (source) => {
  const reportFilepath = `${process.cwd()}/eslint-report.txt`;
  const { code } = shell.exec(`npx eslint "{src,apps,libs,test}/**/*.ts" --fix -o ${reportFilepath}`, { cwd: source });
  if (code !== 0) {
    const report = fs.readFileSync(reportFilepath, 'utf-8');
    fs.unlinkSync(reportFilepath);

    return [{
      id: 'eslintErrors',
      values: { report },
    }]
  }

  return [];
}

export {
  checkStructure,
  checkScripts,
  checkTrackingFiles,
  checkEslint,
};