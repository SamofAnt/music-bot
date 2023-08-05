const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('loads songs from youtube')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('song')
        .setDescription('Loads a single song from a url')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription("the song's url")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('playlist')
        .setDescription('Loads a playlist of songs from a url')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription("the playlist's url")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('search')
        .setDescription('Searches for sogn based on provided keywords')
        .addStringOption((option) =>
          option
            .setName('searchterms')
            .setDescription('the search keywords')
            .setRequired(true)
        )
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
    });
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === 'song') {
      let url = interaction.options.getString('url');
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });
      if (result.tracks.length === 0)
        return interaction.editReply('No results');

      const song = result.tracks[0];
      const entry = queue.tasksQueue.acquire();
      await entry.getTask();
      await queue.addTrack(song);

      embed
        .setAuthor({ name: 'Trackinfo 🎵' })
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the Queue`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    } else if (interaction.options.getSubcommand() === 'playlist') {
      let url = interaction.options.getString('url');
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0)
        return interaction.editReply('No results');

      const playlist = result.playlist;
      const entry = queue.tasksQueue.acquire();
      await entry.getTask();
      await queue.addTrack(result.tracks);
      embed
        .setAuthor({ name: 'PlalistInfo 🎵' })
        .setThumbnail(playlist.thumbnail)
        .setDescription(
          `**${result.tracks.length} songs from [${playlist?.title}](${playlist?.url})** have been added to the Queue`
        );
    } else if (interaction.options.getSubcommand() === 'search') {
      let url = interaction.options.getString('searchterms');
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0)
        return interaction.editReply('No results');

      const song = result.tracks[0];
      const entry = queue.tasksQueue.acquire();
      await entry.getTask();
      await queue.addTrack(song);
      embed
        .setAuthor({ name: 'Trackinfo 🎵' })
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the Queue`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }
    console.log();
    try {
      if (!queue.isPlaying()) await queue.node.play();
    } finally {
      queue.tasksQueue.release();
    }
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
