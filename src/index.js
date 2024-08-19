import path from 'path';
import { runTests } from './utils.js';
import ru from './locales/ru.js';
import { mkdir, mkfile } from '@hexlet/immutable-fs-trees';
import {
  checkStructure,
  checkScripts,
  checkTrackingFiles,
  checkEslint,
} from './tests.js';

const [, , PROJECT_PATH, LANG = 'ru'] = process.argv;

const app = async (projectPath, lng) => {
  const options = {
    projectPath,
    lang: lng,
    resources: {
      ru
    },
  };

  const check = async () => {
    const tree = mkdir('project', [
      mkdir('backend', [
        mkdir('src'),
        mkfile('package.json'),
        mkfile('.eslintrc.js'),
        mkfile('.gitignore'),
        mkfile('.env.example'),
        mkfile('tsconfig.json'),
      ]),
    ]);
    const structureErrors = checkStructure(projectPath, tree);

    if (structureErrors.length) {
      return structureErrors;
    }

    const projectBackendPath = path.join(projectPath, 'backend');

    const errors = (await Promise.all([
      checkScripts(path.join(projectBackendPath, 'package.json')),
      checkTrackingFiles(projectBackendPath, [
        { fileName: 'node_modules/test.js', pattern: 'node_modules' },
        { fileName: '.env', pattern: '.env' },
        { fileName: 'error.log', pattern: '*.log' },
        { fileName: 'request.log', pattern: '*.log' },
      ]),
      checkEslint(projectBackendPath),
    ]))
      .filter(Boolean)
      .flat();

    return errors;
  };

  await runTests(options, check);
};

app(PROJECT_PATH, LANG);