module.exports = {
    name: 'fetch-roles',
    description: 'This command fetches all roles on the server',
    execute(message, args, Discord) {
        let rolemap = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join("\n");
        if (rolemap.length > 1024) rolemap = "Too many roles to display";
        if (!rolemap) rolemap = "No roles";
        let embed = new Discord.MessageEmbed()
            .addField("Role List" , rolemap)
        message.channel.send(embed);
    }
};