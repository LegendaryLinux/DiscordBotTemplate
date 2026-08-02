const {
  LabelBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

module.exports = async (client, interaction) => {
  // Ignore irrelevant events
  if (!interaction.isButton()) { return; }

  // If the interaction's custom id does not match this file's intent, do nothing
  if (interaction?.customId !== 'example-button') { return; }

  // Handle the button click
  const modal = new ModalBuilder()
    .setCustomId('example-modal')
    .setTitle('Example Modal')
    .addLabelComponents(
      new LabelBuilder()
        .setLabel('Example field')
        .setDescription('Enter a value to submit.')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('exampleFieldName')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter an example value')
            .setRequired(true)
        )
    );

  return interaction.showModal(modal);
};
