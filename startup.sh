#!/bin/bash

docker rm -f $(docker ps -a -q)
docker rmi $(docker images -q)
docker pull mugthakk/tdt4242
pwd
ls -la
cd server && ls -la && cd ..
docker run -t -p 3000:80 mugthakk/tdt4242 