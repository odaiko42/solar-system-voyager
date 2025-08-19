import { Meteorite } from '@/types/astronomy';

export const famousMeteorites: Meteorite[] = [
  {
    id: 'chelyabinsk',
    name: 'Météorite de Tcheliabinsk',
    type: 'asteroid',
    mass: 12000000, // kg (estimé)
    diameter: 0.017, // 17 mètres
    velocity: [18.6, -2.5, 0], // km/s
    position: [0.98, 0, 0.1], // Position d'entrée atmosphérique
    direction: [-0.95, -0.3, 0.05],
    color: '#FF6B35',
    trail: [],
    isActive: false,
    discoveryDate: '2013-02-15',
    impactDate: '2013-02-15',
    impactLocation: 'Tcheliabinsk, Russie',
    description: 'Météorite qui a explosé au-dessus de la Russie en 2013, blessant plus de 1500 personnes par les éclats de verre.'
  },
  {
    id: 'tunguska',
    name: 'Événement de la Toungouska',
    type: 'comet',
    mass: 1000000000, // kg (estimé) 
    diameter: 0.06, // 60 mètres estimés
    velocity: [15.0, -8.0, 2.0], // km/s
    position: [0.99, 0, 0.05],
    direction: [-0.85, -0.5, 0.15],
    color: '#4ECDC4',
    trail: [],
    isActive: false,
    discoveryDate: '1908-06-30',
    impactDate: '1908-06-30',
    impactLocation: 'Toungouska, Sibérie',
    description: 'Explosion aérienne qui a rasé 2150 km² de forêt sibérienne. Probablement une comète ou un astéroïde.'
  },
  {
    id: 'chicxulub',
    name: 'Impacteur de Chicxulub',
    type: 'asteroid',
    mass: 1000000000000000, // kg (1×10^15)
    diameter: 10, // 10-15 km
    velocity: [20.0, -15.0, 0], // km/s
    position: [1.2, 0, -0.2],
    direction: [-0.8, -0.6, 0.1],
    color: '#E74C3C',
    trail: [],
    isActive: false,
    discoveryDate: '1980-01-01', // Découverte de la théorie
    impactDate: '-66000000', // Il y a 66 millions d'années
    impactLocation: 'Péninsule du Yucatan, Mexique',
    description: 'Astéroïde géant responsable de l\'extinction des dinosaures il y a 66 millions d\'années.'
  },
  {
    id: 'hoba',
    name: 'Météorite de Hoba',
    type: 'asteroid',
    mass: 60000, // kg
    diameter: 0.0027, // 2.7 mètres
    velocity: [11.2, -5.0, 1.0], // km/s (impact à faible angle)
    position: [1.0, 0, 0],
    direction: [-0.9, -0.4, 0.2],
    color: '#95A5A6',
    trail: [],
    isActive: false,
    discoveryDate: '1920-01-01',
    impactDate: '-80000', // Il y a environ 80 000 ans
    impactLocation: 'Namibie',
    description: 'La plus grosse météorite connue sur Terre, composée de fer et de nickel. Pèse environ 60 tonnes.'
  },
  {
    id: 'oumuamua',
    name: '1I/ʻOumuamua',
    type: 'artificial', // Objet interstellaire
    mass: 500000000, // kg (estimé)
    diameter: 0.4, // 400 mètres de long
    velocity: [26.33, 0, 0], // km/s (vitesse interstellaire)
    position: [-2.0, 0, 0.5], // Venant de l'extérieur du système
    direction: [0.8, 0.1, -0.6], // Direction interstellaire
    color: '#9B59B6',
    trail: [],
    isActive: false,
    discoveryDate: '2017-10-19',
    description: 'Premier objet interstellaire détecté traversant notre système solaire. Forme allongée mystérieuse.'
  },
  {
    id: 'meteor-perseides',
    name: 'Perséide (exemple)',
    type: 'debris',
    mass: 0.001, // kg (grain de sable)
    diameter: 0.000001, // 1 mm
    velocity: [59.0, -10.0, 5.0], // km/s (très rapide)
    position: [1.0, 0.1, 0.05],
    direction: [-0.98, -0.15, -0.1],
    color: '#F39C12',
    trail: [],
    isActive: false,
    discoveryDate: '2024-08-12',
    description: 'Exemple d\'une météorite de l\'essaim des Perséides, débris de la comète Swift-Tuttle.'
  }
];

// Fonction pour générer une météorite aléatoire
export const generateRandomMeteorite = (): Meteorite => {
  const types: Meteorite['type'][] = ['asteroid', 'comet', 'debris'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Générer des caractéristiques aléatoires réalistes
  const mass = Math.pow(10, Math.random() * 10 + 1); // Entre 10 kg et 10^11 kg
  const diameter = Math.pow(mass / 2000, 1/3) / 1000; // Estimation basée sur la densité
  
  // Vitesse typique des météorites (11-72 km/s) avec distribution plus intéressante
  const speed = 11 + Math.random() * 61;
  const angle1 = Math.random() * Math.PI * 2;
  // Favoriser des angles plus prononcés pour des trajectoires spectaculaires
  const angle2 = (Math.random() - 0.5) * Math.PI * 1.5; // Augmentation de la variation verticale
  
  const velocity: [number, number, number] = [
    speed * Math.cos(angle2) * Math.cos(angle1),
    speed * Math.sin(angle2) * (0.5 + Math.random() * 0.5), // Favoriser les composantes verticales
    speed * Math.cos(angle2) * Math.sin(angle1)
  ];
  
  // Position d'entrée plus variée avec des approches diagonales
  const entryAngle = Math.random() * Math.PI * 2;
  const entryDistance = 1.5 + Math.random() * 1.5; // Distance d'entrée variable
  const entryHeight = (Math.random() - 0.5) * 2; // Hauteur d'entrée plus variable
  
  const position: [number, number, number] = [
    entryDistance * Math.cos(entryAngle),
    entryHeight,
    entryDistance * Math.sin(entryAngle)
  ];
  
  // Direction plus complexe avec des approches variées
  const targetVariation = 0.3; // Variation de la cible pour des trajectoires moins prévisibles
  const target: [number, number, number] = [
    (Math.random() - 0.5) * targetVariation,
    (Math.random() - 0.5) * targetVariation,
    (Math.random() - 0.5) * targetVariation
  ];
  
  const direction: [number, number, number] = [
    target[0] - position[0],
    target[1] - position[1],
    target[2] - position[2]
  ];
  const length = Math.sqrt(direction[0]**2 + direction[1]**2 + direction[2]**2);
  direction[0] /= length;
  direction[1] /= length;
  direction[2] /= length;
  
  // Couleur selon le type
  const colors = {
    asteroid: '#FF6B35',
    comet: '#4ECDC4', 
    debris: '#F39C12'
  };
  
  return {
    id: `random-${Date.now()}`,
    name: `Météorite ${type} #${Math.floor(Math.random() * 1000)}`,
    type,
    mass,
    diameter,
    velocity,
    position,
    direction,
    color: colors[type],
    trail: [],
    isActive: true,
    discoveryDate: new Date().toISOString().split('T')[0],
    description: `Météorite ${type} générée aléatoirement avec une masse de ${mass.toExponential(2)} kg.`
  };
};