#!/bin/bash

set -e
set -a
source docker.env
set +a

docker compose down -v
pnpm clean