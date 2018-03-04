FROM    ubuntu:trusty

# File Author / Maintainer
MAINTAINER Stein-Aage Klaussen


RUN apt-get update && \
    apt-get -y install curl

RUN apt-get install -y git

# Install Node.jssssss
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install python build-essential nodejs

RUN git clone https://github.com/TDT4242/tdt4242-webapp.git

RUN ls -la
RUN pwd
COPY . .
WORKDIR tdt4242-webapp
# Install dependencies
RUN pwd
RUN ls -la
RUN echo trying npm install
RUN npm install

WORKDIR server
RUN pwd
RUN ls -la


# Expose port
EXPOSE  3000


# Run app
CMD ["node", "server.js"]
