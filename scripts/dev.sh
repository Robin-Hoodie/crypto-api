#!/bin/bash
mongod --config /usr/local/etc/mongod.conf --fork
nodemon --config nodemon.json src/index.ts
