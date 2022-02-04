import DiscordJs, { Intents, Permissions, MessageActionRow, MessageButton } from 'discord.js'

async function commandHandler(client: DiscordJs.Client<boolean>, interaction: DiscordJs.CommandInteraction<DiscordJs.CacheType>, bot_version: string)
{
    const { commandName, options } = interaction;
    if(commandName === "help")
    {
        const normalEmbed = new DiscordJs.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`機器人指令表`)
            .setDescription('機器人開發中....敬請期待 !')
            .addFields(
                { name: '`/`ping', value: `顯示機器人延遲`, inline: false},
                { name: '`~`info', value: `顯示伺服器資訊`, inline: false},
                { name: '`/`contest', value: `顯示最近的cf比賽資訊`, inline: false},
                { name: '`/`newest_contest', value: `顯示最新的cf比賽`, inline: false},
                { name: '`/`handle', value: `顯示該handle使用者資訊`, inline: false},
                { name: '`~`author', value: `顯示機器人作者資訊`, inline: false},
                { name: '`~`pb [content]', value: `輸入[content]求機率`, inline: false},
                { name: '`~`求運勢', value: `求取本日運勢`, inline: false},
                { name: '`~`poll  [標題] [選項1] [選項2]...', value: `建立投票`, inline: false},
                { name: '`~`profile [可@使用者，不@就是自己]', value: `查看成員資訊`, inline: false}
            )
            .setThumbnail("https://image.freepik.com/free-vector/vector-paper-light-bulb-with-gears-cogs-business-interaction-concept_1284-42534.jpg")
            .setFooter({text: `機器人版本 ${bot_version}`});
        const adminEmbed = new DiscordJs.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`機器人指令表`)
            .setDescription('機器人開發中....敬請期待 !')
            .addFields(
                { name: '`~`clean [訊息數] [理由] ', value: `刪除訊息`, inline: false},
                { name: '`~`ban [@成員] [理由] ', value: `停權該成員`, inline: false},
                { name: '`~`repeat [content]', value: `機器人將復述你的訊息`, inline: false}
            )
            .setThumbnail("https://image.freepik.com/free-vector/vector-paper-light-bulb-with-gears-cogs-business-interaction-concept_1284-42534.jpg")
            .setFooter({text: `機器人版本 ${bot_version}`});
        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('normal')
					.setLabel('一般指令')
					.setStyle('PRIMARY'),
                new MessageButton()
					.setCustomId('admin')
					.setLabel('管理指令')
					.setStyle('SECONDARY')
			);
		await interaction.reply({ embeds: [normalEmbed], components: [row] });

        const filter = (i: { customId: string; user: { id: string; }; }) => i.customId === 'normal' || i.customId === 'admin';
        const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 120000 });

        collector?.on('collect', async i =>
        {
            if(i.customId === 'normal')
                await i.update({ embeds: [normalEmbed], components: [row] });

            else
                await i.update({ embeds: [adminEmbed], components: [row] });
        });
    }
}

export = commandHandler;
