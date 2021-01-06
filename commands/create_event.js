const Discord = require('discord.js');
const { prefix } = require('../config.json');
const tools = require('../functions/helper_functions');

module.exports = {
  name: 'create-event',
  description: 'Creates a custom event that allows other users to RSVP.',
  usage: `, you will then be prompted for the followng information:
  - Event title
  - Event description 
  - Date of the event (DD/MM/YYYY)  
  - Time of the event (MM:HH)`,
  cooldown: 5,
  execute(message) {

    collectEventInformation(message);

  },
};

const collectEventInformation = (message) => {

  const eventInfo = {
    title: '',
    description: '',
    date: '',
    time: '',
    author: '',
  };

  let deletionAmount = 0;
  const filter = m => m.channel.id === message.channel.id;
  const settings = { max: 1, time: 3000000, errors: ['time'] };

  if (!message.content.startsWith(prefix) || message.channel.bot) return;
  message.channel.send('Please input the event title:')
    .then(() => {
      return message.channel.awaitMessages(filter, settings).catch(() => {
        deletionAmount += 1;
        throw new Error('Title timeout error');
      })
        .then(collected => {
          eventInfo.title = collected.first().content;

          deletionAmount += 2;
        });
    })
    .then(() => message.channel.send('Please input a event description:'))
    .then(() => {
      return message.channel.awaitMessages(filter, settings).catch(() => {
        deletionAmount += 1;
        throw new Error('Description timeout error');
      })
        .then(collected => {
          eventInfo.description = collected.first().content;

          deletionAmount += 2;

        });
    })
    .then(() => message.channel.send('Please input the date of the event in the following format `DD/MM/YYYY`:'))
    .then(() => {
      return message.channel.awaitMessages(filter, settings).catch(() => {
        deletionAmount += 1;
        throw new Error('Date timeout error');
      })
        .then(collected => {
          eventInfo.date = collected.first().content;

          deletionAmount += 2;

          if ((tools.validateDate(eventInfo.date) === 'Invalid date')) {
            throw new Error('Invalid date');
          } else if (tools.validateDate(eventInfo.date) === 'Date in the past') {
            throw new Error('Date in the past');
          }

        });
    })
    .then(() => message.channel.send('Please input the time of the event eg `HH:MM`:'))
    .then(() => {

      return message.channel.awaitMessages(filter, settings).catch(() => {
        deletionAmount += 1;
        throw new Error('Time timeout error');
      })
        .then(collected => {
          console.log('erroring here');
          eventInfo.time = collected.first().content;

          deletionAmount += 2;

          if (tools.validateTime(eventInfo.time) === 'Invalid time') {
            throw new Error('Invalid time');
          }

        });
    })
    .then(() => {
      // Set author, clean up channel and create embed
      eventInfo.author = 'Created by: ' + message.author.username + '\nEvent ID: ' + message.author.id + '\n📝 Edit event | 🗑️ Delete event';
      message.channel.bulkDelete(9);

      createEmbed(message, eventInfo);
    })
    .catch(error => {

      console.log(error);

      switch (error.message) {
      case 'Title timeout error':
        message.reply('No title for this event was entered');
        break;
      case 'Description timeout error':
        message.reply('No description for this event was entered');
        break;
      case 'Date timeout error':
        message.reply('No date for this event was entered');
        break;
      case 'Invalid date':
        message.reply('Invalid date format please use `DD/MM/YYYY`');
        break;
      case 'Date in the past':
        message.reply('Invalid date, please use a date that is not in the past');
        break;
      case 'Time timeout error':
        message.reply('No time for this event was entered');
        break;
      case 'Invalid time':
        message.reply('Invalid time or format please use `HH:MM`');
        break;
      default:
        message.reply('An unhandled exception has occured');
        break;
      }

      /*
      message and message.author.id will not always be the same message object.
      An example of this would be when you want to tag a user asking if they want to clean up a channel
      with none of the messages orginating from the user.

      Adding +4 to the deletionAmount for:
      - error msg
      - clean up channel msg
      - user reply to clean up msg
      - !create-event msg

      */
      tools.cleanUpChannel(message, message.author.id, deletionAmount + 4);
    });
};

const createEmbed = (message, eventInfo) => {

  const defaultString = '\u200B';
  const blue = '#03a9fc';

  const event = new Discord.MessageEmbed()
    .setColor(blue)
    .setTitle(eventInfo.title)
    .setDescription('Info: ' + eventInfo.description)
    .addFields(
      { name: 'Date: ', value: eventInfo.date, inline: true },
      { name: 'Time: ', value: eventInfo.time, inline: true },
      // Ensures the tab is formmated correctly (it's just a blank field sitting inline)
      { name: defaultString, value: defaultString, inline: true },
      // adds the new line after 'time'
      { name: defaultString, value: defaultString, inline: false },
      { name: '✅ Can attend', value: defaultString, inline: true },
      { name: '⚖️ Maybe', value: defaultString, inline: true },
      { name: '❌ Can\'t attend', value: defaultString, inline: true },
      // adds the new line after 'Can't attend'
      { name: defaultString, value: defaultString, inline: false },
    )
    .setFooter(eventInfo.author);

  message.channel.send(event)
    .then(m => m.react('✅'))
    .then(m => m.message.react('⚖️'))
    .then(m => m.message.react('❌'))
    .then(m => m.message.react('📝'))
    .then(m => m.message.react('🗑️'));
};
