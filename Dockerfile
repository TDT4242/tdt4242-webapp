FROM    ubuntu:trusty

# File Author / Maintainer
MAINTAINER Stein-Aage Klaussen


RUN apt-get update && \
    apt-get -y install curl

# Install Node.jssssss
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install python build-essential nodejs

RUN pwd
WORKDIR .
COPY . .
RUN pwd
RUN ls -la

# Install dependencies
RUN echo trying npm install
RUN npm install

WORKDIR server
RUN pwd
RUN ls -la


# Expose port
EXPOSE  3000


# Run app
CMD ["node", "server.js"]
