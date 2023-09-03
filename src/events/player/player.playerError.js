const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'playerError',
  execute(bot, queue, error, track) {
    //if (!bot.utils.havePermissions(queue.metadata.channel)) return;
    const embed = new EmbedBuilder();
    console.log('playerError');
    embed
      .setColor('#FF0000')

      .setTitle('Something went wrong')
      .setAuthor({ name: 'Error' })
      .setDescription(
        `An error occurred with the previous track:\n\n${error.message.substr(
          0,
          error.message.indexOf('at ')
        )} ...`
      )
      .setThumbnail(track.thumbnail)
      .addFields({
        name: 'Previous Track',
        value: `**[${track.title}](${track.url})**`,
      });
    queue.node.skip();
    return queue.metadata.channel.send({ embeds: [embed], ephemeral: true });
  },
};
