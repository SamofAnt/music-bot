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
    ),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);
    const trackNumber = interaction.options.getNumber('track');
    if (!queue)
      return await interaction.editReply('There are no songs in the queue');

    queue.removeTrack(trackNumber);
    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription(`Track has been removed!`)],
    });
  },
};
