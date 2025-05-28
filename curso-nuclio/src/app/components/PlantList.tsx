"use client";

import { useState, useEffect } from "react";
import { PlantResponse } from "@/interfaces/plant";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

interface PlantListProps {
  onPlantClick: (plant: PlantResponse & { _id: string }) => void;
}

export default function PlantList({ onPlantClick }: PlantListProps) {
  const [plants, setPlants] = useState<(PlantResponse & { _id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    try {
      const response = await fetch("/api/plants");
      if (!response.ok) {
        throw new Error("Error al cargar las plantas");
      }
      const data = await response.json();
      setPlants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="text-emerald-700 text-sm">Cargando plantas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center border border-red-200">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-emerald-500">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-emerald-800 mb-2">
          No hay plantas registradas
        </h3>
        <p className="text-emerald-600">
          Sube una imagen para comenzar a analizar tus plantas
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {plants.map((plant) => (
        <Card key={plant._id} onClick={() => onPlantClick(plant)}>
          <div className="relative aspect-square">
            <img
              src={plant.image}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">
              {plant.name}
            </h3>
            <p className="text-sm text-emerald-700 line-clamp-2">
              {plant.description}
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <Badge variant="difficulty" value={plant.difficulty} />
              <Badge variant="light" value={plant.light} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
