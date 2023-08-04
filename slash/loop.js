const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Set repeat mode for the queue'),
    .

  run: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);

    if (!queue)
      return await interaction.editReply('There are no songs in the queue');

    queue.node.resume();
    await interaction.editReply(
      'Music has been resumed! Use `/pause` to pause the music'
    );
  },
};
