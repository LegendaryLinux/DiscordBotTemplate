const { SlashCommandBuilder } = require('@discordjs/builders');

const commandName = 'roll';
module.exports = {
  name: commandName,
  data: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription('Roll a dice with a variable number of sides.')
    .addIntegerOption((option) => option
      .setName('sides')
      .setDescription('Number of sides on the dice')
      .setRequired(false)),
  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') || 100;
    const roll = Math.floor(Math.random() * sides) + 1;
    interaction.reply(`${interaction.user.username} rolled a \`d${sides}\` and got a \`${roll}\`.`);
  }
};