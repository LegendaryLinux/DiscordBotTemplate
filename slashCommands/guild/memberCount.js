const { SlashCommandBuilder } = require('@discordjs/builders');
const guilds = require('./guildIds.json');

const commandName = 'member-count';
module.exports = {
  name: commandName,
  guilds: guilds.memberCount,
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Get information about this guild!'),
  async execute(interaction) {
    return interaction.reply(`${interaction.guild.name} has ${interaction.guild.memberCount} members.`);
  }
};