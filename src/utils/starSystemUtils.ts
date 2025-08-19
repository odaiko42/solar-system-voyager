// Utilitaires pour les systèmes stellaires
export interface StarSystemScale {
  min: number;
  max: number;
  name: string;
  description: string;
}

export const SCALES: StarSystemScale[] = [
  {
    min: 0.1,
    max: 1000,
    name: "Planétaire",
    description: "Surfaces planétaires et lunes"
  },
  {
    min: 1000,
    max: 100000,
    name: "Système local",
    description: "Planètes et orbites"
  },
  {
    min: 100000,
    max: 10000000,
    name: "Système stellaire",
    description: "Étoile et système planétaire complet"
  },
  {
    min: 10000000,
    max: 1000000000,
    name: "Interstellaire",
    description: "Étoiles proches et systèmes voisins"
  },
  {
    min: 1000000000,
    max: 630000000000,
    name: "Galactique",
    description: "Bras galactiques et structure de la Voie Lactée"
  }
];

export function getCurrentScale(distance: number): StarSystemScale {
  return SCALES.find(scale => distance >= scale.min && distance <= scale.max) || SCALES[0];
}

export function getStarBrightness(luminosity: number, distance: number, cameraDistance: number): number {
  // Calcul réaliste de la luminosité apparente
  const apparentMagnitude = Math.log10(luminosity) - 2.5 * Math.log10(distance * distance);
  const brightness = Math.max(0.1, Math.min(2.0, apparentMagnitude + cameraDistance / 1000000));
  return brightness;
}

export function getStarSize(luminosity: number, distance: number, cameraDistance: number): number {
  // Taille adaptative selon la distance de la caméra et la luminosité
  const baseSizeFromLuminosity = Math.sqrt(luminosity) * 100;
  const distanceScale = Math.max(0.5, Math.min(5.0, cameraDistance / 100000));
  return Math.max(50, baseSizeFromLuminosity * distanceScale);
}

export function getPlanetVisibilityRange(systemDistance: number): { min: number; max: number } {
  // Plage de visibilité des planètes basée sur la distance du système
  const baseRange = systemDistance * 1000; // Conversion AL vers unités
  return {
    min: baseRange * 0.001,
    max: baseRange * 100
  };
}

export function calculateOptimalCameraDistance(systemPosition: [number, number, number]): number {
  // Distance optimale pour voir un système planétaire complet
  const systemScale = Math.sqrt(
    systemPosition[0] ** 2 + systemPosition[1] ** 2 + systemPosition[2] ** 2
  );
  return Math.max(500000, systemScale * 0.3);
}

export function interpolateZoom(
  start: number,
  end: number,
  progress: number,
  easing: 'linear' | 'easeInOut' | 'easeOut' = 'easeInOut'
): number {
  let easedProgress = progress;
  
  switch (easing) {
    case 'easeInOut':
      easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - 2 * (1 - progress) * (1 - progress);
      break;
    case 'easeOut':
      easedProgress = 1 - (1 - progress) * (1 - progress);
      break;
    default:
      easedProgress = progress;
  }
  
  return start + (end - start) * easedProgress;
}