const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { lyricsExtractor } = require('@discord-player/extractor');

const lyricsFinder = lyricsExtractor();
module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Lyrics of the current song'),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);

    const lyrics = await lyricsFinder
      .search(queue.currentTrack.title)
      .catch(() => null);
    if (!lyrics)
      return interaction.followUp({
        content: 'No lyrics found',
        ephemeral: true,
      });
    if (!queue)
      return await interaction.editReply('There are no songs in the queue');

    const trimmedLyrics = lyrics.lyrics.substring(0, 4000);

    const embed = new EmbedBuilder()
      .setTitle(lyrics.title)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.thumbnail)
      .setAuthor({
        name: lyrics.artist.name,
        iconURL: lyrics.artist.image,
        url: lyrics.artist.url,
      })
      .setDescription(
        trimmedLyrics.length === 4000 ? `${trimmedLyrics}...` : trimmedLyrics
      )
      .setColor('Yellow');

    await interaction.editReply({ embeds: [embed] });
  },
};
