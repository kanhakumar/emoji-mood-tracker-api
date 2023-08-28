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
Node, Express, Sequelize, pg, crypto, jsonwebtoken

# Technical Decisions
1. Choice of Database - Based on the requirements, major parts of database calls were to read from the database, Sql databases like postgresql will help in achieving faster reading because of indexing, ACID properties and etc.
2. Sequelize - ORM is required to simplify the tasks of database queries and mapping them to the javascript objects. Sequelize is used due to the apis it provides.
3. jsonwebtoken - It is famously used for tokenise the login and use it for further authentication.
4. crypto - It is used to store the user credentials i.e password securely in salt and hash attributes. This library provides api to encrypt the password.
5. Express - It is used to create a server.

# Database Design
Here we are majorly dealing with 2 types of datas,
1. Mood Datas
2. User Datas

We created to tables for that.
1. User Table - id(PK), username(unique), salt, hash, sharingOption
3. MoodEntryTable - id, date(PK), userId(PK, FK), emoji, note. Here the *date* and *userId* is a composite key to identify a particular mood log. *userId* is the ForeignKey from User Table (id).

