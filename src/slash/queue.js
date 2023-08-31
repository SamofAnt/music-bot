const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const buttonPages = require('../functions/pagination');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('displays the current song queue')
    .addNumberOption((option) =>
      option
        .setName('page')
        .setDescription('Page number of the queue')
        .setMinValue(1)
    ),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);

    if (!queue.currentTrack || !queue) {
      return await interaction.editReply('There are no songs in the queue');
    }

    const totalPages = Math.ceil(queue.tracks.toArray().length / 10) || 1;
    const page = (interaction.options.getNumber('page') || 1) - 1;

    if (page > totalPages)
      return await interaction.editReply(
        `Invalid Page. There are only a total of ${totalPages} pages of songs`
      );
    console.log(queue.tracks.toArray().length);

    const currentTrack = queue.currentTrack;
    const pages = [];
    const tracks = queue.tracks.toArray();
    for (let page = 0; page < totalPages; page++) {
      const queueString = tracks
        .slice(page * 10, page * 10 + 10)
        .map((song, i) => {
          return `**${page * 10 + i + 1}. \`[${song.duration}]\` ${
            song.title
          } -- <@${song.requestedBy.id}> `;
        })
        .join('\n');
      pages.push(
        new EmbedBuilder()
          .setColor('#7f0aad')
          .setTitle('Playlist Information')

          .setThumbnail(currentTrack.thumbnail)
          .setDescription(
            `There are ${tracks.length} tracks in the queue\n\n` +
              `Duration of the current queue: ${queue.durationFormatted}\n\n` +
              `**Currently Playing\n` +
              (currentTrack
                ? `\` [${currentTrack.duration}]\` ${currentTrack.title} -- <@${currentTrack.requestedBy.id}>`
                : 'None') +
              `\n\n**Upcoming Songs\n${queueString}\n\n`
          )
          .setTimestamp()
          .setFooter({
            text: `Page ${page + 1} of ${totalPages}`,
          })
      );
    }
    buttonPages(interaction, pages, page);
  },
};
