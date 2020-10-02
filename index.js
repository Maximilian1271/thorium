const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token, welcome, debug} = require('./config.json');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL']});
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();
client.once('ready', () => {
    console.log('Ready!');
});
client.on('guildCreate', async (guild)=>{
    //execute on first guild join
    const auditLog=await guild.fetchAuditLogs({type:28})
    const invitee=auditLog.entries.last().executor;
    let botOwner=new Map().set("Owner", invitee)
    let jsontxt=JSON.stringify(Array.from(botOwner.entries()))
    //fetch guild audit log to get executor/invitee
    try{
        //if invitee has DM's enabled, send welcome message
        await invitee.send(`Hi ${invitee.username}!\n`+welcome);
        await fs.writeFile('./serverConfig/'+guild.id+".srvconf", jsontxt, () => {console.log("Shits been saved lads!")});
    }
    catch (error){
        if (error.code===50007){
            //if invitee has DM's disabled and APIError 50007(Cannot send messages to this user) occurs, send welcome message to systemChannel
            await guild.systemChannel.send(`${invitee.toString()}.\n It seems like you have turned off \"DM's from members on this Server.\"\n Please execute \">wizard\" in a trusted channel.`);
            await fs.writeFile('./serverConfig/'+guild.id+".srvconf", jsontxt, () => {console.log("Shits been saved lads!")});
        }
        //this is for when shit really hits the fan like api timeouts, bot ban, etc. whatever.
        else{error.console;}
    }
});
client.on('message', (message) => {
    if (debug){
        if(message.content===">debugGuildDelete"){
            client.emit('guildDelete', message.guild);
        }
        else if (message.content===">debugGuildCreate"){
            client.emit('guildCreate', message.guild);
        }
    }
    //check if prefix is invoked and message isn't from the or any other bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    //prepare arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    //sanitize user input and scan for .js file bearing the command name
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    //if it fails, fuck up
    if (!command) return;
    //if 'guildOnly' argument is set, refuse execution inside DM's
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }
    //check if command requires arguments, fuck up if user didn't provide any
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
    //check if the command has a cooldown property and run date/time magic to make cooldown happen
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    try {
        command.execute(message, args, Discord);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});
client.on('guildDelete', guild=>{
    if (fs.existsSync('./serverConfig/'+guild.id+'.srvconf')){
        fs.unlink('./serverConfig/'+guild.id+'.srvconf', (err) => {
            console.log("Guild Config file was deleted successfully! ("+guild.id+")")
        })
    }
})
//send everything
client.login(token);