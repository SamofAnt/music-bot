const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueueRepeatMode, useQueue } = require('discord-player');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Set repeat mode for the queue')
    .addStringOption((option) =>
      option
        .setName('mode')
        .setDescription('Show current repeat mode status')
        .setRequired(true)
        .addChoices(
          { name: 'Show', value: 'show' },
          { name: 'Off', value: 'off' },
          { name: 'Track', value: 'track' },
          { name: 'Queue', value: 'queue' },
          { name: 'Autoplay', value: 'autoplay' }
        )
    ),

  run: async ({ client, interaction }) => {
    const subCmd = await interaction.options.getString('mode');
    const queue = client.player.nodes.get(interaction.guildId);
    let embed = new EmbedBuilder();

    if (!queue)
      return await interaction.editReply('There are no songs in the queue');

    const currentTrack = queue.currentTrack;
    let description;
    let status = 'none';
    console.log(subCmd);
    switch (subCmd) {
      case 'off':
        queue.setRepeatMode(QueueRepeatMode.OFF);
        description = 'Turned off repeat mode.';
        break;
      case 'track':
        queue.setRepeatMode(QueueRepeatMode.TRACK);
        description = `Looping **[${currentTrack.title}](${currentTrack.url})** `;
        break;
      case 'queue':
        queue.setRepeatMode(QueueRepeatMode.QUEUE);
        description = 'Looping the current queue.';
        break;
      case 'autoplay':
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        description = 'Autoplay mode activated.';
        break;
      default:
        if (queue.repeatMode === 3) {
          status = 'autoplay';
        } else if (queue.repeatMode === 2) {
          status = 'queue';
        } else if (queue.repeatMode === 1) {
          status = 'track';
        } else if (queue.repeatMode === 0) {
          status = 'off';
        }
        embed
          .setDescription(`Playback repeat status: \`${status}\`.`)
          .setFooter({
            text: `Use '/loop <off|track|queue|autoplay>' to change repeat mode.`,
          });
        return await interaction.editReply({
          embeds: [embed],
        });
    }
    embed
      .setDescription(description)
      .setThumbnail(currentTrack.thumbnail)
      .setFooter({ text: `Duration: ${currentTrack.duration}` });
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
