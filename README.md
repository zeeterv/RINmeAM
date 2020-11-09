<h1 align="center">Satomi 聡美</h1>
<h3 align="center">Your new waifu and general purpose Discord bot</h3>
<p align="center">
    <a title="CodeClimate" href="https://codeclimate.com/github/kyostra/satomi/maintainability"><img src="https://api.codeclimate.com/v1/badges/3cb373a64e81a2386ec7/maintainability" alt="CodeClimate" /></a>
    <a title="TravisCI" href="https://travis-ci.org/kyostra/satomi"><img src="https://img.shields.io/travis/kyostra/satomi.svg?style=flat" alt="TravisCI" /></a>
    <a title="DavidDM" href="https://david-dm.org/kyostra/satomi"><img src="https://img.shields.io/david/kyostra/satomi.svg?style=flat" alt="DavidDM" /></a>
    <a title="license" href="https://github.com/kyostra/satomi/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kyostra/satomi.svg" alt="License" /></a>
</p>

-------------------

Satomi is a discord bot created in JavaScript (Node.js) using Eris and Sylphy. It is currently a project of mine to learn JavaScript in a fun way. This bot was initially branded under Ryuko (from Kill la Kill) and written in [Discord.js](https://github.com/discordjs/discord.js) and using [Discord-Akairo](https://github.com/discord-akairo/discord-akairo). Though I deleted the repository/code after looking into and experimenting with Eris.

If you don't mind, you can check out Satomi's trello here -> [Trello Link](https://trello.com/b/TRspnxiz/satomi)

## Satomi is built on...
* [Node.js](https://nodejs.org/en/) : A Javascript runtime for scalable network applications
* [NPM](https://www.npmjs.com/) : The infamous package manger for JavaScript (yarn is a thing too)
* [Eris](https://github.com/abalabahaha/eris) : A Discord JavaScript Library for Node.js
* [Sylphy](https://github.com/pyraxo/sylphy) : A framework for Eris that is advanced and efficient
* [ESLint](https://eslint.org) : A configurable JavaScript linter for old and current ECMAScript versions
* [PM2](https://pm2.keymetrics.io/) : An advanced process manager for applications in production

## Want to invite Satomi?
As of right now, I am not done with Satomi's development. Im aiming for "public use" by version 1.0.0, as by then I hope to have most of the features I want on Satomi present. I also **do not** recommend anyone using the bot for their own until 1.0.0 due to the ever evolving structure of the code and how quickly database models can be changed within updates. After 1.0.0, there will be no changes in the database models as that would ruin public use. I also might not ever bring this bot online and just leave this here for others to use.

## Bot Usage
You are feely able to use the bot for your own server, change the name of it if you want to, and use for your own development. But leave my name in the files or some other way of creditting me as the creator because licenses are a thing and no one likes a takedown. And if you are confused about AGPL-3.0 license, heres a run down:

**You can**
* Use this for commercial reasons
* Distribute the code
* Modify the code
* Use and Modify in private

**You 100% have to**
* Make the source code available
* A license must be included
* Users have a right to see the source code
* Use the same license I use (Right now its AGPL-3.0)
* State what you changed in the code

**Other info**
* You can't hook me into what mess you got yourself into, you are liable for you actions
* There is no warranty (lol)

Also I might change the license at a later date, so keep an eye on the next updates if it occurs. It will be specified greatly if I changed it to ensure notice.

## Development
Thanks for your interest in my code, I have added some setup documentation below to get you familiar. Just pay attention to the [License](https://github.com/kyostra/satomi/blob/master/LICENSE) and what I said above.

### Installing
First you can either download the latest release or install through the console.
```
$ git clone https://github.com/kyostra/satomi.git
$ cd satomi/
$ npm install
```

### Linting
ESLint is used for this bot, in combonation with my [config](https://github.com/kyostra/eslint-config-kyostra). You can lint the code with following commands.
```
$ npm test
```
* You can also run `npm run lint` or `eslint src`

## Setup :
For `.env` and `.env.example`, leave the values empty for the example file (you need both files).
```env
# Bot configuration

# Bot Masterkeys
CLIENT_TOKEN=
CLIENT_PREFIX=
OWNER_ID=
ADMIN_IDS=

# Sharding
CLIENT_PROCESSES=
CLIENT_SHARDS_PER_PROCESS=

# Module Keys
HOME_ID=
GUILDJOINLOG_ID=
GUILDLEAVELOG_ID=

# MongoDB
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DBNAME=

# API
API_OSU=
API_REDDIT_ID=
API_REDDIT_SECRET=
API_REDDIT_REFRESH=
API_REDDIT_ACCESS=
```
* I suggest you delete `src/modules/mod/GuildLogger.js` and the `# Module Keys` section in `.env` and `.env.example`, this is for when the bot is in production
* This file will change during development and "production" due to new features

### Running the bot :
After setting up the env files, configure the `pm2-master.json` and `pm2-satomi.json` files to your liking. You need to run both files together.

```
$ pm2 start pm2-master.json
$ pm2 start pm2-satomi.json
$ pm2 logs
```

## License/Author
**Satomi** © [Kyostra](https://github.com/kyostra), Released under the [AGPL-3.0 License](https://github.com/kyostra/satomi/blob/master/LICENSE)

Created and maintained by Kyostra.

> Website - [kyostra.github.io](https://kyostra.github.io) | Github - [kyostra](https://github.com/kyostra) | Twitter - [@kyostra](https://twitter.com/kyostra) | Discord - **Kyostra#6290**
