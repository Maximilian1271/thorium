module.exports = {
    name: 'voteban',
    description: 'Initiate a voteban on a person',
    execute(message) {
        if (!message.mentions.users.size) {
            return message.reply('at least one user needs to be tagged!');
        }
        const taggedOffender = message.mentions.users.first();
        const user=message.author.username;
        message.channel.send(`A voteban has been issued against ${taggedOffender.toString()} by ${user}. \n This vote is going to last 10 minutes. \n Only certain users may vote`)
            .then(async function (message) {
                await message.react('👍');
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '👍'
                };
                const collector = message.createReactionCollector(filter, {time: 10000});
                collector.on('collect', (reaction, user) => {
                    let uid=message.guild.members.cache.get(user.id);
                    //const res=uid;
                    if(uid._roles.find(roleid=>roleid==='758619799642308618')){
                        console.log("Role found!")
                    }
                    else {
                        message.guild.roles.fetch('758619799642308618')
                            .then(role=>message.channel
                            .send(`Sorry ${user.toString()}, this vote is only available for users bearing the "${role.name}" role`)
                            .then(message=>message.delete({timeout:7000})))
                            .catch((e)=>console.log("An error has occured: "+e))
                            .finally(reaction.users.remove(user));
                        //message.channel.send(`Sorry ${user.toString()}, this vote is only available for users bearing the ${role} role`).then(message=>message.delete({timeout: 5000}))
                        //reaction.users.remove(user);
                        // console.log(message.guild.roles.fetch('758619799642308618'));
                        console.log(`A reaction has been removed by ${user.username} due to insufficient role power`)
                    }
                    /*if(uid._roles.has('758619799642308618')){
                    //if(uid.filter(uid => )){
                        console.log("This user HAS the required role")
                    }
                    else{
                        console.log("Something went wrong, but here i should delete the reaction")
                    }*/
                    //console.log(uid._roles);
                })
                    .on('end', (collected, reason) => {
                        console.log(collected.first().count)
                    });
            });
    },
};