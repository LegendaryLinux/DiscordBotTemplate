const { InteractionContextType } = require(`discord.js`);
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('member-count')
    .setDescription('Get information about this guild!')
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    return interaction.reply({
      content: `${interaction.guild.name} has ${interaction.guild.memberCount} members.`,
    });
  }
};
