FROM    ubuntu:trusty

# File Author / Maintainer
MAINTAINER Stein-Aage Klaussen


RUN apt-get update && \
    apt-get -y install curl

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install python build-essential nodejs

# Install wget
RUN apt-get -q -y update && \
	apt-get -q -y install wget && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* /var/cache/*

# Install wkhtmltopdf
RUN wget -q https://downloads.wkhtmltopdf.org/0.12/0.12.2.1/wkhtmltox-0.12.2.1_linux-trusty-amd64.deb && \
    dpkg -i wkhtmltox-0.12.2.1_linux-trusty-amd64.deb; \
    apt-get -q -y update && \
    apt-get -q -y install -f && \
	      apt-get clean && \
	      rm -rf /var/lib/apt/lists/* /var/cache/* wkhtmltox-0.12.2.1_linux-trusty-amd64.deb

WORKDIR /src
ADD . /src

# Install dependencies
RUN cd server && npm install

# Expose port
EXPOSE  3000

WORKDIR /src/server

# Run app
CMD ["node", "server.js"]
