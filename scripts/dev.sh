#!/bin/bash
export NODE_ENV=development
mongod --config /usr/local/etc/mongod.conf --fork
nodemon --config nodemon.json src/index.ts
