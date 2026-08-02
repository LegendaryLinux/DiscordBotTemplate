const { MessageFlags } = require('discord.js');

module.exports = async (client, interaction) => {
  // Ignore irrelevant events
  if (!interaction.isModalSubmit()) { return; }

  // If the interaction's custom id does not match this file's intent, do nothing
  if (interaction?.customId !== 'example-modal') { return; }

  // Get modal values
  const exampleValue = interaction.fields.getTextInputValue('exampleFieldName');

  return interaction.reply({
    content: 'Your request has been submitted.',
    flags: MessageFlags.Ephemeral,
  });
};