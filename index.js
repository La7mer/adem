const Discord = require("discord.js");
const client = new Discord.Client({ intents: 32767 });
const config = require("./config.json");
const mysql = require("mysql");
const fs = require("fs")
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

const conexao = mysql.createPool({
  host: `localhost`,
  user: `root`,
  password: ``,
  database: `la7mer fivem mta`
})

console.log("Conectado com sucesso")

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(config.token);

client.on('messageCreate', message => {
  const ChannelBanID = "1016871836153294848";

  if (message.author.bot && message.channel.id !== ChannelBanID) return;
  if (message.channel.type == 'dm') return;
  if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase()) && message.channel.id !== ChannelBanID) return;
  if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

  const args = message.content
    .trim().slice(config.prefix.length)
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  const args2 = message.content.split(' ')

  let tempo = args2[1]
  let tipo = args2[2]
  let servidor = client.guilds.cache.get("1106630451155718144")
	let user = servidor.members.cache.get(args2[0])
  let motivo = args2.splice(3).join(" ")


  if (tipo === "h") {
    if (tempo != "1") {
      tipo2 = "horas"
    } else {
      tipo2 = "hora"
    }
  } else if (tipo === "d") {
    if (tempo != "1") {
      tipo2 = "dias"
    } else {
      tipo2 = "dia"
    }
  } else if (tipo === "m") {
    if (tempo != "1") {
      tipo2 = "meses"
    } else {
      tipo2 = "mês"
    }
  }

  if (message.channel.id === ChannelBanID && message.author.id === "1016889265856192532") {
    let embedmensagem = new Discord.MessageEmbed()
    .setColor("#2f3136")
    .setTitle(`Sistema de banimentos`)
    .setDescription(`\n \nVocê foi banido por **${tempo} ${tipo2}** do servidor.\n**Motivo: **${motivo[0].toUpperCase() + motivo.substr(1)}.`)
    user.send({ embeds: [embedmensagem] }).catch(error => { })

    message.delete( )
  }

  try {
    const commandFile = require(`./commands/${command}.js`)
    commandFile.run(client, message, args, conexao);
  } catch (err) {
  }
});