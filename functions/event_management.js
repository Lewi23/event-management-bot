const Discord = require('discord.js');
const tools = require('./helper_functions');

module.exports = {

  editEvent: function editEvent(message, userID) {

    console.log(message);

    let selectedField = '';
    let update = '';
    let deletionAmount = 0;

    const filter = m => m.channel.id === message.channel.id;
    const settings = { max: 1, time: 3000000, errors: ['time'] };

    message.channel.send('Please select the field you would like to edit: \n`Title`\n`Decsription` \n`Date` \n`Time`')
      .then(() => {
        return message.channel.awaitMessages(filter, settings).catch(() => {
          deletionAmount += 1;
          throw new Error('field timeout error');
        })
          .then(collected => {
            selectedField = collected.first().content.toLowerCase();

            console.log(selectedField);

            deletionAmount += 2;

            if (!(selectedField === 'title' || selectedField === 'description' || selectedField === 'date' || selectedField === 'time')) {
              throw new Error('invalid fied');
            }


          });
      })
      .then(() => message.channel.send('Please input the edit you would like to make'))
      .then(() => {
        return message.channel.awaitMessages(filter, settings).catch(() => {
          deletionAmount += 1;
          throw new Error('update timeout error');
        })
          .then(collected => {

            update = collected.first().content;

            deletionAmount += 2;
          });
      })
      .then(() => {

        if (selectedField === 'date') {
          if (tools.validateDate(update) === 'Invalid date') {
            throw new Error('invalid date');
          } else if (tools.validateDate(update) === 'Date in the past') {
            throw new Error('date in the past');
          }
        }

        if (selectedField === 'time') {
          if (tools.validateTime(update) === 'Invalid time') {
            throw new Error('invalid time');
          }
        }


        message.channel.bulkDelete(4);

        updateFunction(message, selectedField, update);

      })
      .catch(error => {

        console.log(error);

        switch (error.message) {
        case 'field timeout error':
          message.channel.send('<@' + userID + '> No field was selected');
          break;
        case 'update timeout error':
          message.channel.send('<@' + userID + '> No update was entered');
          break;
        case 'invalid fied':
          message.channel.send('<@' + userID + '> Please input a valid field: \n`Title`\n`Decsription` \n`Date` \n`Time`');
          break;
        case 'invalid time':
          message.channel.send('<@' + userID + '> Invalid time or format please use `MM:HH`');
          break;
        case 'invalid date':
          message.channel.send('<@' + userID + '> Invalid date format please use `DD/MM/YYYY`');
          break;
        case 'date in the past':
          message.channel.send('<@' + userID + '> Invalid date, please use a date that is not in the past');
          break;
        default:
          message.channel.send('<@' + userID + '> An unhandl');
          break;
        }

        /*
        Adding +3 to the deletionAmount for:
        - error msg
        - clean up channel msg
        - user reply to clean up msg
        */

        tools.cleanUpChannel(message, userID, deletionAmount + 3);

      });

  },
};

function updateFunction(event, selectedField, update) {

  const EMBED = event.embeds[0];

  try {
    switch (selectedField) {
    case 'title':
      EMBED.title = update;
      break;
    case 'description':
      EMBED.description = update;
      break;
    case 'date':
      EMBED.fields[0].value = update;
      break;
    case 'time':
      EMBED.fields[1].value = update;
      break;
    default:
      throw new Error('Unexpected field edit');
    }

    event.edit(new Discord.MessageEmbed(EMBED));

  } catch (error) {
    console.log(error);
  }
}