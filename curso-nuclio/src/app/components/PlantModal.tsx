"use client";

import { PlantResponse } from "@/interfaces/plant";
import { useState } from "react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";

interface PlantModalProps {
  plant: (PlantResponse & { _id: string }) | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function PlantModal({
  plant,
  onClose,
  onDelete,
}: PlantModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!plant) return null;

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/plants?id=${plant._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la planta");
      }

      onDelete();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-emerald-100">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-800">
                {plant.name}
              </h2>
              <div className="flex items-center space-x-2 mt-2">
                <Badge
                  variant="difficulty"
                  value={plant.difficulty}
                  className="px-3 py-1 text-sm"
                />
                <Badge
                  variant="light"
                  value={plant.light}
                  className="px-3 py-1 text-sm"
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="aspect-square rounded-xl overflow-hidden shadow-md">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                  Descripción
                </h3>
                <p className="text-emerald-700 leading-relaxed">
                  {plant.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                  Cuidados
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Riego
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {plant.water.map((day, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ProgressBar
                    value={plant.temperature}
                    max={40}
                    variant="amber"
                    label="Temperatura"
                    valueLabel={`${plant.temperature}°C`}
                  />
                  <ProgressBar
                    value={plant.humidity}
                    max={100}
                    variant="sky"
                    label="Humedad"
                    valueLabel={`${plant.humidity}%`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              variant={showDeleteConfirm ? "danger" : "secondary"}
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              {showDeleteConfirm ? "Confirmar eliminación" : "Eliminar planta"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
