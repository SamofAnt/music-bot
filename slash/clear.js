const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear the whole queue'),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);

    if (!queue)
      return await interaction.editReply('There are no songs in the queue');

    queue.tracks.clear();
    await interaction.editReply('Queue has been cleared');
  },
};
