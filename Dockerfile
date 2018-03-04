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
WORKDIR server
RUN pwd
RUN ls -la

# Install dependencies
RUN echo trying npm install
RUN npm install

# Expose port
EXPOSE  3000

RUN pwd
RUN echo trying entrypoint
# Run app
ENTRYPOINT ["node", "server.js"]
