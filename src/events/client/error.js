const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'error',
  execute(bot, error) {
    const embed = new EmbedBuilder();
    console.log('error');
    embed
      .setColor('#FF0000')
      .setTitle('Something went wrong')
      .setAuthor({ name: 'Error' })
      .setDescription(
        `An error occurred with the previous track:\n\n${error.message.substr(
          0,
          error.message.indexOf('at ')
        )} ...`
      );

    return queue.metadata.channel.send({ embeds: [embed] });
  },
};
