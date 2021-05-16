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

### Setting up MongoDB

After running the startup script, MongoDB should be readily installed

Create admin user:

```
mongo
use admin
db.createUser(
  {
    user: "admin",
    pwd: passwordPrompt(), // or cleartext password
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
exit
```

After this, we need to require authentication to write to MongoDB by adding the following 2 lines to `/etc/mongod.conf`:

```
security:
  authorization: enabled
```

Restart MongoDB: `systemctl restart mongod`

### Run app w/ supervisor


