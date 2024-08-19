export default {
  translation: {
    structureError: {
      directory: 'Отсутствует директория `{{ name }}` и необходимые файлы в ней.',
      file: 'Отсутствует файл `{{ name }}.`',
    },
    scripts: {
      sectionMissing: 'В файле `package.json` отсутствует секция `scripts`.',
      commandMissing: 'В файле `package.json` отсутствует команда `{{ command }}`.',
    },
    eslintConfigError: 'Добавьте конфиг `{{ key }}`: `{{- value }}` в `rules` в файле `.eslintrc.`',
    trackingError: 'Добавьте запись `{{ pattern }}` в файл `.gitignore`.',
    editorConfigError: 'Добавьте запись `{{ config }}` в файл `{{ fileName }}`.',
    eslintErrors: 'Запустите команду `npm run lint` и исправьте ошибки в коде: {{- report }}'
  },
};
