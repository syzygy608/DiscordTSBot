import DiscordJs, { Intents, Permissions } from 'discord.js'

function commandHandler(client: DiscordJs.Client<boolean>, msg: DiscordJs.Message<boolean>, prefix: string, bot_version: string)
{
    var total = 0;
    function draw(key: number)
    {
        var list = ['大吉', '中吉', '小吉', '吉', '末吉', '凶', '大凶']
        if(key == 1)
        {
            var rand = Math.floor(Math.random() * 6);
            total += rand
            return list[rand]
        }
        else
        {
            key = Math.floor(total / 3)
            total = 0
            return list[key]
        }
    }
    if(msg.content.startsWith(prefix))
    {
        const [cmd, ...args] = msg.content
            .trim()
            .substring(prefix.length)
            .split(/\s+/);
        
        if(cmd === 'author')
        {
            const emoji = "<:small_orange_diamond:766628650338484234>"
            const Embed = new DiscordJs.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`††††† † 作者介紹 † †††††`)
                .setDescription(`${emoji}暱稱：伊沐洛\n` +
                    `${emoji}性別：男\n` +
                    `${emoji}年齡：18\n` +
                    `${emoji}職業：資工系學生\n` +
                    `${emoji}國籍：台灣\n` +
                    `${emoji}機器撰寫語言：TypeScript\n` +
                    `${emoji}機器語言版本：\n` +
                    `Node ${process.version}\n\n` +
                    `\`高调做事，低调做人。\`` 
                )
                .setImage("https://imgur.com/DOkzFfF.jpg")
                .setThumbnail("https://media.giphy.com/media/l4Ki02sLXyk2tvEAg/giphy.gif")
                .setFooter({text: `機器人版本 ${bot_version}`});
            msg.channel.send({embeds: [Embed]});
        }
        else if(cmd === 'pb')
        {
            const fort = Math.floor(Math.random() * 100);
            const Embed = new DiscordJs.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`††††† † 機率預估 † †††††`)
                .setDescription(`☘️${args[0]}的可能機率為${fort}%`)
                .setFooter({text: `機器人版本 ${bot_version}`});
            msg.channel.send({embeds: [Embed]});
        }
        else if(cmd === '求運勢')
        {
            const Embed = new DiscordJs.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`††††† † 運勢抽籤 † †††††`)
                .setDescription(`<@${msg.author.id}>以下是你今天的運勢\n` +
                    `❤️愛情運： ${draw(1)}\n` +
                    `🔨事業運： ${draw(1)}\n` +
                    `💰財運： ${draw(1)}\n\n` +
                    `🚩整體運：${draw(2)}`
                )
                .setFooter({text: `機器人版本 ${bot_version}`});
            msg.channel.send({embeds: [Embed]});
        }
        else if(cmd === 'info')
        {
            const Embed = new DiscordJs.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`關於 ${msg.guild?.name} 的介紹`)
                .setDescription(`伺服器擁有者：\n<@${msg.guild?.ownerId}>\n\n` +
                    `〖Features〗\n\n` +
                    `⚝活躍等級制度\n` +
                    `⚝程式討論天地\n` +
                    `⚝群組專屬自製機器人\n`
                )
                .setFooter({text: `機器人版本 ${bot_version}`});
            msg.channel.send({embeds: [Embed]});
        }
        else if(cmd === 'poll')
        {
            const len = args.length;
            msg.delete();
            if (len > 10)
                msg.channel.send(`超過九個選項!`);
            else
            {
                var emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
                const Embed = new DiscordJs.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`發起人 ${msg.author.username}`)
                    .setAuthor({name: `投票題目【${args[0]}】`})
                    .setFooter({text: `機器人版本 ${bot_version}`});
                for (let i = 1; i < len; i++)
                    Embed.addFields({ name: `${i}`, value: `${args[i]}`, inline: true},)
                msg.channel.send({embeds: [Embed]}).then(Embed => {
                    for (let i = 0; i < len - 1; i++)
                        Embed.react(emojis[i])
                });      
            }
        }
        else if(cmd === 'profile')
        {
            const { member, mentions } = msg;
            const target = (mentions.users.first() || msg.author);
            const Embed = new DiscordJs.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`個人資訊`)
                .setDescription(`關於 ${target.username}`)
                .setThumbnail((target.avatarURL({size: 256}) as string))
                .addFields(
                    {name: `帳號ID`, value: `${target.id}`, inline: false},
                    {name: `帳號創立時間`, value: target.createdAt.toDateString(), inline: false},
                )
                .setFooter({text: `機器人版本 ${bot_version}`});
            msg.channel.send({embeds: [Embed]});
        }
    }
}

export = commandHandler;