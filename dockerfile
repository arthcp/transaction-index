##############################################################
#                                                            #
# Dockerfile to build transaction-indexer images             #
# Server will listen on port 3000 after indexing is complete #
#                                                            #
##############################################################

# Set the base image to Ubuntu
FROM ubuntu
RUN apt update -y
RUN apt upgrade -y

# Install tools
RUN apt install -y mongodb nodejs npm git

# Start mongodb server and expose its port
EXPOSE 27017
RUN service mongodb start

# Copy project files
COPY package.json /usr/src/
COPY package-lock.json /usr/src/
COPY config.json /usr/src/
COPY src/* /usr/src/

# set work directory
WORKDIR /usr/src/

# Install node modules
RUN npm install

# Index transactions
RUN node src/blockIndexer.js

# Start server
RUN node src/api.js

# Expose port for server
EXPOSE 3000