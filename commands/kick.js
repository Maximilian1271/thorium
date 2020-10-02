module.exports = {
    name: 'voteban',
    description: 'Initiate a voteban on a person',                                                          //To-Do:Destroy the humble beginnings of my poorly chosen .json serverconfig idea, switch to some DB
    guildOnly: true,                                                                                        //To-Do:Implement wizard installation logic
    execute(message) {                                                                                      //To-Do:Implement reason param
        if (!message.mentions.users.size) {                                                                 //To-Do:Implement dynamic ban duration
            return message.reply('at least one user needs to be tagged!');                                  //To-Do:Implement option to prune target
        }
        const taggedOffender = message.mentions.users.first();
        const user = message.author.username;
        message.channel.send(`A voteban has been issued against ${taggedOffender.toString()} by ${user}. \n This vote is going to last 10 minutes. \n Only certain users may vote`)
            .then(async function (message) {
                await message.react('👍');
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '👍'
                };
                const collector = message.createReactionCollector(filter, {time: 10000});           //To-Do:Make Dynamic (Time)
                collector.on('collect', (reaction, user) => {
                    let uid = message.guild.members.cache.get(user.id);
                    if (uid._roles.find(roleid => roleid === '758619799642308618')) {             //To-Do:Make Dynamic (Permitted Role[s])
                        console.log(`${user.username}'s vote has been successfully registered.`)
                    } else {
                        message.guild.roles.fetch('758619799642308618')
                            .then(role => message.channel
                                .send(`Sorry ${user.toString()}, this vote is only available for users bearing the "${role.name}" role`)
                                .then(message => message.delete({timeout: 7000})))
                            .catch((e) => console.log("An error has occured: " + e))
                            .finally(reaction.users.remove(user));
                        console.log(`A reaction has been removed by "${user.username}" due to insufficient role power`)
                    }
                }).on('end', (collected, reason) => {
                    console.log((collected.first().count)-1)
                });
            });
    },
};