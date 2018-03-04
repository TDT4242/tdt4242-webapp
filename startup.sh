#!/bin/bash

docker pull mugthakk/tdt4242
pwd
ls -la
cd server && ls -la && cd ..
docker stop $(docker ps -a -q)
docker run -t mugthakk/tdt4242 