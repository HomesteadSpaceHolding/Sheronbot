const discord = require("discord.js");
const fs = require("fs");
const bot = new discord.Client();
const { Client } = require('pg');
const botconfig = require("../botconfig.json");
const moment = require("moment");
const ms = require('parse-ms');

bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();
cooldowns = new discord.Collection();

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {require(`./DcdHandler/${handler}`)(bot);});


bot.on("message", async (message) => {
  if (message.author.bot) return;//Если автор другой бот - нет.
  if (message.channel.type == "dm") return;//Если команда в личку - нет.
  if (message.guild.id != "719436813235912704") return;//Проверяем сервер
  let channelidea = bot.channels.cache.get(`728529479575535686`)
  if(message.channel.id === channelidea.id){
    if(message.author.id === "297577892156669954") return;
    message.delete();//Удаляем сообщение
    let embed = new discord.MessageEmbed()
    .setTitle(`Идея от ${message.author.tag}`)
    .setDescription(`**Суть идеи: \`${message.content}\`**`)
    .addField(`**Описание реакций**`, `**<:yes:735180914438570075> - хорошая идея\n\n<:no:735180914417598484> - плохая идея**`)
    .setThumbnail(message.author.avatarURL({format: 'png', dynamic: true, size: 1024}))
    .setTimestamp();
    channelidea.send("**Внимание! <@&737985412680646717> была предложена новая идея, рассмотрите её**", embed).then(async(msg) => {
      await msg.react("<:yes:735180914438570075>");
      await msg.react("<:no:735180914417598484>");
    });
  }
  let prefix = `/`;
  if (!message.content.startsWith(prefix)) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;
  let command = bot.commands.get(cmd);
  if (!command) command = bot.commands.get(bot.aliases.get(cmd));
  if (command) {
    command.run(bot, message, args);
  }
});

bot.login(botconfig.tokendcd)
