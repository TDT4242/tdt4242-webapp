#!/bin/bash

docker rm -f $(docker ps -a -q)
docker rmi $(docker images -q)
docker build -t mugthakk/tdt4242:latest - < Dockerfile
pwd
ls -la
cd server && ls -la && cd ..
docker run -t -p 8080:3000 mugthakk/tdt4242 > /dev/null 2> /dev/null < /dev/null &