import DiscordJs, { Intents, version } from 'discord.js'
import configs from './configs.json'
import admin from './cmd/admin'
import cf from './cmd/codeforces'
import event from './cmd/event'
import react from './cmd/react'
import help from './cmd/help'

const client = new DiscordJs.Client({
    intents:
    [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

client.on('ready', () => {
    console.log(`>>>> bot ${client.user?.tag} is on <<<<`)
    var commands = client.guilds.cache.get("739419260467675139")?.commands
    commands?.create({
        name: 'ping',
        description: 'reply with pong'
    })
    commands?.create({
        name: 'handle',
        description: 'reply with handle info',
        options: [{
            name: 'handle',
            required: true,
            description: `include a user's handle`,
            type: DiscordJs.Constants.ApplicationCommandOptionTypes.STRING
        }]
    })
    commands?.create({
        name: 'problem',
        description: 'reply with request problemset',
        options:
        [
            {
                name: 'lower',
                required: true,
                description: `diffculty lower bound`,
                type: DiscordJs.Constants.ApplicationCommandOptionTypes.INTEGER
            },
            {
                name: 'upper',
                required: true,
                description: `diffculty upper bound`,
                type: DiscordJs.Constants.ApplicationCommandOptionTypes.INTEGER
            },
            {
                name: 'tag',
                required: true,
                description: `problem tag filter`,
                type: DiscordJs.Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
    commands?.create({
        name: 'contest',
        description: 'reply with upcoming contest'
    })
    commands?.create({
        name: 'help',
        description: 'show all commands'
    })
    commands?.create({
        name: 'newest_contest',
        description: 'show info about the newest contest'
    })
})

client.on('messageCreate', (msg) => {
    if(msg.content === '??????')
        msg.reply({content: '??????????????????!'})
    else if(msg.content === '??????')
        msg.reply({content: '?????????????????????????????????!'})
    else if(msg.content === '??????')
        msg.reply({content: '??????????????????????????????codeforces?????????'})
    admin(client, msg, configs.prefix, configs.version);
    react(client, msg, configs.prefix, configs.version);
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand())
        return;
    else
    {
        cf(client, interaction, configs.version);
        help(client, interaction, configs.version);
    }
})

client.login(configs.token)
event(client);