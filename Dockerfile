#BASE IMAGE
FROM node:alpine

#SET WORKING DIRECTORY
WORKDIR /app

#Copy package.json for dependency purposes
COPY package*.json ./

#INSTALL ALL DEPENDENCIES
RUN npm install

#COPY PROJECT FILES 
COPY . .

#EXPOSE PORT
EXPOSE 3000

# RUN SCRIPT
CMD ["/bin/sh","-c","npm run dev && npm run db:dev"]