const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('replay')
    .setDescription('Replay the current track'),

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);

    if (!queue)
      return await interaction.editReply('There are no songs in the queue');

    queue.node.seek(0);
    await interaction.editReply('Track has been replayed');
  },
};
