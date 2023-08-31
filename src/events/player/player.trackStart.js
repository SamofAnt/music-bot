const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'playerStart',
  execute(bot, queue, track) {
    //if (!bot.utils.havePermissions(queue.metadata.channel)) return;

    const embed = new EmbedBuilder()

      .setColor('#7f0aad')
      .setAuthor({ name: 'Track Info 🎵' })
      .setDescription(`**[${track.title}](${track.url})** will be playing next`)
      .setThumbnail(track.thumbnail)
      .setTimestamp()
      .setFooter({ text: `Duration: ${track.duration}` });

    return queue.metadata.channel.send({ embeds: [embed] }).then((message) => {
      setTimeout(() => {
        message.delete();
      }, 1000 * 60 * 2);
    });
  },
};
