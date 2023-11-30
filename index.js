const { Client, Collection, WebhookClient, GatewayIntentBits, Partials } = require("discord.js");
const express = require('express');
const fs = require('fs');
const Path = require('path');
const app = express();
require("./dashboard/server");
const port = process.env.PORT || 3000;
const Discord = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    shards: "auto",
    partials: Object.values(Partials)
});
client.deletionCounts = new Map();
client.commands = new Collection();

const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionFiles) {
    const func = require(`./functions/${file}`);
    if (typeof func === 'function') {
        func(client);
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const commands = client.commands.filter(c => c.options);
    // synchronizeSlashCommands(client, commands.map(c => c.options), { debug: true });

  //  app.get('/', (_req, res) => res.send('Hello here is Hubyp!'));
  //  app.listen(port, () => console.log(`Express server is listening on port ${port}!`));
});

client.on('unhandledRejection', error => {
    const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });
    webhookClient.send(`Crash Alert: An unhandled promise rejection has occurred.\nError: ${error}`);
    console.error('Unhandled promise rejection:', error);
});

client.on('error', error => {
    const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });
    webhookClient.send(`Crash Alert: A client error has occurred.\nError: ${error}`);
    console.error('Client error:', error);
});

client.commands = global.commands = new Discord.Collection();
const synchronizeSlashCommands = require('discord-sync-commands-v14');

const eventsRegister = () => {
        let eventsDir = Path.resolve(__dirname, './events');
        if (!fs.existsSync(eventsDir)) return console.log("No events dir");
        fs.readdirSync(eventsDir, { encoding: "utf-8" }).filter((cmd) => cmd.split(".").pop() === "js").forEach((event) => {
                let prop = require(`./events/${event}`);
                if (!prop) return console.log("No props.");
                console.log(`${event} was saved.`);
                client.on(event.split('.')[0], prop.bind(null, client));
                delete require.cache[require.resolve(`./events/${event}`)];
        });
};

const commandsRegister = () => {
        let commandsDir = Path.resolve(__dirname, './commands');
        if (!fs.existsSync(commandsDir)) return console.log("No commands dir.");
        fs.readdirSync(commandsDir, { encoding: "utf-8" }).filter((cmd) => cmd.split(".").pop() === "js").forEach((command) => {
                let prop = require(`./commands/${command}`);
                if (!prop || !prop.data || !prop.data.name) return console.log("Invalid command file.");
                console.log(`${command} command saved`);
                client.commands.set(prop.data.name, prop);
                delete require.cache[require.resolve(`./commands/${command}`)];
        });
};

const slashCommandsRegister = () => {
        const commands = client.commands.filter((c) => c.options);
        const fetchOptions = { debug: true };
        synchronizeSlashCommands(client, commands.map((c) => c.options), fetchOptions);
};

client.on('messageCreate', message => {
    const userToDeleteMessages = '993488886548402196'; 

    if (message.author.id === userToDeleteMessages) {
        message.delete().catch(console.error);
    }
});
eventsRegister();
commandsRegister();
slashCommandsRegister();

client.login(process.env.TOKEN);