#!/bin/sh

cp -r /usr/src/alt-app/* /usr/src/app && rm -rf /usr/src/alt-app
exec "$@"
