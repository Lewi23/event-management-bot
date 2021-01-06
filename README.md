# Sometimes useful bot 

A discord chat bot developed using [discord.js](https://discord.js.org/#/) with tools for the creation and mangement of events. 

Add the bot to your server by [clicking here!](https://discord.com/api/oauth2/authorize?client_id=705433718298378310&permissions=8&scope=bot)


## Usage

To create an event the `!create-event` command can be used which asks for the following information about the event:

* Title
* Event info 
* Date (DD/MM/YYYY)
* Time (HH:MM)

Then it will create the event and automatically add the reactions that users can use to let you know if they can attend (✅ Can attened , ⚖️ maybe  and ❌ can't attend ).


<img src=https://media.giphy.com/media/RkZBvflCuygxd9ave5/giphy.gif width="500" height="500"/><br />




If you created the event reacting with 📝 allows you to edit it and reacting with 🗑️ deletes it.






## Instillation 

To work on this project locally the `config.json` file should be modifed to provide a login token ([obtained here](https://discord.com/login?redirect_to=%2Fdevelopers%2Fapplications)):


```JSON
"token": "discord token" 
```

**Be sure to add `config.json` to your `.gitignore` file as to not commit your secret token**.


The project is currently being hosted on [Heroku](https://www.heroku.com/) so the `command_handler.js` file needs to be modified. The Heroku login: `client.login(process.env.BOT_TOKEN);` should be commented and the discord login: `client.login(token);` should be uncommented as shown below:

```javascript
// login to Discord using app token (Local dev using a config.json file)
client.login(token);

// Heroku login
//client.login(process.env.BOT_TOKEN); 
```

Then use the package manager [npm](https://www.npmjs.com/) to install this project:

```bash
npm install 
```

Finally the bot the can be run using this command at the root directory of the project:

```bash
node command_handler.js
```