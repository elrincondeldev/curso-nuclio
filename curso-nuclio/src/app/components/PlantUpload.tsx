"use client";

import { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

interface PlantUploadProps {
  onPlantAdded: () => void;
}

export default function PlantUpload({ onPlantAdded }: PlantUploadProps) {
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la imagen");
      }

      setImage("");
      onPlantAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-8">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-6">
          Añadir Nueva Planta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              isDragging
                ? "border-emerald-500 bg-emerald-100"
                : "border-emerald-200 hover:border-emerald-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            <div className="text-center">
              <div className="mx-auto w-12 h-12 mb-4 text-emerald-500">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-emerald-700">
                Arrastra una imagen aquí o{" "}
                <span className="text-emerald-600 font-medium">
                  selecciona un archivo
                </span>
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                PNG, JPG o JPEG (máx. 5MB)
              </p>
            </div>
          </div>

          {image && (
            <div className="relative group">
              <img
                src={image}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg
                  className="w-5 h-5 text-emerald-600"
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
          )}

          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <Button type="submit" disabled={!image} isLoading={loading}>
            {loading ? "Procesando..." : "Analizar Planta"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
