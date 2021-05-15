## Setup Debian

- Install Git - https://www.digitalocean.com/community/tutorials/how-to-install-git-on-debian-10
- Install NPM and Node - https://github.com/nodesource/distributions/blob/master/README.md#debinstall

## Starting Server

### Local

Run the command: `mongod --config /usr/local/etc/mongod.conf --fork`

## Stopping Server

### Local

Find PID for mongod `ps -A | grep mongod | awk '{print $1}'`
Kill mongod process `kill -2 ${pid}`

## Set up MongoDB security

See https://docs.mongodb.com/manual/tutorial/enable-authentication/

## Compute Engine

- The process is run via Supervisor
- The application is run as the "nodeapp" user
- See https://cloud.google.com/nodejs/getting-started/getting-started-on-compute-engine for more info
