//story generation from click
async function generateStory(prompt){
    
    const response = await fetch('/generate-story',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })


    });
    const data = await response.json();
    console.log(data.story);
    const storyBox = document.getElementById('result');
    storyBox.innerText = data.story;
    generateImage(data.story);

}
async function generateImage(prompt){
   
    //only removing filler words that i've received from the prompt to then use for abstract image generation
    console.log(prompt)
    const boringWords = ["a", "an", "the", "of", "in", "at", "on", "with", "and", "but", "or", "for", "to", "from"];
    const words = prompt.split(/\s+/).filter(word => !boringWords.includes(word.toLowerCase()));
    prompt = words.join(", ")+" visually like a mathematical abstract dream." || "abstract dream";
    const imageBox = document.getElementById('image-result');
    imageBox.innerText = "Generating...";
    console.log(prompt)
    try{

    const response = await fetch('generate-image', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    //if it actually returns an image
    if(data.imageUrl){
        imageBox.src = data.imageUrl;

    }
}
catch(error){
    console.log("error generating image");
}
    

}

async function generateClick(){
    console.log("inside generateclick");
    const prompt = document.getElementById('prompt').value;
    const storyBox = document.getElementById('result');

    storyBox.innerText="Generating..."

    await generateStory(prompt);
}


