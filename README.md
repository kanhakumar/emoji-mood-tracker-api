# emoji-mood-tracker-api
This API empowers users to record daily emotions  with emojis while integrating captivating features for an enriched experience and profound  insights.

# Prerequisites
postgres
npm
node

# Steps for installation
npm install
# Running the application
npm run start

# Libraries used
Node, Express, Sequelize, pg, crypto, jsonwebtoken, shortid

# Technical Decisions
1. Choice of Database - Based on the requirements, major parts of database calls were to read from the database, Sql databases like postgresql will help in achieving faster reading because of indexing, ACID properties and etc.
2. Sequelize - ORM is required to simplify the tasks of database queries and mapping them to the javascript objects. Sequelize is used due to the apis it provides.
3. jsonwebtoken - It is famously used for tokenise the login and use it for further authentication.
4. crypto - It is used to store the user credentials i.e password securely in salt and hash attributes. This library provides api to encrypt the password.
5. Express - It is used to create a server.
6. shortid - It is used to create linkId.

# Database Design
Here we are majorly dealing with 2 types of datas,
1. Mood Datas
2. User Datas
3. SharedLink MetaDatas

We created to tables for that.
1. User Table - id(PK), username(unique), salt, hash, sharingOption
2. MoodEntryTable - id, date(PK), userId(PK, FK), emoji, note. Here the *date* and *userId* is a composite key to identify a particular mood log. *userId* is the ForeignKey from User Table (id).
3. SharedLinkTable - id, linkId(unique), startDate, endDate, userId(FK). *userId* is the ForeignKey from User Table (id)

# Design Discussion of important features
## Sharing and Collaboration
A user will be able to share his/her past mood logs with others.
Implementation - 
1. An endpoint is designed where the user can log in and generate a link to share the logs history. Optional startdate and enddate can be added to share data in that range.
2. The whole metadata will be stored in the SharedLinkTable and can be retrieved when get the request to view the data(which the sharedData retrieving will use).
3. A separate endpoint is designed where we can get the *linkId* from the url query param. We can get the metadata linked to that linkedId like *startDate*, *endDate*, *userId*. It will check internally if the *sharingOption* is enabled or not for the user whose data we want to look at. If enabled we will share the datas.

## Emoji Suggestion
A user can get a suggestion of emoji based on the note he/she added.
Implementation - 
1. We can use *node-nlp* library to pre train(in supervise method) the model on some datas, and after that it will be used to suggest emoji based on the note.
2. It can be further trained on performing cron job per day on all the entries we got in the Mood Entry table.
4. An endpoint will be designed where the user can provide the notes to get the suggestion.

# Thank you.
