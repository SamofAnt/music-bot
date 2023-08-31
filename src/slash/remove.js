const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Skips the current song')
    .addNumberOption((option) =>
      option
        .setName('track')
        .setDescription('Track number of the queue')
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
    const track = queue.tracks.toArray()[trackNumber];
    queue.removeTrack(trackNumber);
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `**[${track.title}](${track.url})** has been removed from the queue`
          )
          .setThumbnail(track.thumbnail),
      ],
    });
  },
};
