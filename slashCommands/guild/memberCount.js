const { SlashCommandBuilder } = require('@discordjs/builders');

const commandName = 'member-count';
module.exports = {
  name: commandName,
  guilds: [], // Array of Guild IDs (strings)
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Get information about this guild!'),
  async execute(interaction) {
    return interaction.reply(`${interaction.guild.name} has ${interaction.guild.memberCount} members.`);
  }
};