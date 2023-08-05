const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('Skip to the given track, removing others on the way')
    .addNumberOption((option) =>
      option
        .setName('track')
        .setDescription('Track number to skip to')
        .setMinValue(1)
        .setRequired(true)
    ),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);
    const trackNumber = interaction.options.getNumber('track') - 1;
    if (!queue)
      return await interaction.editReply('There are no songs in the queue');
    if (trackNumber > queue.size || trackNumber < 0)
      return await interaction.editReply(
        'Provided track number does not exist'
      );

    queue.node.skipTo(trackNumber);
    const track = queue.tracks.toArray()[trackNumber];
    await interaction.editReply(
      `Jumped to track **[${track.title}](${track.url})**`
    );
  },
};
