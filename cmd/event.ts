import DiscordJs, { Intents, Permissions } from 'discord.js'

function eventHandler(client: DiscordJs.Client<boolean>)
{
    client.on('guildMemberAdd', (member) => {
        const welcome = client.channels.cache.get("669779713304035349");
        if(!welcome)
            return;
        const Embed = new DiscordJs.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`〔新人加入〕`)
            .setThumbnail((member.guild.iconURL() as string))
            .setDescription(`**${member} 歡迎來到Programming Master**\n` +
               `<#732745807962439801> 有群組規定~`
            );
        (welcome as DiscordJs.TextChannel)?.send({embeds: [Embed]})
    });
    client.on('guildMemberRemove', (member) => {
        const leave = member.guild.channels.cache.get("669779713304035349");
        const Embed = new DiscordJs.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`〔離群通知〕`)
            .setThumbnail((member.guild.iconURL() as string))
            .setDescription(`**${member}**\n` +
                `<@${member.id}>離開了Programming Master。`
            );
        (leave as DiscordJs.TextChannel)?.send({embeds: [Embed]})
    });
}

export = eventHandler;