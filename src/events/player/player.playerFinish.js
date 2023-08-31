const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'playerFinish',
  execute(bot, queue, track) {
    //if (!bot.utils.havePermissions(queue.metadata.channel)) return;
    if (queue.isEmpty()) return;
    const currentTrack = queue.tracks.toArray()[0];
    const embed = new EmbedBuilder()

      .setColor('#7f0aad')
      .setAuthor({ name: 'Track Info 🎵' })
      .setDescription(
        `**[${currentTrack.title}](${currentTrack.url})** will be playing next`
      )
      .setThumbnail(currentTrack.thumbnail)
      .setTimestamp()
      .setFooter({ text: `Duration: ${currentTrack.duration}` });

    return queue.metadata.channel.send({ embeds: [embed] }).then((message) => {
      setTimeout(() => {
        message.delete();
      }, 1000 * 60 * 2);
    });
  },
};
