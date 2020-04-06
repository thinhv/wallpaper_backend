#!/usr/bin/env sh

set -x
npm run build

kill $(cat .pidfile)
npm start &
sleep 1

echo $! > .pidfile
set +x
