# Sometimes useful bot 

A discord chat bot with tools for the creation and mangement of events.




## Usage

To create an event the `!create-event` command can be used which asks for the following information about the event:

* Title
* Event info 
* Date
* Time

Then it will create the event adding reactions that users can use to let you know if they can make it or not. Can attened ✅, maybe ⚖️ and can't attend ❌.


<img src=https://media.giphy.com/media/RkZBvflCuygxd9ave5/giphy.gif width="300" height="300"/>



Finally if you created the event reacting with 📝 allows you to edit the event and 🗑️ to delete the event.



Add the bot to your server by clicking [here!]()

This bot has been written using [discord.js](https://discord.js.org/#/) with the goal of allowing
## Instillation 

To work on this project locally a `config.json` file should be created following the `config_example.json`. A discord key ([obtained here]()) must be provided in this file:


```JSON
"token": "discord token" 
```

as the project is currently being hosted on [Heroku](https://www.heroku.com/) the following lines of code should be uncommented in the `command_handler.js` file.

```javascript
// // login to Discord using app token (Local dev using a config.json file)
client.login(token);

// Heroku login
//client.login(process.env.BOT_TOKEN);
```

Use the package manager [npm](https://www.npmjs.com/) to install this project:

```bash
npm install 
```