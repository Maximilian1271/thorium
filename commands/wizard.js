const jsonToMap = require('./../functions/jsonToMap');
const fs=require('fs');
module.exports = {
    name: 'wizard',
    description: 'Run the initialization wizard. This should normally be done on first invite. Overwrites current config.',
    ownerOnly: true,
    execute(message){
        if (this.ownerOnly){
            fs.readFile('./serverConfig/'+message.guild.id+'.srvconf', (err, data)=>{
                if (err){throw err;}
                let OwnerID=jsonToMap(data.toString('utf-8')).get('Owner').id
                if(OwnerID!==message.author.id){
                    return message.reply(`Sorry, only the owner of this bot may invoke this command. The current owner is: ${message.author.username}`).then(message=>message.delete({timeout: 7000}));
                }else {
                    return message.reply(`Wizard will commence shortly. (To-Do)`)
                }
            })
        }
    },
};