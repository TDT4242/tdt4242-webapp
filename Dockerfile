FROM jenkins:2.89.4

USER root

RUN apt-get -qq update \
   && apt-get -qq -y install \
   curl

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install python build-essential nodejs

USER jenkins


