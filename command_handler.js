// keys, passwords, imports
const { prefix, token } = require('./config.json');
const tools = require('./functions/helper_functions');
const event_management = require('./functions/event_management');

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

// login to Discord using app token (Local dev using a config.json file)
client.login(token);

// Heroku login
//client.login(process.env.BOT_TOKEN);

client.once('ready', () => {
  console.log('Bot online!');
  client.user.setActivity('!help', { type: 'PLAYING' });
  client.user.setAvatar('./bot_icon.png');
});


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.log(error);
    message.reply('There was an error trying to execute that command!');
  }
});

function manageAttendanceList(embed, message, username, field1, field2, field3) {

  // Manage additions for when the user is already in a list and deletions must be made (change of attendance)

  if (embed.fields[field1].value.includes(username)) {
    embed.fields[field1].value = tools.removeAttendanceList(embed.fields[field1].value, username);

    if (!embed.fields[field2].value.includes(username)) {
      embed.fields[field2].value = tools.addAttendanceList(embed.fields[field2].value, username);
    }

    message.edit(new Discord.MessageEmbed(embed));

  } else if (embed.fields[field3].value.includes(username)) {

    embed.fields[field3].value = tools.removeAttendanceList(embed.fields[field3].value, username);

    if (!embed.fields[field2].value.includes(username)) {
      embed.fields[field2].value = tools.addAttendanceList(embed.fields[field2].value, username);
    }

    message.edit(new Discord.MessageEmbed(embed));


  // Adds the user straight into a list without any deletions (inital reaction to an event)
  } else if (!embed.fields[field2].value.includes(username)) {

    embed.fields[field2].value = tools.addAttendanceList(embed.fields[field2].value, username);

    message.edit(new Discord.MessageEmbed(embed));

  }
}

// Handling emoji reactions ensuring it is a user who adds the reaction and that the message type is an embed

client.on('raw', packet => {

  // Ensure this only runs on message reaction add types
  if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return;

  // This catches if it's our bot or the user adding the emoji
  if (packet.d.member.user.bot !== undefined) {
    return;
  }

  // Field emebed ID's
  const canAttend = 4;
  const maybe = 5;
  const cannotAttend = 6;

  const messageID = packet.d.message_id;
  const channelID = packet.d.channel_id;
  const userID = packet.d.member.user.id;
  const emoji = packet.d.emoji.name;
  // regex used to pull the authorID from the footer of the embed
  const regex = /\d+/g;

  client.channels.fetch(channelID)
    .then((channel) => {
      channel.messages.fetch(messageID)
        .then((message) => {

          if (tools.notEmbed(message.embeds[0])) {
            console.log('not embed');
            return;
          }

          const embed = message.embeds[0];

          const authorID = embed.footer.text.match(regex);

          switch (emoji) {
          case '✅':
            manageAttendanceList(embed, message, userID, maybe, canAttend, cannotAttend);
            break;
          case '⚖️':
            manageAttendanceList(embed, message, userID, canAttend, maybe, cannotAttend);
            break;
          case '❌':
            manageAttendanceList(embed, message, userID, canAttend, cannotAttend, maybe);
            break;
          case '📝':
            if (userID == authorID) {
              event_management.editEvent(message, userID);
            } else {
              client.users.cache.get(userID).send('You can\'t edit this event you are not the author');
            }
            break;
          case '🗑️':
            if (userID == authorID) {
              message.delete();
            } else {
              client.users.cache.get(userID).send('You can\'t delete this event you are not the author');
            }
            break;
          default:
            // Catching all other emojis which we do not need to handle
            return;

          }
        });
    });
});