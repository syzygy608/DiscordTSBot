import DiscordJs, { Intents, Permissions } from 'discord.js'
var request = require("request");

async function interactHandler(client: DiscordJs.Client<boolean>, interaction: DiscordJs.CommandInteraction<DiscordJs.CacheType>, bot_version: string)
{
    const { commandName, options } = interaction;
    const baseUrl = "https://codeforces.com/api/";
    if(commandName === 'ping')
    {
        const Embed = new DiscordJs.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`機器人延遲狀態`)
            .setDescription('Owner: 伊沐洛#4601')
            .addFields(
                { name: '🏓機器人延遲', value: `${interaction.createdTimestamp - Date.now()}ms`, inline: true},
                { name: 'API 延遲', value: `${Math.round(client.ws.ping)}ms`, inline: true}
            )
            .setFooter({text: `機器人版本 ${bot_version}`});
        interaction.reply({content: 'pong', embeds: [Embed], ephemeral: true});
        console.log(interaction);
    }
    else if(commandName === "handle")
    {
        const RankToColor = 
        {
            "undefined": "#000000",
            "newbie": "#808080",
            "pupil": "#00D166",
            "specialist": "#00C09A",
            "expert": "#0099E1",
            "candidate master": "#A652BB",
            "master": "#F8C300",
            "international master": "#F8C300",
            "grandmaster": "#F93A2F",
            "international grandmaster": "#F93A2F",
            "legendary grandmaster": "#F93A2F",
        }
        var url = "user.info?handles=";
        var data: { name: any; id: any; startTime: any; time: any; }[] | { [x: string]: string; }[] = [];
        const getUser = async function()
        {
            var handle = options.getString('handle');
            request({
                url: baseUrl + url + handle,
                method: "GET"
            }, function (error: any, response: any, body: string)
            {
                if(error || !body)
                    return;
                const result = [];
                var jsonObject = JSON.parse(body);
                if(jsonObject['status'] === "FAILED" || typeof jsonObject['result'][0] === "undefined")
                    interaction.reply({content: `handles: User with handle ${handle} not found`, ephemeral: true})
                else
                {
                    var res = jsonObject['result'][0];
                    var col: DiscordJs.ColorResolvable = '#000000';
                    var Embed = new DiscordJs.MessageEmbed()
                        .setTitle(`使用者資訊: ${res['handle']}`)
                        .setThumbnail(res['titlePhoto'])
                        .setFooter({text: `機器人版本 ${bot_version}`})
                        .setColor(col)
                        .addFields(
                            { name: '國家 地區', value: `[${res['country']}] [${res['city']}]`, inline: false},
                            { name: '組織', value: `[${res['organization']}]`, inline: false},
                            { name: 'Rating (Max)', value: ` ${res['rating']} (${res['maxRating']})`, inline: false}
                        );
                    url = "user.rating?handle=";
                    request({
                        url: baseUrl + url + handle,
                        method: "GET"
                    }, function (error: any, response: any, body: string)
                    {
                        if(error || !body)
                            return;
                        const result = [];
                        var jsonObject = JSON.parse(body);
                        var res = jsonObject['result'];
                        if(res.length === 0)
                            Embed.addFields({ name: '最近一場比賽', value: `尚無參賽紀錄`, inline: false});
                        else
                            Embed.addFields({ name: '最近一場比賽', value: `[${res[res.length - 1]['contestName']}] Rk. ${res[res.length - 1]['rank']} (${res[res.length - 1]['oldRating']} ➙ ${res[res.length - 1]['newRating']})`, inline: false});
                        interaction.reply({embeds: [Embed], ephemeral: true});
                    })      
                }      
            });
        };
        getUser();
    }
    else if(commandName === 'contest')
    {
        function secondsToString(seconds: number)
        {
            var numdays = Math.floor(seconds / 86400);
            var numhours = Math.floor((seconds % 86400) / 3600);
            var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
            return numdays + " 天 " + numhours + " 小時 " + numminutes + " 分";
        }
        var url = "contest.list?gym=false";
        var data: { name: any; id: any; startTime: any; time: any; }[] | { [x: string]: string; }[] = []
        const getContest = async function()
        {
            request({
                url: baseUrl + url,
                method: "GET"
            }, function (error: any, response: any, body: string)
            {
                if(error || !body)
                    return;
                const result = [];
                var jsonObject = JSON.parse(body);
                var res = jsonObject['result'];
                for(let i = 0; i < res.length; i += 1)
                    if(res[i]['phase'] === "BEFORE")
                        data.push({name: res[i]['name'], id: res[i]['id'], startTime: res[i]['startTimeSeconds'], time: res[i]['durationSeconds']});
                var embed = new DiscordJs.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`最近的比賽`)
                    .setURL("https://codeforces.com/contests")
                    .setThumbnail("https://image.freepik.com/free-vector/hand-holding-trophy_1284-3981.jpg")
                    .setFooter({text: `機器人版本 ${bot_version}`});
                var seconds = new Date().getTime() / 1000;
                for(let i = data.length - 1; i >= 0; i -= 1)
                {
                    let sec = data[i]['startTime'];
                    let time = new Date(0);
                    time.setSeconds(sec);
                    let normalDate = time.toLocaleString('en-US',{timeZone:'Asia/Taipei'});
                    var startTime = secondsToString(data[i]['startTime'] - seconds);
                    embed.addFields({name: data[i]['name'], value: `比賽時間: ${normalDate}\n距離比賽還有: ${startTime}\n比賽時長: ${(parseInt(data[i]['time']) / 60)} 分鐘`, inline: false})
                }
                interaction.reply({embeds: [embed], ephemeral: false});
            });
        };
        getContest();
    }
    else if(commandName === 'newest_contest')
    {
        function secondsToString(seconds: number)
        {
            var numdays = Math.floor(seconds / 86400);
            var numhours = Math.floor((seconds % 86400) / 3600);
            var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
            return numdays + " 天 " + numhours + " 小時 " + numminutes + " 分";
        }
        var url = "contest.list?gym=false";
        var data: { name: any; id: any; startTime: any; time: any; }[] | { [x: string]: string; }[] = []
        const getContest = async function()
        {
            request({
                url: baseUrl + url,
                method: "GET"
            }, function (error: any, response: any, body: string)
            {
                if(error || !body)
                    return;
                const result = [];
                var jsonObject = JSON.parse(body);
                var res = jsonObject['result'];
                for(let i = 0; i < res.length; i += 1)
                    if(res[i]['phase'] === "BEFORE")
                        data.push({name: res[i]['name'], id: res[i]['id'], startTime: res[i]['startTimeSeconds'], time: res[i]['durationSeconds']});
                var embed = new DiscordJs.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`最近一場的比賽`)
                    .setURL("https://codeforces.com/contests")
                    .setThumbnail("https://image.freepik.com/free-vector/hand-holding-trophy_1284-3981.jpg")
                    .setFooter({text: `機器人版本 ${bot_version}`});
                var seconds = new Date().getTime() / 1000;
                var startTime = secondsToString(data[data.length - 1]['startTime'] - seconds);
                let sec = data[data.length - 1]['startTime'];
                let time = new Date(0);
                time.setSeconds(sec);
                let normalDate = time.toLocaleString('en-US',{timeZone:'Asia/Taipei'});
                embed.addFields(
                    {name: `名稱`, value: `${data[data.length - 1]['name']}`},
                    {name: `ID`, value: `${data[data.length - 1]['id']}`},
                    {name: `比賽時間`, value: normalDate},
                    {name: `比賽時長`, value: `${(parseInt(data[data.length - 1]['time']) / 60)}`},
                    {name: `距離比賽還有`, value: `${startTime}`}
                );

                interaction.reply({embeds: [embed], ephemeral: false});
            });
        };
        getContest();
    }
}

export = interactHandler;
