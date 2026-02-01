#BASE IMAGE
FROM node:alpine

#SET WORKING DIRECTORY
WORKDIR /app

#Copy package.json for dependency purposes
COPY package*.json ./

#INSTALL ALL DEPENDENCIES
RUN npm install

# COPY PRISMA FILES BEFORE GENERATE
COPY prisma ./prisma

# GENERATE CLIENT INSIDE CONTAINER
RUN npx prisma generate

#COPY PROJECT FILES 
COPY . .

#EXPOSE PORT
EXPOSE 3000

# RUN SCRIPT
CMD ["npm", "run", "dev"]