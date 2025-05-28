export interface PlantResponse {
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  water: string[];
  temperature: number;
  humidity: number;
  light: "low" | "medium" | "high";
  image: string;
}
