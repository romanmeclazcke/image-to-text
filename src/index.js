import express from "express";
import dotenv from "dotenv";
import { Router } from "express";
import { HfInference } from "@huggingface/inference";
import fetch from "node-fetch"; // Añadido para el uso de fetch en Node.js

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Proporciona un valor por defecto si PORT no está definido
const router = Router();

app.use(express.json()); // Asegúrate de usar esto antes de tus rutas
app.use(router);

const hf = new HfInference(process.env.TOKEN);

router.post("/", async (req, res) => {
    try {
        const { imageUrl } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({ message: "No image URL provided", details: false });
        }
       
       const response= await fetch(imageUrl);
       const blob = await response.blob()
        
        const result = await hf.imageToText({
            data: blob, 
            model: "Salesforce/blip-image-captioning-large"
        });

        result
            ? res.status(200).json({ message: result, details: true })
            : res.status(500).json({ message: "Internal server error", details: false });
    } catch (err) {
        res.status(500).json({ message: err, details: false });
    }
});

const bootstrap = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Servidor en ejecución en el puerto ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
};

bootstrap();
