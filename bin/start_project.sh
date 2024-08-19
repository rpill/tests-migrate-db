#!/bin/bash

echo "ЗАПУСК ПРОЕКТА"
cp $DIR_TESTS/data/.env.example $GITHUB_WORKSPACE/backend/.env
cd $DIR_TESTS/data
docker compose up -d

cd $GITHUB_WORKSPACE/backend/
npm ci
npm run build
npm run start:dev &
