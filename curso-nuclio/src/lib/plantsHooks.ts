import clientPromise from "./mongodb";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PlantResponse } from "@/interfaces/plant";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = await clientPromise;

export function cleanOpenAIResponse(response: string) {
  let cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "");

  cleaned = cleaned.trim();

  return cleaned;
}

export async function validateRequest() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: "OpenAI API key is not defined",
      },
      { status: 500 }
    );
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        error: "MongoDB URI is not defined",
      },
      { status: 500 }
    );
  }
}

export async function callOpenAI(image: string) {
  const prompt = `Analiza esta imagen de una planta y proporciona una respuesta detallada en formato JSON con la siguiente estructura:
    {
      "name": "Nombre común de la planta",
      "description": "Breve descripción de las características y apariencia de la planta",
      "difficult": "easy/medium/hard - basado en qué tan desafiante es mantenerla",
      "water": ["lunes", "miércoles", "viernes"] - array de días de la semana en español para el riego recomendado,
      "temperature": number - rango de temperatura óptima en Celsius,
      "humidity": number - porcentaje de humedad requerido,
      "light": "low/medium/high - requisitos de luz"
    }
    
    Por favor asegúrate de que todos los valores coincidan exactamente con el formato especificado y los enums. La respuesta debe ser JSON válido.
    Devuelve solo JSON válido sin comentarios o explicaciones adicionales.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: image,
            },
          },
        ],
      },
    ],
    temperature: 0.0,
  });

  return completion.choices[0].message.content;
}

export async function saveToDataBase(plant: PlantResponse, image: string) {
  const db = client.db();

  try {
    const result = {
      ...plant,
      image: image,
      createdAt: new Date(),
    };

    const plantCollection = db.collection("plants");
    await plantCollection.insertOne(result);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error saving plant to database", error);
    throw error;
  }
}
