#!/bin/bash

docker rm -f $(docker ps -a -q)
docker rmi $(docker images -q)
pwd
ls -la
docker build -t mugthakk/tdt4242 - < Dockerfile
docker run -t -p 8080:3000 mugthakk/tdt4242 > /dev/null 2> /dev/null < /dev/null &