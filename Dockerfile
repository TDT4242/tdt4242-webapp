FROM ubuntu:trusty

# File Author / Maintainer
MAINTAINER Sander Aker Christiansen

RUN apt-get update && \
    apt-get -y install curl


# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install python build-essential nodejs

# Install git and pull down repo
RUN apt-get install -y git

ADD https://api.github.com/repos/tdt4242/tdt4242-webapp/git/refs/heads/master version.json
RUN git clone --depth=1 https://github.com/tdt4242/tdt4242-webapp.git
RUN cd tdt4242-webapp && git pull && cd ..

# Copy repo into container
COPY . .
WORKDIR tdt4242-webapp

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Run app
WORKDIR server
CMD ["node", "server.js"]
