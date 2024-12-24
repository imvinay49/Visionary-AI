import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const HF_API_URL = 'https://api-inference.huggingface.co/models/prithivMLmods/Canopus-LoRA-Flux-UltraRealism-2.0';
const HF_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN || "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"; // Set to your Hugging Face API token

const router = express.Router();

router.route('/').get((req,res)=>{
    res.send("hello world")
})

router.route('/').post(async (req, res) => {
    try {
        const prompt = req.body?.prompt;  // Extract the prompt from the request body
        // Check if the prompt is provided
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        // Function to call the Hugging Face API
        async function query() {
            const response = await fetch(HF_API_URL, {
                headers: {
                    Authorization: `Bearer ${HF_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch image from Hugging Face API");
            }

            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return buffer.toString('base64');
        }

        // Call the query function
        const base64Image  = await query();
        res.json({ image: `data:image/jpeg;base64,${base64Image}` });
        

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Image generation failed" });
    }
});

export default router;
