const { InteractionContextType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require(`discord.js`);
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summon-example-button')
    .setDescription('Get information about this guild!')
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Example Button')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('example-button')
    );

    return interaction.reply({
      content: 'It is I! Example Button!',
      components: [buttonRow],
    });
  }
};
