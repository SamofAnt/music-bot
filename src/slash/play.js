const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType, useHistory } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('loads songs')

    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription("the song's or playlist's url")
        .setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel)
      return interaction.editReply(
        'You need to be in a VC to use this command'
      );

    const queue = client.player.nodes.create(interaction.guild, {
      leaveOnEmpty: false,
      leaveOnEnd: false,
      initialVolume: 75,
      leaveOnEmptyCooldown: 5000,
      metadata: interaction,
    });
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();
    const entry = queue.tasksQueue.acquire();
    await entry.getTask();
    let url = interaction.options.getString('url');
    const result = await client.player.search(url, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });
    if (result.tracks.length === 0) return interaction.editReply('No results');

    if (result.hasPlaylist()) {
      await queue.addTrack(result.tracks);
      const playlist = result.playlist;
      embed
        .setColor('#7f0aad')
        .setAuthor({ name: 'Plalist Info 🎵' })
        .setThumbnail(playlist.thumbnail)
        .setTimestamp()
        .setDescription(
          `**${result.tracks.length} songs from [${playlist?.title}](${playlist?.url})** have been added to the Queue`
        );
    } else {
      await queue.addTrack(result.tracks[0]);
      const song = result.tracks[0];
      embed
        .setColor('#7f0aad')
        .setAuthor({ name: 'Track Info 🎵' })
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the Queue`
        )
        .setThumbnail(song.thumbnail)
        .setTimestamp()
        .setFooter({ text: `Duration: ${song.duration}` });
    }
    try {
      if (!queue.isPlaying()) {
        await queue.node.play();
      }
    } finally {
      queue.tasksQueue.release();
    }

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
