const express = require('express');
const app = express();
const cors = require('cors');
const { OpenAI } = require('openai');

const PORT = 8080;
require("dotenv").config();

//security thing
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//initialize client
const OpenAIClient = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
})

app.post('/generate-story', async (req,res)=>{
    console.log("inside generate-story");
    const prompt = req.body;

    //chatGPT part
    try{
        const chatCompletion = await OpenAIClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
        
                {role:"system", content:"You write like the author Clarice Lispector"},
                {role:"user", content:`Write 4 sentences with a detailed interpretation of the following dream based on Jungian archetypes: ${prompt}`}
        
            ],
            max_tokens:500,
            //keeping higher temperature because i want more creative flow
            temperature:0.9

        })
        console.log("made it to");

        const story = chatCompletion.choices[0].message.content;
        //return as a json
        res.json({ story });
    }
    catch(error){
        console.log(error);

    }
})

app.post('/generate-image',async (req,res)=>{
    const {prompt} = req.body;

    try {
        const imageResponse = await OpenAIClient.images.generate({
            model: "dall-e-2",
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        });

        const imageUrl = imageResponse.data[0].url;
        res.json({ imageUrl });
    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Image generation failed." });
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}/home.html`);
})


