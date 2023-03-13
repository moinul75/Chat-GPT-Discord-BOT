const express = require('express')
const app = express()
const PORT = process.env.PORT || 4040;

const dotenv = require('dotenv');
dotenv.config();

const Discord = require("discord.js");

const OpenApiKey = process.env['OpenAPIKey']
const DiscordKey = process.env['DiscordKey']
const OpenAIOrg = process.env['OpenAIOrg']


const { Client, GatewayIntentBits } = require('discord.js');
const client = new Discord.Client({
   intents: [
     GatewayIntentBits.Guilds,
     GatewayIntentBits.GuildMessages,
     GatewayIntentBits.MessageContent
   ] 
    
});

//set Open Ai 
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: OpenApiKey,
  organization:OpenAIOrg
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate',async(message)=>{
  try{
    //write the logic for this bot 
    if(message.author.bot) return 
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message.content,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
    });

    //lets reply the bot 
    message.reply(`${response.data.choices[0].text}`)

    
    
  }catch(error){
    console.log(error);
    
  }
});

client.login(DiscordKey);


app.get('/',(req,res)=>{
  res.send("Hello I am a Chat GPT Discord BOT ")
})



app.listen(PORT,(req,res)=>{
  console.log(`server is running on http://localhost:${PORT}`)

});

