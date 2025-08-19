export interface CelestialBody {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'moon' | 'asteroid' | 'dwarf_planet';
  radius: number;
  distance: number; // Distance from parent body (AU for planets, km for moons)
  color: string;
  rotationPeriod: number; // Days
  orbitalPeriod: number; // Days
  parent?: string; // Parent body ID
  position?: [number, number, number];
  texture?: string;
  inclination?: number; // Orbital inclination in degrees
  longitudeOfAscendingNode?: number; // Longitude of ascending node in degrees
  axialTilt?: number; // Axial tilt (obliquity) in degrees
  eccentricity?: number; // Orbital eccentricity (0 = circle, <1 = ellipse)
  perihelion?: number; // Closest approach to parent (AU for planets, km for moons)
  aphelion?: number; // Farthest distance from parent (AU for planets, km for moons)
  mass?: number; // Mass in kg
}

export interface Asteroid {
  id: string;
  name: string;
  discoveryDate: string;
  diameter: number; // km
  type: 'Near-Earth' | 'Main Belt' | 'Trojan' | 'Centaur';
  orbitalPeriod: number; // years
  perihelion: number; // AU
  aphelion: number; // AU
  inclination: number; // degrees
  description: string;
  trajectory: OrbitPoint[];
  isActive: boolean;
}

export interface Meteorite {
  id: string;
  name: string;
  type: 'asteroid' | 'comet' | 'debris' | 'artificial';
  mass: number; // kg
  diameter: number; // km
  velocity: [number, number, number]; // km/s (x, y, z)
  position: [number, number, number]; // AU
  direction: [number, number, number]; // normalized vector
  color: string;
  trail: OrbitPoint[];
  isActive: boolean;
  discoveryDate?: string;
  description: string;
  impactDate?: string;
  impactLocation?: string;
}

export interface OrbitPoint {
  date: Date;
  position: [number, number, number];
  velocity: [number, number, number];
}

export interface SimulationState {
  currentDate: Date;
  timeScale: number; // Days per second
  isPlaying: boolean;
  selectedAsteroid: Asteroid | null;
  selectedMeteorite: Meteorite | null;
  showOrbits: boolean;
  showAsteroidPath: boolean;
  showPlanetNames: boolean;
  showMeteorites: boolean;
  showMeteoriteTrails: boolean;
  sunIntensity: number; // Sun light intensity (0-10)
  showGalaxies: boolean; // Show Milky Way and Andromeda
  showAsteroidBelt: boolean; // Show asteroid belt
  showKuiperBelt: boolean; // Show Kuiper belt
  showBeltDensity: boolean; // Show belt particle clouds
  showMoons: {
    [planetId: string]: boolean;
  };
}