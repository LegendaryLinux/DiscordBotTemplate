const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageFlags } = require('discord.js');

const commandName = 'roll';
module.exports = {
  name: commandName,
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Roll a dice with a variable number of sides.')
    .addIntegerOption((option) => option
      .setName('sides')
      .setDescription('Number of sides on the dice')
      .setRequired(false))
    .addBooleanOption((option) => option
      .setName('private')
      .setDescription('Display result as an ephemeral message')
      .setRequired(false)),
  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') || 100; // Default to 100
    const isPrivate = interaction.options.getBoolean('private') || false; // Default to false
    const roll = Math.floor(Math.random() * sides) + 1;
    interaction.reply({
      content: `${interaction.user.username} rolled a \`d${sides}\` and got a \`${roll}\`.`,
      flags: isPrivate ? MessageFlags.Ephemeral : undefined
    });
  }
};