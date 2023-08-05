const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { useHistory } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('back')
    .setDescription('Resumes the music'),

  run: async ({ client, interaction }) => {
    const history = useHistory(interaction.guild.id);
    await history.previous();
    if (!history)
      return await interaction.editReply('There are no songs in the queue');

    await interaction.editReply('Music has been returned!');
  },
};
