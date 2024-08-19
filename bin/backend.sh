#!/bin/bash

echo "УСТАНОВКА ЗАВИСИМОСТЕЙ"
npm ci --prefix $GITHUB_WORKSPACE/backend
npm ci --prefix $DIR_TESTS > /dev/null

echo "ЗАПУСК ТЕСТОВ"
cd $DIR_TESTS || exit
node $DIR_TESTS/src/index.js $GITHUB_WORKSPACE
bash $DIR_TESTS/bin/result.sh
