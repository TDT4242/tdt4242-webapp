FROM ubuntu:trusty

# File Author / Maintainer
MAINTAINER Sander Aker Christiansen

RUN apt-get update && \
    apt-get -y install curl


# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install python build-essential nodejs

# navigate to working directory
WORKDIR /src
# copy all code from "the outside" into the working directory
ADD . /src

# Install dependencies
RUN pwd
RUN ls
RUN cd server && npm install

# navigate to a new working directory
WORKDIR /src/server

# Expose port
EXPOSE 3000

# Run app
CMD ["node", "server.js"]
