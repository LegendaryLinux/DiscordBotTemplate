const { MessageFlags } = require('discord.js');

module.exports = async (client, interaction) => {
  // Ignore irrelevant events
  if (!interaction.isButton()) { return; }

  // If the interaction's custom id does not match this file's intent, do nothing
  if (interaction?.customId !== 'example-button') { return; }

  // Handle the button click

  return interaction.reply({
    content: 'You have clicked the example button!',
    flags: MessageFlags.Ephemeral,
  });
};