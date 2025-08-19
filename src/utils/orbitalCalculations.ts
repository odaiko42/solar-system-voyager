import { CelestialBody, Asteroid } from '@/types/astronomy';

// Fonction utilitaire pour convertir un string en nombre déterministe
const hashStringToNumber = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Constantes pour les conversions d'échelle
const AU_TO_KM = 149597870.7; // 1 UA en km
const ORBITAL_SCALE_FACTOR = 15; // Facteur pour les distances orbitales des planètes (augmenté)
const MOON_ORBITAL_SCALE_FACTOR = 0.03; // Facteur pour les distances orbitales des lunes
const SIZE_SCALE_FACTOR = 0.00001; // Facteur pour les tailles des corps (ajusté)

// Rayons de référence pour les proportions (en km)
const EARTH_RADIUS = 6371; // Rayon de la Terre comme référence
const BASE_PLANET_SIZE = 0.2; // Taille d'affichage de base pour les planètes (augmentée)
const BASE_MOON_SIZE = 0.05; // Taille d'affichage de base pour les lunes (augmentée)

// Fonction pour calculer la taille d'affichage d'un corps céleste avec vraies proportions
export const calculateDisplayRadius = (body: CelestialBody): number => {
  // Calcul basé sur les vraies proportions par rapport à la Terre
  const sizeRatio = body.radius / EARTH_RADIUS;
  
  if (body.type === 'star') {
    // Soleil : taille proportionnelle mais réduite pour permettre aux planètes d'orbiter autour
    return 1.5; // Taille du soleil un peu augmentée mais toujours raisonnable
  } else if (body.type === 'planet') {
    // Planètes : proportions réelles mais échelle adaptée
    let planetSize = sizeRatio * BASE_PLANET_SIZE;
    
    // Ajustements spéciaux pour certaines planètes pour éviter qu'elles soient trop grosses
    if (body.id === 'jupiter') planetSize *= 0.3; // Jupiter réduit pour être visible
    if (body.id === 'saturn') planetSize *= 0.25; // Saturn réduit pour être visible
    
    return Math.max(0.05, Math.min(1.5, planetSize)); // Limites réalistes augmentées
  } else if (body.type === 'moon') {
    // Lunes : proportions réelles avec facteur de visibilité
    let moonSize = sizeRatio * BASE_MOON_SIZE;
    
    // Facteur de visibilité pour les lunes importantes
    if (body.id === 'moon') moonSize *= 2; // Lune terrestre plus visible
    if (body.id === 'ganymede' || body.id === 'titan') moonSize *= 1.8; // Grosses lunes plus visibles
    if (body.id === 'callisto' || body.id === 'io' || body.id === 'europa') moonSize *= 1.5;
    
    return Math.max(0.02, Math.min(0.3, moonSize)); // Limites réalistes pour les lunes
  }
  return 0.05;
};

