import { NextResponse } from "next/server";
import {
  callOpenAI,
  validateRequest,
  cleanOpenAIResponse,
  saveToDataBase,
} from "@/lib/plantsHooks";
import { PlantResponse } from "@/interfaces/plant";

interface Plant {
  image: string;
}

export async function POST(request: Request) {
  const validationError = await validateRequest();

  if (validationError) {
    return validationError;
  }

  const body: Plant = await request.json();
  const { image } = body;

  if (!image) {
    return NextResponse.json(
      {
        error: "Image is required",
      },
      { status: 400 }
    );
  }

  const response = await callOpenAI(image);

  if (!response) {
    throw new Error("No response from OpenAI");
  }

  let plant: PlantResponse;

  try {
    const cleanedResponse = cleanOpenAIResponse(response);
    plant = JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Error parsing plant from OpenAI response", error);
    throw error;
  }

  const result = await saveToDataBase(plant, image);

  return result;
}
