import DiscordJs, { Intents, Permissions, WebhookClient } from 'discord.js'

function commandHandler(client: DiscordJs.Client<boolean>, msg: DiscordJs.Message<boolean>, prefix: string, bot_version: string)
{
    if(msg.content.startsWith(prefix))
    {
        const [cmd, ...args] = msg.content
            .trim()
            .substring(prefix.length)
            .split(/\s+/);

        if(cmd === 'clean')
        {
            if(msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
            {
                var num = parseInt(args[0], 10);
                var reason = args[1];
                msg.channel.messages.fetch({limit: num + 1})
                    .then(messages => {
                        let deletedMessages = 0;
                        messages.forEach(msgs => {
                            if(deletedMessages >= num + 1)
                                return;
                            msgs.delete();
                            deletedMessages++;
                        })
                        if(typeof reason === "undefined")
                            reason = "None"; 
                        msg.channel.send({content: `已刪除 ${num} 則 訊息，原因: ${reason}`})
                    })
                    .catch(err => {
                        msg.channel.send({content: "刪除失敗，可能訊息數字為非法的，或訊息已超過兩周"});
                    });
            }
            else
                msg.channel.send({content: "刪除失敗，因為你並非管理員。"});
        }
        else if(cmd === 'ban')
        {
            if(msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
            {

                const { member, mentions } = msg;
                const target = mentions.users.first()
                const reason = args[1]
                
                if(target)
                {
                    const targetMember = msg.guild?.members.cache.get(target.id)
                    if(targetMember)
                    {
                        msg.guild?.members.ban(targetMember);
                        msg.reply({content: `封禁成員: ${targetMember}成功。`});
                    }
                }
                else
                    msg.reply({content: `封禁失敗，查無該成員或你標記錯誤。`});
            }
            else
                msg.reply({content: `封禁失敗，因為你並非管理員。`});
        }
        else if(cmd == "repeat")
        {
            if(msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
            {
                msg.channel?.send({content: msg.content.slice(8)});
                msg.delete();     
            }
        }
        else if(cmd == "ann")
        {
            if(msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
            {
                const webhookClient = new WebhookClient({ id: '933659264524894278', token: '5MX5s7BpyCafv-dLy6OTlC1QUJLZXBL0kgelY8gVPSLm407wh1QJJ1PJgVSXUxLNSvyz' });
                const Embed = new DiscordJs.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`〔群組公告〕`)
                    .setThumbnail((msg.member.avatarURL() as string))
                    .setDescription(msg.content.slice(4));
                webhookClient.send({
                    username: '伺服器公告',
                    embeds: [Embed]
                });
                msg.delete();     
            }
        }
    }
}

export = commandHandler;