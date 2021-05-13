## Starting Server

### Local

Run the command: `mongod --config /usr/local/etc/mongod.conf --fork`

## Stopping Server

### Local

Find PID for mongod `ps -e | mongod`
Kill mongod process `kill -2 ${pid}`
