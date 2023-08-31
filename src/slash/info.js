const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Displays info about the currently playing song'),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);

    if (!queue || !queue.currentTrack)
      return await interaction.editReply('There are no songs in the queue');

    let bar = queue.node.createProgressBar({
      queue: false,
      length: 19,
    });

    const currentTrack = queue.currentTrack;

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('#7f0aad')
          .setAuthor({ name: 'Trackinfo 🎵' })
          .setThumbnail(currentTrack.thumbnail)
          .setDescription(
            `Currently Playing [${currentTrack.title}](${currentTrack.url})\n\n` +
              `~ Requested by: ${currentTrack.requestedBy.toString()} \n\n` +
              bar
          ),
      ],
    });
  },
};
