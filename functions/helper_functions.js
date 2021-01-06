const defaultString = '\u200B';

module.exports = {

  validateTime: function validateTime(time) {

    const validTime = /([01]\d|2[0-3]):?[0-5]\d/;

    try {
      if (!(time.match(validTime))) {
        throw new Error('Invalid time');
      }
    } catch (error) {
      console.log(error);
      return error.message;
    }

  },

  validateDate: function validateDate(date) {

    // Using the Moment.js library being used to validate that dates are valid and are not in the past
    const moment = require('moment');

    try {

      const dateArr = date.split('/');

      // The true boolean value enforces strict validation on the date ensuring it matches the defined format exactly
      const formatted_date = moment(dateArr[0] + '/' + dateArr[1] + '/' + dateArr[2], 'DD/MM/YYYY', true);

      console.log(formatted_date);

      // Using Moment.js methods:
      // isValid() ensures the date is valid
      // isBefore() checks if the date is before the current timestamp

      if (!(formatted_date.isValid())) {
        throw new Error('Invalid date');
      } else if (formatted_date.isBefore()) {
        throw new Error('Date in the past');
      }

    } catch (error) {
      console.log(error);
      return error.message;
    }
  },

  notEmbed: function notEmbed(message) {
    if (message === null || message === undefined) {
      return 'message does not exist';
    }

    return Object.keys(message).length === 0;
  },

  cleanUpChannel: function cleanUpChannel(message, userToTag, amount) {

    const filter = m => m.channel.id === message.channel.id;
    const settings = { max: 1, time: 3000000, errors: ['time'] };

    // creates @user
    message.channel.send('<@' + userToTag + '> Would you like to cleap up this channel? `yes` or `no`')
      .then(() => {
        return message.channel.awaitMessages(filter, settings).catch(() => {
          throw new Error('No decision made on cleaning up channel ');
        })
          .then(collected => {

            if (collected.first().content.toLowerCase() === 'yes') {
              return message.channel.bulkDelete(amount)
                .then(() => {
                  console.log('deleting...');
                });
            }
          });
      })
      .catch(error => {
        console.log(error);
      });
  },

  addAttendanceList: function addAttendanceList(currentList, user) {
    if (currentList === defaultString) {
      return `<@!${user}>`;
    } else {
      return currentList + '\n' + `<@!${user}>`;
    }
  },

  removeAttendanceList: function removeAttendanceList(currentList, user) {

    currentList = currentList.replace(`<@!${user}>`, defaultString);

    if (currentList === '<@!>') {
      return defaultString;
    } else {
      return currentList;
    }
  },

};
