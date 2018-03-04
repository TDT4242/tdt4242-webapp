FROM    ubuntu:trusty

# File Author / Maintainer
MAINTAINER Stein-Aage Klaussen


RUN apt-get update && \
    apt-get -y install curl

# Install Node.jssss
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install python build-essential nodejs

RUN pwd
WORKDIR .
COPY . .
RUN pwd
RUN ls -la
WORKDIR server
RUN ls -la

# Install dependencies
RUN npm install

# Expose port
EXPOSE  3000

# Run app
ENTRYPOINT ["node", "server.js"]
