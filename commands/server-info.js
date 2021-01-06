module.exports = {
  name: 'server-info',
  description: 'Provides information about the server',
  execute(message, args) {
    message.channel.send(`This server's name is ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreated on: ${message.guild.createdAt}\nServer region: ${message.guild.region}`);
  },
};
