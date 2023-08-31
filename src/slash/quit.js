const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quit')
    .setDescription('Stops the bot and clears the queue'),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);

    if (!queue)
      return await interaction.editReply('There are no songs in the queue');

    queue.tracks.clear();
    const result = await client.player.search(
      'https://www.youtube.com/watch?v=3I_UDfjb5L0&ab_channel=TriedKino',
      {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      }
    );
    await queue.addTrack(result.tracks[0]);
    await queue.node.play();
    await interaction.editReply('Bye!');
  },
};
