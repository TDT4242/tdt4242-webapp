FROM    ubuntu:trusty

# File Author / Maintainer
MAINTAINER Stein-Aage Klaussen


RUN apt-get update && \
    apt-get -y install curl

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install python build-essential nodejs


WORKDIR /src
ADD . /src

ADD . /src/server

# Install dependencies
RUN cd server && npm install

# Expose port
EXPOSE  3000

WORKDIR /src/server

# Run app
CMD ["node", "server.js"]
