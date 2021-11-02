# Discord Bot Template
If you want to make a Discord bot, this is a good place to start.

## Required Software
- [git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)

## Create a Discord bot and run it for the first time
1. You will need to access the [Discord Developer Portal](https://discord.com/developers/applications) and create an
application.
2. Note the `Application ID`.
3. Click the "Bot" button on the sidebar.
4. Click the "Add Bot" button and confirm the dialog.
5. Note the `Token`.
6. Access the [Permissions Calculator](https://discordapi.com/permissions.html) and determine what permissions your
bot will need, then copy the URL at the bottom of the page.
7. Navigate to the link in your URL, and grant the bot access to your server.
8. Run the following commands in a terminal
```shell
git clone https://github.com/LegendaryLinux/DiscordBotTemplate.git
cd DiscordBotTemplate
npm install
```

9. Create a new file called `config.json` and place it in the root directory of the project, then copy the contents of
`config.example.json` into it.
10. Put your Application ID and Token into `config.json` where specified.
11. Back in your terminal, run
```shell
npm run dev
```
12. Observe the bot has come online in your Discord server
13. Type `!hello` to have the bot reply to you.

## Repository Contents
