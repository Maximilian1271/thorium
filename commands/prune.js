module.exports = {
    name: 'prune',
    description: 'prunes an entire channel just for the fun of it',
    guildOnly: true,
    execute(message, args) {
        const arg=parseInt(args)
        if (isNaN(arg)){
            return message.channel.send("This command requires at least 1 numerical argument (Amount of messages to be pruned)").then(message=>message.delete({timeout:7000})).catch((e)=>console.error(e));
        }
        else if(arg>99){
            return message.channel.send("This command may only Prune a maximum of 100 messages at once").then(message=>message.delete({timeout:7000})).catch((e)=>console.error(e));
        }
        else if(Number.isInteger(arg)&&!isNaN(arg)){
            return message.channel.bulkDelete(arg).then(message.channel.send(`${message.size} Messages have successfully been pruned off of this channel.`).then(message=>message.delete({timeout:7000})));
        }
    }
};