// Fonction pour calculer la position d'une planète à une date donnée avec vraie inclinaison orbitale et excentricité
export const calculatePlanetPosition = (
  body: CelestialBody, 
  date: Date, 
  referenceDate: Date = new Date('2000-01-01T12:00:00Z') // J2000.0
): [number, number, number] => {
  // Si c'est le Soleil, rester au centre
  if (body.id === 'sun' || body.distance === 0) {
    return [0, 0, 0];
  }

  const daysSinceReference = (date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
  const orbitalProgress = (daysSinceReference / body.orbitalPeriod) % 1;
  const meanAnomaly = orbitalProgress * 2 * Math.PI;
  
  // Distance orbitale de base en unités d'affichage
  const baseOrbitRadius = body.distance * ORBITAL_SCALE_FACTOR;
  
  // Calculer l'excentricité et la distance réelle si disponible
  const eccentricity = body.eccentricity || 0;
  let actualRadius = baseOrbitRadius;
  let trueAnomaly = meanAnomaly;
  
  if (eccentricity > 0) {
    // Calcul de l'anomalie excentrique (équation de Kepler)
    let eccentricAnomaly = meanAnomaly;
    for (let i = 0; i < 5; i++) { // Itération de Newton-Raphson
      eccentricAnomaly = meanAnomaly + eccentricity * Math.sin(eccentricAnomaly);
    }
    
    // Calcul de l'anomalie vraie
    trueAnomaly = 2 * Math.atan2(
      Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
      Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
    );
    
    // Distance réelle tenant compte de l'excentricité
    actualRadius = baseOrbitRadius * (1 - eccentricity * Math.cos(eccentricAnomaly));
  }
  
  // Position dans le plan orbital initial (plan XY - écliptique de référence)
  const x = Math.cos(trueAnomaly) * actualRadius;
  const y = Math.sin(trueAnomaly) * actualRadius;
  const z = 0;
  
  // Appliquer les vraies transformations 3D avec inclinaison orbitale réelle
  // Amplification modérée pour la visibilité sans déformer la réalité
  const inclination = (body.inclination || 0) * Math.PI / 180 * 1.5; // Facteur 1.5 pour visibilité
  const longitudeOfAscendingNode = (body.longitudeOfAscendingNode || 0) * Math.PI / 180;
  
  // Étape 1: Rotation autour de l'axe X (inclinaison orbitale par rapport à l'écliptique)
  const x1 = x;
  const y1 = y * Math.cos(inclination) - z * Math.sin(inclination);
  const z1 = y * Math.sin(inclination) + z * Math.cos(inclination);
  
  // Étape 2: Rotation autour de l'axe Z (longitude du nœud ascendant)
  const x_final = x1 * Math.cos(longitudeOfAscendingNode) - y1 * Math.sin(longitudeOfAscendingNode);
  const y_final = x1 * Math.sin(longitudeOfAscendingNode) + y1 * Math.cos(longitudeOfAscendingNode);
  const z_final = z1;
  
  return [x_final, y_final, z_final];
};

// Fonction pour calculer la position d'une lune avec vraies distances
export const calculateMoonPosition = (
  moon: CelestialBody,
  parentBody: CelestialBody,
  date: Date,
  referenceDate: Date = new Date('2000-01-01T12:00:00Z') // J2000.0
): [number, number, number] => {
  const parentPosition = calculatePlanetPosition(parentBody, date, referenceDate);
  
  const daysSinceReference = (date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
  const moonOrbitalProgress = (daysSinceReference / Math.abs(moon.orbitalPeriod)) % 1;
  
  // Gérer les orbites rétrogrades (Triton)
  const moonAngle = moon.orbitalPeriod < 0 ? 
    -moonOrbitalProgress * 2 * Math.PI : 
    moonOrbitalProgress * 2 * Math.PI;
  
  // Distance orbitale de la lune en unités d'affichage (améliorée)
  const moonOrbitRadius = moon.distance * MOON_ORBITAL_SCALE_FACTOR;
  
  // Position de la lune dans le plan orbital local
  const moonRelativeX = Math.cos(moonAngle) * moonOrbitRadius;
  const moonRelativeY = 0;
  const moonRelativeZ = Math.sin(moonAngle) * moonOrbitRadius;
  
  // Appliquer la vraie inclinaison orbitale de la lune
  const moonInclination = (moon.inclination || 0) * Math.PI / 180;
  const longitudeOfAscendingNode = (moon.longitudeOfAscendingNode || 0) * Math.PI / 180;
  
  // Rotation pour inclinaison
  const x1 = moonRelativeX;
  const y1 = moonRelativeY * Math.cos(moonInclination) - moonRelativeZ * Math.sin(moonInclination);
  const z1 = moonRelativeY * Math.sin(moonInclination) + moonRelativeZ * Math.cos(moonInclination);
  
  // Rotation pour longitude du nœud ascendant
  const finalX = x1 * Math.cos(longitudeOfAscendingNode) - y1 * Math.sin(longitudeOfAscendingNode);
  const finalY = x1 * Math.sin(longitudeOfAscendingNode) + y1 * Math.cos(longitudeOfAscendingNode);
  const finalZ = z1;
  
  return [
    parentPosition[0] + finalX,
    parentPosition[1] + finalY,
    parentPosition[2] + finalZ
  ];
};

// Fonction pour calculer la position d'un astéroïde avec vraies données orbitales
export const calculateAsteroidPosition = (
  asteroid: Asteroid,
  date: Date,
  referenceDate: Date = new Date('2000-01-01T12:00:00Z') // J2000.0
): [number, number, number] => {
  const daysSinceReference = (date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24);
  const yearsSinceReference = daysSinceReference / 365.25;
  
  // Position dans l'orbite (0 à 1)
  const orbitalProgress = (yearsSinceReference / asteroid.orbitalPeriod) % 1;
  
  // Conversion en anomalie vraie (simplifiée mais plus précise)
  const meanAnomaly = orbitalProgress * 2 * Math.PI;
  
  // Paramètres orbitaux
  const semiMajorAxis = (asteroid.perihelion + asteroid.aphelion) / 2;
  const eccentricity = (asteroid.aphelion - asteroid.perihelion) / (asteroid.aphelion + asteroid.perihelion);
  
  // Calcul de l'anomalie excentrique (équation de Kepler simplifiée)
  let eccentricAnomaly = meanAnomaly;
  for (let i = 0; i < 5; i++) { // Itération de Newton-Raphson
    eccentricAnomaly = meanAnomaly + eccentricity * Math.sin(eccentricAnomaly);
  }
  
  // Calcul de l'anomalie vraie
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
  );
  
  // Distance au Soleil en unités d'affichage
  const radius = semiMajorAxis * (1 - eccentricity * Math.cos(eccentricAnomaly)) * ORBITAL_SCALE_FACTOR;
  
  // Transformation 3D avec vraie inclinaison orbitale
  const inclination = asteroid.inclination * Math.PI / 180;
  // Utiliser un hash de l'ID pour une longitude déterministe
  const longitudeOfAscendingNode = (hashStringToNumber(asteroid.id) % 360) * Math.PI / 180;
  
  // Position dans le plan orbital initial
  const x = Math.cos(trueAnomaly) * radius;
  const y = Math.sin(trueAnomaly) * radius;
  const z = 0;
  
  // Étape 1: Rotation autour de l'axe X (inclinaison orbitale)
  const x1 = x;
  const y1 = y * Math.cos(inclination) - z * Math.sin(inclination);
  const z1 = y * Math.sin(inclination) + z * Math.cos(inclination);
  
  // Étape 2: Rotation autour de l'axe Z (longitude du nœud ascendant)
  const x_final = x1 * Math.cos(longitudeOfAscendingNode) - y1 * Math.sin(longitudeOfAscendingNode);
  const y_final = x1 * Math.sin(longitudeOfAscendingNode) + y1 * Math.cos(longitudeOfAscendingNode);
  const z_final = z1;
  
  return [x_final, y_final, z_final];
};

// Génère les points de trajectoire d'un astéroïde
export const generateAsteroidTrajectory = (
  asteroid: Asteroid,
  centerDate: Date,
  numberOfPoints: number = 200
): [number, number, number][] => {
  const trajectory: [number, number, number][] = [];
  const periodInDays = asteroid.orbitalPeriod * 365.25;
  
  // Générer des points sur une orbite complète centrée autour de la date
  const startDate = new Date(centerDate.getTime() - (periodInDays * 1000 * 60 * 60 * 24) / 2);
  
  for (let i = 0; i < numberOfPoints; i++) {
    const currentDate = new Date(startDate.getTime() + (i / numberOfPoints) * periodInDays * 1000 * 60 * 60 * 24);
    const position = calculateAsteroidPosition(asteroid, currentDate);
    trajectory.push(position);
  }
  
  return trajectory;
};

// Calcule la position orbitale en utilisant les apsides (périhélie et aphélie)
export const calculateOrbitalPositionWithApsides = (
  body: CelestialBody,
  currentDate: Date
): [number, number, number] => {
  // Si les apsides ne sont pas disponibles, utiliser la méthode classique
  if (!body.perihelion || !body.aphelion) {
    return calculatePlanetPosition(body, currentDate);
  }

  // Calcul de l'anomalie moyenne
  const timeSinceEpoch = (currentDate.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24);
  const meanAnomaly = (2 * Math.PI * timeSinceEpoch) / body.orbitalPeriod;

  // Résolution de l'équation de Kepler pour l'anomalie excentrique
  const eccentricity = body.eccentricity || 0;
  let eccentricAnomaly = meanAnomaly;
  
  // Méthode de Newton-Raphson pour résoudre l'équation de Kepler
  for (let i = 0; i < 10; i++) {
    const delta = eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly;
    eccentricAnomaly = eccentricAnomaly - delta / (1 - eccentricity * Math.cos(eccentricAnomaly));
  }

  // Calcul de l'anomalie vraie
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
  );

  // Distance au foyer (Soleil) en fonction de l'anomalie vraie
  const semiMajorAxis = (body.perihelion + body.aphelion) / 2;
  const distance = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(trueAnomaly));

  // Conversion de la distance en unités d'affichage
  const scaledDistance = distance * ORBITAL_SCALE_FACTOR;

  // Calcul des coordonnées dans le plan orbital
  const x = scaledDistance * Math.cos(trueAnomaly);
  const y = scaledDistance * Math.sin(trueAnomaly);

  // Application des éléments orbitaux (inclinaison, longitude du nœud ascendant)
  const inclination = (body.inclination || 0) * Math.PI / 180;
  const longitudeOfAscendingNode = (body.longitudeOfAscendingNode || 0) * Math.PI / 180;

  // Rotation pour l'inclinaison orbitale
  const xInclined = x;
  const yInclined = y * Math.cos(inclination);
  const zInclined = y * Math.sin(inclination);

  // Rotation pour la longitude du nœud ascendant
  const xFinal = xInclined * Math.cos(longitudeOfAscendingNode) - yInclined * Math.sin(longitudeOfAscendingNode);
  const yFinal = xInclined * Math.sin(longitudeOfAscendingNode) + yInclined * Math.cos(longitudeOfAscendingNode);
  const zFinal = zInclined;

  return [xFinal, zFinal, yFinal]; // Adapter les axes pour Three.js (Y vers le haut)
};

// Fonction pour calculer la variation de distance extrême (utile pour Pluton, Sedna, etc.)
export const calculateOrbitalVariation = (body: CelestialBody): {
  minDistance: number;
  maxDistance: number;
  variation: number;
} => {
  const perihelion = body.perihelion || body.distance;
  const aphelion = body.aphelion || body.distance;
  const variation = ((aphelion - perihelion) / perihelion) * 100;

  return {
    minDistance: perihelion,
    maxDistance: aphelion,
    variation: variation // Pourcentage de variation
  };
};

// Fonction pour détecter si un objet transneptunien peut être plus proche que Neptune
export const isCloserThanNeptune = (body: CelestialBody, neptuneDistance: number = 30.07): boolean => {
  const perihelion = body.perihelion || body.distance;
  return perihelion < neptuneDistance;
};
