const { PermissionFlagsBits } = require('discord.js');
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const fs = require("fs");
const config = require('./config.json');

module.exports = {
  /**
   * Determine if a user has administrator permissions in a guild
   * @param guildMember
   */
  verifyIsAdmin: (guildMember) => guildMember.permissions.has(PermissionFlagsBits.Administrator),

  /**
   * Get an emoji object usable with Discord. Null if the Emoji is not usable in the provided guild.
   * @param guild
   * @param emoji
   * @returns String || Object || null
   */
  parseEmoji: (guild, emoji) => {
    const match = emoji.match(/^<:(.*):(\d+)>$/);
    if (match && match.length > 2) {
      const emojiObj = guild.emojis.resolve(match[2]);
      return emojiObj ? emojiObj : null;
    }

    const nodeEmoji = require('node-emoji');
    return nodeEmoji.has(emoji) ? emoji : null;
  },

  cachePartial: async (structure) => {
    if (!structure.partial) { return structure; }

    try {
      return await structure.fetch();
    } catch (error) {
      // Unknown message, code 10008
      if (error.code === 10008) {
        console.warn(`Unable to fetch partial ${structure.constructor.name}; it may have been deleted.`);
      }
      throw error;
    }
  },

  registerSlashCommands: async (client) => {
    // Register global slash commands
    const rest = new REST({ version: 10 }).setToken(config.token);
    const slashCommands = [];
    const slashCommandFiles = fs.readdirSync('./slashCommands').filter((file) => file.endsWith('.js'));
    slashCommandFiles.forEach((commandFile) => {
      const command = require(`./slashCommands/${commandFile}`)
      slashCommands.push(command.data.toJSON());

      // Set client to respond to slash commands
      client.commands.set(command.data.name, command);
    });
    try{
      await rest.put(Routes.applicationCommands(config.clientId), { body: slashCommands });
    } catch(error) { console.error(error); }
  },
};
