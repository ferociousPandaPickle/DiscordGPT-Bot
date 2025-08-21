import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { InferenceClient } from '@huggingface/inference';

const token = process.env.DISCORD_BOT_TOKEN;
const channel_Id = process.env.CHANNEL_ID;
const hf_token = process.env.HUGGING_FACE_TOKEN;

const client = new Client({
    intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]
});
//Guilds help it to know about the server structure
//GuildMessages allow it to receive messages
//MessageContent allow it to read messages

client.on('clientReady', ()=>{
    console.log('Charged and Ready!')
})
//Just tells us the bot is online
//
const inference = new InferenceClient(hf_token);

async function getGPTResponse(message){
    const response = await inference.chatCompletion({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        max_tokens:250,
        messages: [
            {
                role: "user",
                content: message
            },
        ]
    });

    return response.choices[0].message.content;
}

const Command_Start = ">";

client.on('messageCreate', async (message) =>{
    if(message.author.bot) return;
    if(!message.content.startsWith(Command_Start)) return;
    if(message.channelId !== channel_Id && !message.mentions.users.has(client.user.id)) return;

    await message.channel.sendTyping();

    await message.reply(await getGPTResponse(message.content));
    //now you need to have a function that generates this response from GPT

});



client.login(token);


