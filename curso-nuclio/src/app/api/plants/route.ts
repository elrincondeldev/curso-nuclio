import { NextResponse } from "next/server";
import {
  callOpenAI,
  validateRequest,
  cleanOpenAIResponse,
  saveToDataBase,
} from "@/lib/plantsHooks";
import { PlantResponse } from "@/interfaces/plant";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
interface Plant {
  image: string;
}

const client = await clientPromise;

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const db = client.db();

    const plantsCollection = db.collection("plants");

    if (!id) {
      const plants = await plantsCollection.find().toArray();
      return NextResponse.json(plants);
    }

    const plant = await plantsCollection.findOne({ _id: new ObjectId(id) });

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    return NextResponse.json(plant);
  } catch (error) {
    console.error("Error fetching plants", error);
    return NextResponse.json(
      {
        error: "Error fetching plants",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const db = client.db();

  const plantsCollection = db.collection("plants");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await plantsCollection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Plant deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting plant", error);
    return NextResponse.json(
      { error: "Error deleting plant" },
      { status: 500 }
    );
  }
}
