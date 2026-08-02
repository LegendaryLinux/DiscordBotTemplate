const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('member-count')
    .setDescription('Get information about this guild!'),
  async execute(interaction) {
    return interaction.reply({
      content: `${interaction.guild.name} has ${interaction.guild.memberCount} members.`,
    });
  }
};
