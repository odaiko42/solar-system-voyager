import { CelestialBody, Asteroid } from '@/types/astronomy';

// Vraies distances astronomiques et données orbitales précises
export const solarSystemBodies: CelestialBody[] = [
  {
    id: 'sun',
    name: 'Soleil',
    type: 'star',
    radius: 696340, // km
    distance: 0,
    color: '#FDB813',
    rotationPeriod: 25.38,
    orbitalPeriod: 0,
    position: [0, 0, 0]
  },
  {
    id: 'mercury',
    name: 'Mercure',
    type: 'planet',
    radius: 2439.7, // km
    distance: 0.387098, // UA - vraie distance moyenne
    color: '#8C7853',
    rotationPeriod: 58.6,
    orbitalPeriod: 87.97, // jours - vraie période
    parent: 'sun',
    inclination: 7.005, // degrés - vraie inclinaison orbitale
    longitudeOfAscendingNode: 48.331, // degrés
    axialTilt: 0.034, // degrés - obliquité
    eccentricity: 0.2056, // Orbite la plus excentrique des planètes
    perihelion: 0.3075, // UA - périhélie proche du Soleil
    aphelion: 0.4667 // UA - forte variation orbitale
  },
  {
    id: 'venus',
    name: 'Vénus',
    type: 'planet',
    radius: 6051.8, // km
    distance: 0.723332, // UA - vraie distance moyenne
    color: '#FFC649',
    rotationPeriod: -243.018, // jours - rotation rétrograde
    orbitalPeriod: 224.70, // jours - vraie période
    parent: 'sun',
    inclination: 3.395, // degrés - vraie inclinaison orbitale
    longitudeOfAscendingNode: 76.680, // degrés
    axialTilt: 177.36, // degrés - obliquité (quasi retournée)
    eccentricity: 0.0067, // Orbite très circulaire
    perihelion: 0.7184, // UA - faible variation
    aphelion: 0.7282 // UA - orbite stable
  },
  {
    id: 'earth',
    name: 'Terre',
    type: 'planet',
    radius: 6371, // km
    distance: 1.0, // UA - définition de l'UA
    color: '#6B93D6',
    rotationPeriod: 0.99726968, // jours sidéraux
    orbitalPeriod: 365.256363004, // jours - année sidérale
    parent: 'sun',
    inclination: 0.00005, // degrés - référence pour l'écliptique
    longitudeOfAscendingNode: -11.26064, // degrés
    axialTilt: 23.4392811, // degrés - obliquité (responsable des saisons)
    eccentricity: 0.0167, // Orbite quasi-circulaire
    perihelion: 0.9833, // UA - périhélie en janvier
    aphelion: 1.0167 // UA - aphélie en juillet
  },
  {
    id: 'moon',
    name: 'Lune',
    type: 'moon',
    radius: 1737.4, // km
    distance: 384400, // km - vraie distance moyenne
    color: '#C8C8C8',
    rotationPeriod: 27.321661, // jours - vraie période
    orbitalPeriod: 27.321661, // jours - synchrone
    parent: 'earth',
    inclination: 5.145, // degrés par rapport à l'écliptique
    longitudeOfAscendingNode: 125.08 // degrés
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    radius: 3389.5, // km
    distance: 1.523679, // UA - vraie distance moyenne
    color: '#CD5C5C',
    rotationPeriod: 1.025957, // jours - vraie période
    orbitalPeriod: 686.971, // jours - vraie période
    parent: 'sun',
    inclination: 1.850, // degrés - vraie inclinaison orbitale
    longitudeOfAscendingNode: 49.558, // degrés
    axialTilt: 25.19, // degrés - obliquité (similaire à la Terre)
    eccentricity: 0.0934, // Orbite modérément excentrique
    perihelion: 1.382, // UA - périhélie proche
    aphelion: 1.666 // UA - variation orbitale notable
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    radius: 69911, // km
    distance: 5.204267, // UA - vraie distance moyenne
    color: '#D8CA9D',
    rotationPeriod: 0.41354, // jours - vraie période
    orbitalPeriod: 4332.59, // jours - vraie période
    parent: 'sun',
    inclination: 1.303, // degrés - vraie inclinaison orbitale
    longitudeOfAscendingNode: 100.464, // degrés
    axialTilt: 3.13, // degrés - obliquité faible
    eccentricity: 0.049, // Excentricité modérée
    perihelion: 4.950, // UA (740 millions de km)
    aphelion: 5.458 // UA (816 millions de km)
  },
  {
    id: 'io',
    name: 'Io',
    type: 'moon',
    radius: 1821.6, // km
    distance: 421800, // km - vraie distance de Jupiter
    color: '#FFFF99',
    rotationPeriod: 1.769138, // jours - vraie période
    orbitalPeriod: 1.769138, // jours - synchrone
    parent: 'jupiter',
    inclination: 0.036, // degrés par rapport à l'équateur de Jupiter
    longitudeOfAscendingNode: 43.977 // degrés
  },
  {
    id: 'europa',
    name: 'Europe',
    type: 'moon',
    radius: 1560.8, // km
    distance: 671034, // km - vraie distance de Jupiter
    color: '#87CEEB',
    rotationPeriod: 3.551181, // jours - vraie période
    orbitalPeriod: 3.551181, // jours - synchrone
    parent: 'jupiter',
    inclination: 0.466, // degrés par rapport à l'équateur de Jupiter
    longitudeOfAscendingNode: 219.106 // degrés
  },
  {
    id: 'ganymede',
    name: 'Ganymède',
    type: 'moon',
    radius: 2634.1, // km - plus grosse lune du système solaire
    distance: 1070412, // km - vraie distance de Jupiter
    color: '#A0A0A0',
    rotationPeriod: 7.15455296, // jours - vraie période
    orbitalPeriod: 7.15455296, // jours - synchrone
    parent: 'jupiter',
    inclination: 0.177, // degrés par rapport à l'équateur de Jupiter
    longitudeOfAscendingNode: 63.552 // degrés
  },
  {
    id: 'callisto',
    name: 'Callisto',
    type: 'moon',
    radius: 2410.3, // km
    distance: 1882709, // km - vraie distance de Jupiter
    color: '#666666',
    rotationPeriod: 16.6890184, // jours - vraie période
    orbitalPeriod: 16.6890184, // jours - synchrone
    parent: 'jupiter',
    inclination: 0.192, // degrés par rapport à l'équateur de Jupiter
    longitudeOfAscendingNode: 298.848 // degrés
  },
  {
    id: 'saturn',
    name: 'Saturne',
    type: 'planet',
    radius: 58232, // km (équatorial)
    distance: 9.5826, // UA - vraie distance moyenne
    color: '#FAD5A5',
    rotationPeriod: 0.44401, // jours - vraie période
    orbitalPeriod: 10759.22, // jours - vraie période
    parent: 'sun',
    inclination: 2.485, // degrés - vraie inclinaison orbitale
    longitudeOfAscendingNode: 113.665, // degrés
    axialTilt: 26.73, // degrés - obliquité marquée (anneaux inclinés)
    eccentricity: 0.0565, // Excentricité relativement faible
    perihelion: 9.024, // UA - écart d'apside relativement faible
    aphelion: 10.086 // UA - mouvement stable sur le long terme
  },
  {
    id: 'mimas',
    name: 'Mimas',
    type: 'moon',
    radius: 198.2, // km
    distance: 185539, // km - vraie distance de Saturne
    color: '#C0C0C0',
    rotationPeriod: 0.942422, // jours - vraie période
    orbitalPeriod: 0.942422, // jours - synchrone
    parent: 'saturn',
    inclination: 1.574, // degrés par rapport à l'équateur de Saturne
    longitudeOfAscendingNode: 139.771 // degrés
  },
  {
    id: 'enceladus',
    name: 'Encelade',
    type: 'moon',
    radius: 252.1, // km
    distance: 238020, // km - vraie distance de Saturne
    color: '#F0F0F0',
    rotationPeriod: 1.370218, // jours - vraie période
    orbitalPeriod: 1.370218, // jours - synchrone
    parent: 'saturn',
    inclination: 0.009, // degrés par rapport à l'équateur de Saturne
    longitudeOfAscendingNode: 169.508 // degrés
  },
  {
    id: 'titan',
    name: 'Titan',
    type: 'moon',
    radius: 2574.0, // km - plus grosse lune de Saturne
    distance: 1221830, // km - vraie distance de Saturne
    color: '#FFA500',
    rotationPeriod: 15.945421, // jours - vraie période
    orbitalPeriod: 15.945421, // jours - synchrone
    parent: 'saturn',
    inclination: 0.306, // degrés par rapport à l'équateur de Saturne
    longitudeOfAscendingNode: 28.057 // degrés
  },
  {
    id: 'iapetus',
    name: 'Japet',
    type: 'moon',
    radius: 734.5, // km
    distance: 3561300, // km - vraie distance de Saturne
    color: '#8B7355',
    rotationPeriod: 79.3215, // jours - vraie période
    orbitalPeriod: 79.3215, // jours - synchrone
    parent: 'saturn',
    inclination: 15.47, // degrés par rapport à l'équateur de Saturne
    longitudeOfAscendingNode: 139.204 // degrés
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    radius: 25362, // km (équatorial)
    distance: 19.2184, // UA - vraie distance moyenne
    color: '#4FD0E7',
    rotationPeriod: -0.71833, // jours - rotation rétrograde
    orbitalPeriod: 30688.5, // jours - vraie période
    parent: 'sun',
    inclination: 0.773, // degrés - vraie inclinaison orbitale
    longitudeOfAscendingNode: 74.006, // degrés
    axialTilt: 97.77, // degrés - obliquité extrême (rotation "sur le côté")
    eccentricity: 0.0457, // Écart d'apside relativement faible
    perihelion: 18.324, // UA - mouvement stable
    aphelion: 20.078 // UA - précession lente des apsides
  },
  {
    id: 'miranda',
    name: 'Miranda',
    type: 'moon',
    radius: 235.8, // km
    distance: 129390, // km - vraie distance d'Uranus
    color: '#B0B0B0',
    rotationPeriod: 1.413479, // jours - vraie période
    orbitalPeriod: 1.413479, // jours - synchrone
    parent: 'uranus',
    inclination: 4.232, // degrés par rapport à l'équateur d'Uranus
    longitudeOfAscendingNode: 326.438 // degrés
  },
  {
    id: 'ariel',
    name: 'Ariel',
    type: 'moon',
    radius: 578.9, // km
    distance: 191020, // km - vraie distance d'Uranus
    color: '#D3D3D3',
    rotationPeriod: 2.520379, // jours - vraie période
    orbitalPeriod: 2.520379, // jours - synchrone
    parent: 'uranus',
    inclination: 0.260, // degrés par rapport à l'équateur d'Uranus
    longitudeOfAscendingNode: 22.394 // degrés
  },
  {
    id: 'umbriel',
    name: 'Umbriel',
    type: 'moon',
    radius: 584.7, // km
    distance: 266300, // km - vraie distance d'Uranus
    color: '#808080',
    rotationPeriod: 4.144177, // jours - vraie période
    orbitalPeriod: 4.144177, // jours - synchrone
    parent: 'uranus',
    inclination: 0.128, // degrés par rapport à l'équateur d'Uranus
    longitudeOfAscendingNode: 33.485 // degrés
  },
  {
    id: 'titania',
    name: 'Titania',
    type: 'moon',
    radius: 788.4, // km - plus grosse lune d'Uranus
    distance: 435910, // km - vraie distance d'Uranus
    color: '#A9A9A9',
    rotationPeriod: 8.705872, // jours - vraie période
    orbitalPeriod: 8.705872, // jours - synchrone
    parent: 'uranus',
    inclination: 0.340, // degrés par rapport à l'équateur d'Uranus
    longitudeOfAscendingNode: 99.771 // degrés
  },
  {
    id: 'oberon',
    name: 'Obéron',
    type: 'moon',
    radius: 761.4, // km
    distance: 583520, // km - vraie distance d'Uranus
    color: '#969696',
    rotationPeriod: 13.463234, // jours - vraie période
    orbitalPeriod: 13.463234, // jours - synchrone
    parent: 'uranus',
    inclination: 0.058, // degrés par rapport à l'équateur d'Uranus
    longitudeOfAscendingNode: 279.771 // degrés
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    radius: 24622, // km (équatorial)
    distance: 30.07, // UA - vraie distance moyenne
    color: '#4169E1',
    rotationPeriod: 0.6713, // jours - vraie période
    orbitalPeriod: 60190.03, // jours - vraie période
    parent: 'sun',
    inclination: 1.767, // degrés - vraie inclinaison orbitale
    longitudeOfAscendingNode: 131.784, // degrés
    axialTilt: 28.32, // degrés - obliquité modérée
    eccentricity: 0.0113, // Écart d'apside très faible
    perihelion: 29.81, // UA - orbite quasi-circulaire
    aphelion: 30.33 // UA - mouvement très stable
  },
  {
    id: 'triton',
    name: 'Triton',
    type: 'moon',
    radius: 1353.4, // km - plus grosse lune de Neptune
    distance: 354759, // km - vraie distance de Neptune
    color: '#FFB6C1',
    rotationPeriod: -5.876854, // jours - orbite rétrograde
    orbitalPeriod: -5.876854, // jours - synchrone rétrograde
    parent: 'neptune',
    inclination: 156.885, // degrés - orbite très inclinée et rétrograde
    longitudeOfAscendingNode: 197.19 // degrés
  },
  {
    id: 'nereid',
    name: 'Néréide',
    type: 'moon',
    radius: 170.0, // km
    distance: 5513818, // km - vraie distance de Neptune (très excentrique)
    color: '#C0C0C0',
    rotationPeriod: 360.1362, // jours - vraie période
    orbitalPeriod: 360.1362, // jours - orbite très excentrique
    parent: 'neptune',
    inclination: 7.23, // degrés par rapport à l'équateur de Neptune
    longitudeOfAscendingNode: 334.762 // degrés
  }
];

// Ceinture d'astéroïdes - objets principaux entre Mars et Jupiter
export const asteroidBelt: CelestialBody[] = [
  {
    id: 'ceres-asteroid',
    name: 'Cérès',
    type: 'asteroid',
    radius: 473, // km
    distance: 2.766, // UA - distance moyenne
    color: '#C4B5A0',
    rotationPeriod: 0.378, // jours
    orbitalPeriod: 1681.6, // jours
    parent: 'sun',
    inclination: 10.59, // degrés
    eccentricity: 0.0756,
    texture: '/2k_ceres_fictional.jpg'
  },
  {
    id: 'vesta-asteroid',
    name: 'Vesta',
    type: 'asteroid',
    radius: 262.7, // km
    distance: 2.361, // UA - distance moyenne
    color: '#E6DDD4',
    rotationPeriod: 0.2226, // jours
    orbitalPeriod: 1325.4, // jours
    parent: 'sun',
    inclination: 7.14, // degrés
    eccentricity: 0.0887
  },
  {
    id: 'pallas-asteroid',
    name: 'Pallas',
    type: 'asteroid',
    radius: 256, // km
    distance: 2.772, // UA - distance moyenne
    color: '#B8B8B8',
    rotationPeriod: 0.325, // jours
    orbitalPeriod: 1686.9, // jours
    parent: 'sun',
    inclination: 34.83, // degrés - très inclinée
    eccentricity: 0.2313
  },
  {
    id: 'hygiea-asteroid',
    name: 'Hygiea',
    type: 'asteroid',
    radius: 217, // km
    distance: 3.139, // UA - distance moyenne
    color: '#696969',
    rotationPeriod: 1.151, // jours
    orbitalPeriod: 2029.2, // jours
    parent: 'sun',
    inclination: 3.84, // degrés
    eccentricity: 0.117
  }
];

// Ceinture de Kuiper - objets transneptuniens
export const kuiperBelt: CelestialBody[] = [
  {
    id: 'pluto',
    name: 'Pluton',
    type: 'dwarf_planet',
    radius: 1188.3, // km
    distance: 39.482, // UA - distance moyenne
    color: '#DEB887',
    rotationPeriod: -6.387230, // jours - rotation rétrograde
    orbitalPeriod: 90560, // jours (248 ans)
    parent: 'sun',
    inclination: 17.16, // degrés - ligne d'apsides inclinée et mobile
    eccentricity: 0.2488, // Excentricité extrême - régime chaotique
    axialTilt: 122.53, // degrés
    perihelion: 29.7, // UA (4.4 milliards de km) - peut être plus proche que Neptune
    aphelion: 49.3, // UA (7.3 milliards de km) - variation extrême
    texture: '/2k_pluto_fictional.jpg'
  },
  {
    id: 'charon',
    name: 'Charon',
    type: 'moon',
    radius: 606, // km
    distance: 19591, // km - distance de Pluton
    color: '#A0A0A0',
    rotationPeriod: 6.387230, // jours - synchrone avec Pluton
    orbitalPeriod: 6.387230, // jours
    parent: 'pluto',
    inclination: 0.08, // degrés
    eccentricity: 0.0002
  },
  {
    id: 'quaoar',
    name: 'Quaoar',
    type: 'dwarf_planet',
    radius: 555, // km
    distance: 43.405, // UA - distance moyenne
    color: '#8B4513',
    rotationPeriod: 0.73, // jours
    orbitalPeriod: 103765, // jours (284 ans)
    parent: 'sun',
    inclination: 8.00, // degrés
    eccentricity: 0.039
  },
  {
    id: 'sedna',
    name: 'Sedna',
    type: 'dwarf_planet',
    radius: 497, // km
    distance: 518.57, // UA - distance moyenne (très elliptique)
    color: '#CD853F',
    rotationPeriod: 0.43, // jours
    orbitalPeriod: 4155840, // jours (11400 ans)
    parent: 'sun',
    inclination: 11.93, // degrés
    eccentricity: 0.854, // Orbite hautement excentrique - témoin fossile
    perihelion: 76, // UA - périhélie extrême
    aphelion: 937 // UA - aphélie dans le nuage de Oort interne
  },
  {
    id: 'orcus',
    name: 'Orcus',
    type: 'dwarf_planet',
    radius: 458.5, // km
    distance: 39.419, // UA - distance moyenne
    color: '#708090',
    rotationPeriod: 0.458, // jours
    orbitalPeriod: 90465, // jours (248 ans)
    parent: 'sun',
    inclination: 20.57, // degrés
    eccentricity: 0.226
  }
];

export const famousAsteroids: Asteroid[] = [
  {
    id: 'apophis',
    name: '99942 Apophis',
    discoveryDate: '2004-06-19',
    diameter: 0.34,
    type: 'Near-Earth',
    orbitalPeriod: 0.89,
    perihelion: 0.746,
    aphelion: 1.099,
    inclination: 3.33,
    description: 'Astéroïde géocroiseur découvert en 2004. Il passera très près de la Terre en 2029.',
    trajectory: [],
    isActive: false
  },
  {
    id: 'bennu',
    name: '101955 Bennu',
    discoveryDate: '1999-09-11',
    diameter: 0.49,
    type: 'Near-Earth',
    orbitalPeriod: 1.20,
    perihelion: 0.897,
    aphelion: 1.356,
    inclination: 6.03,
    description: 'Cible de la mission OSIRIS-REx de la NASA. Échantillons retournés sur Terre en 2023.',
    trajectory: [],
    isActive: false
  },
  {
    id: 'vesta',
    name: '4 Vesta',
    discoveryDate: '1807-03-29',
    diameter: 525,
    type: 'Main Belt',
    orbitalPeriod: 3.63,
    perihelion: 2.15,
    aphelion: 2.57,
    inclination: 7.14,
    description: 'Le deuxième plus grand astéroïde de la ceinture principale. Visité par la sonde Dawn.',
    trajectory: [],
    isActive: false
  },
  {
    id: 'ceres',
    name: '1 Ceres',
    discoveryDate: '1801-01-01',
    diameter: 939,
    type: 'Main Belt',
    orbitalPeriod: 4.61,
    perihelion: 2.56,
    aphelion: 2.98,
    inclination: 10.59,
    description: 'La plus grande planète naine de la ceinture d\'astéroïdes. Étudiée par la mission Dawn.',
    trajectory: [],
    isActive: false
  },
  {
    id: 'eros',
    name: '433 Eros',
    discoveryDate: '1898-08-13',
    diameter: 16.84,
    type: 'Near-Earth',
    orbitalPeriod: 1.76,
    perihelion: 1.13,
    aphelion: 1.78,
    inclination: 10.83,
    description: 'Premier astéroïde sur lequel un vaisseau spatial a atterri (NEAR Shoemaker, 2001).',
    trajectory: [],
    isActive: false
  },
  {
    id: 'itokawa',
    name: '25143 Itokawa',
    discoveryDate: '1998-09-26',
    diameter: 0.33,
    type: 'Near-Earth',
    orbitalPeriod: 1.52,
    perihelion: 0.95,
    aphelion: 1.70,
    inclination: 1.62,
    description: 'Cible de la mission Hayabusa du Japon. Premier retour d\'échantillons d\'astéroïde.',
    trajectory: [],
    isActive: false
  }
];

// Planètes naines avec textures haute qualité disponibles
export const dwarfPlanets: CelestialBody[] = [
  {
    id: 'ceres',
    name: 'Cérès',
    type: 'dwarf_planet',
    parent: 'sun',
    radius: 473, // km
    distance: 2.766, // UA - dans la ceinture d'astéroïdes
    orbitalPeriod: 1681.6, // jours
    rotationPeriod: 0.378, // jours (9.07 heures)
    eccentricity: 0.0756,
    inclination: 10.59, // degrés
    axialTilt: 4, // degrés
    color: '#C4B5A0',
    texture: '/2k_ceres_fictional.jpg',
    perihelion: 2.556, // UA
    aphelion: 2.976 // UA
  },
  {
    id: 'eris',
    name: 'Éris',
    type: 'dwarf_planet',
    parent: 'sun',
    radius: 1163, // km
    distance: 67.78, // UA - distance moyenne
    orbitalPeriod: 203830, // jours (558 ans)
    rotationPeriod: 1.08, // jours (25.9 heures)
    eccentricity: 0.44, // Excentricité extrême
    inclination: 44.04, // degrés - très inclinée
    axialTilt: 0, // degrés (inconnu)
    color: '#E6E6FA',
    texture: '/2k_eris_fictional.jpg',
    perihelion: 38.2, // UA - périhélie dans la ceinture de Kuiper
    aphelion: 97.6 // UA - aphélie supérieur à 500 UA pour certains objets
  },
  {
    id: 'haumea',
    name: 'Hauméa',
    type: 'dwarf_planet',
    parent: 'sun',
    radius: 816, // km (rayon équatorial moyen)
    distance: 43.34, // UA - distance moyenne
    orbitalPeriod: 103468, // jours (283 ans)
    rotationPeriod: 0.163, // jours (3.9 heures) - rotation très rapide
    eccentricity: 0.189,
    inclination: 28.19, // degrés
    axialTilt: 0, // degrés (inconnu)
    color: '#D3D3D3',
    texture: '/2k_haumea_fictional.jpg',
    perihelion: 35.16, // UA
    aphelion: 51.52 // UA
  },
  {
    id: 'makemake',
    name: 'Makémaké',
    type: 'dwarf_planet',
    parent: 'sun',
    radius: 715, // km
    distance: 45.79, // UA - distance moyenne
    orbitalPeriod: 112897, // jours (309 ans)
    rotationPeriod: 0.95, // jours (22.8 heures)
    eccentricity: 0.159,
    inclination: 28.96, // degrés
    axialTilt: 0, // degrés (inconnu)
    color: '#8B4513',
    texture: '/2k_makemake_fictional.jpg',
    perihelion: 38.51, // UA
    aphelion: 53.07 // UA
  }
];

// Mapping du Soleil
export const sunMap = {
  id: 'sun',
  name: 'Soleil',
  type: 'star',
  texture: '/2k_sun.jpg',
  radius: 696340, // km
  mass: 1.989e30, // kg
  temperature: 5778, // K (température de surface)
  luminosity: 3.828e26, // watts
  spectralClass: 'G2V',
  age: 4.6e9, // années
  rotationPeriod: 25.38, // jours (équateur)
  axialTilt: 7.25, // degrés
  magneticFieldStrength: 1, // gauss (pôles)
  description: 'Étoile naine jaune au centre du système solaire, source de toute énergie et lumière',
  intensitySettings: {
    minimum: 0.5,
    maximum: 8.0,
    default: 4.0,
    realistic: 2.5, // Intensité pour un éclairage réaliste
    dramatic: 6.0   // Intensité pour un effet dramatique
  }
};

// Mapping des planètes avec leurs propriétés principales
export const planetsMap = new Map([
  ['mercury', {
    name: 'Mercure',
    order: 1,
    moons: [],
    type: 'rocky',
    hasRings: false,
    description: 'Planète la plus proche du Soleil, sans atmosphère significative'
  }],
  ['venus', {
    name: 'Vénus',
    order: 2,
    moons: [],
    type: 'rocky',
    hasRings: false,
    description: 'Planète la plus chaude du système solaire avec une atmosphère dense'
  }],
  ['earth', {
    name: 'Terre',
    order: 3,
    moons: ['moon'],
    type: 'rocky',
    hasRings: false,
    description: 'Seule planète connue abritant la vie'
  }],
  ['mars', {
    name: 'Mars',
    order: 4,
    moons: ['phobos', 'deimos'], // Lunes non implémentées dans le modèle actuel
    type: 'rocky',
    hasRings: false,
    description: 'Planète rouge avec des calottes polaires et d\'anciennes preuves d\'eau'
  }],
  ['jupiter', {
    name: 'Jupiter',
    order: 5,
    moons: ['io', 'europa', 'ganymede', 'callisto'],
    type: 'gas_giant',
    hasRings: true,
    description: 'Plus grande planète du système solaire avec plus de 80 lunes'
  }],
  ['saturn', {
    name: 'Saturne',
    order: 6,
    moons: ['mimas', 'enceladus', 'titan', 'iapetus'],
    type: 'gas_giant',
    hasRings: true,
    description: 'Planète aux anneaux spectaculaires avec plus de 80 lunes'
  }],
  ['uranus', {
    name: 'Uranus',
    order: 7,
    moons: ['miranda', 'ariel', 'umbriel', 'titania', 'oberon'],
    type: 'ice_giant',
    hasRings: true,
    description: 'Planète qui tourne sur le côté avec des anneaux verticaux'
  }],
  ['neptune', {
    name: 'Neptune',
    order: 8,
    moons: ['triton', 'nereid'],
    type: 'ice_giant',
    hasRings: true,
    description: 'Planète la plus éloignée avec les vents les plus rapides du système solaire'
  }]
]);

// Mapping des lunes avec leurs propriétés
export const moonsMap = new Map([
  // Lunes de la Terre
  ['moon', {
    name: 'Lune',
    parent: 'earth',
    type: 'rocky',
    notable: true,
    description: 'Seule lune naturelle de la Terre, responsable des marées'
  }],
  
  // Lunes de Jupiter (lunes galiléennes)
  ['io', {
    name: 'Io',
    parent: 'jupiter',
    type: 'volcanic',
    notable: true,
    description: 'Lune la plus volcanique du système solaire'
  }],
  ['europa', {
    name: 'Europe',
    parent: 'jupiter',
    type: 'icy',
    notable: true,
    description: 'Océan souterrain sous une croûte de glace, candidat à la vie'
  }],
  ['ganymede', {
    name: 'Ganymède',
    parent: 'jupiter',
    type: 'icy_rocky',
    notable: true,
    description: 'Plus grande lune du système solaire, plus grosse que Mercure'
  }],
  ['callisto', {
    name: 'Callisto',
    parent: 'jupiter',
    type: 'icy_rocky',
    notable: true,
    description: 'Lune la plus cratérisée du système solaire'
  }],
  
  // Lunes de Saturne
  ['mimas', {
    name: 'Mimas',
    parent: 'saturn',
    type: 'icy',
    notable: false,
    description: 'Ressemble à l\'Étoile de la Mort avec son grand cratère Herschel'
  }],
  ['enceladus', {
    name: 'Encelade',
    parent: 'saturn',
    type: 'icy',
    notable: true,
    description: 'Geysers de glace au pôle sud, océan souterrain'
  }],
  ['titan', {
    name: 'Titan',
    parent: 'saturn',
    type: 'atmospheric',
    notable: true,
    description: 'Atmosphère dense, lacs de méthane, plus grosse lune de Saturne'
  }],
  ['iapetus', {
    name: 'Japet',
    parent: 'saturn',
    type: 'icy_rocky',
    notable: false,
    description: 'Lune bicolore avec une crête équatoriale mystérieuse'
  }],
  
  // Lunes d'Uranus
  ['miranda', {
    name: 'Miranda',
    parent: 'uranus',
    type: 'icy_rocky',
    notable: false,
    description: 'Terrain chaotique suggérant une reformation après destruction'
  }],
  ['ariel', {
    name: 'Ariel',
    parent: 'uranus',
    type: 'icy_rocky',
    notable: false,
    description: 'Surface relativement jeune avec des vallées et des failles'
  }],
  ['umbriel', {
    name: 'Umbriel',
    parent: 'uranus',
    type: 'icy_rocky',
    notable: false,
    description: 'Lune la plus sombre d\'Uranus'
  }],
  ['titania', {
    name: 'Titania',
    parent: 'uranus',
    type: 'icy_rocky',
    notable: false,
    description: 'Plus grande lune d\'Uranus avec des canyons profonds'
  }],
  ['oberon', {
    name: 'Obéron',
    parent: 'uranus',
    type: 'icy_rocky',
    notable: false,
    description: 'Lune extérieure d\'Uranus avec de nombreux cratères'
  }],
  
  // Lunes de Neptune
  ['triton', {
    name: 'Triton',
    parent: 'neptune',
    type: 'icy',
    notable: true,
    description: 'Orbite rétrograde, probablement un ancien objet de Kuiper capturé'
  }],
  ['nereid', {
    name: 'Néréide',
    parent: 'neptune',
    type: 'rocky',
    notable: false,
    description: 'Orbite très excentrique et inclinée'
  }]
]);

// Mapping des ceintures d'astéroïdes
export const asteroidBeltMap = new Map([
  ['ceres-asteroid', {
    name: 'Cérès',
    order: 1,
    type: 'dwarf_planet',
    location: 'Ceinture d\'astéroïdes',
    description: 'Plus grand objet de la ceinture d\'astéroïdes, reclassé comme planète naine'
  }],
  ['vesta-asteroid', {
    name: 'Vesta',
    order: 2,
    type: 'asteroid',
    location: 'Ceinture d\'astéroïdes',
    description: 'Deuxième plus grand astéroïde, surface basaltique'
  }],
  ['pallas-asteroid', {
    name: 'Pallas',
    order: 3,
    type: 'asteroid',
    location: 'Ceinture d\'astéroïdes',
    description: 'Troisième plus grand astéroïde, orbite très inclinée'
  }],
  ['hygiea-asteroid', {
    name: 'Hygiea',
    order: 4,
    type: 'asteroid',
    location: 'Ceinture d\'astéroïdes',
    description: 'Quatrième plus grand astéroïde, forme quasi-sphérique'
  }]
]);

// Mapping de la ceinture de Kuiper
export const kuiperBeltMap = new Map([
  ['pluto', {
    name: 'Pluton',
    order: 1,
    type: 'dwarf_planet',
    location: 'Ceinture de Kuiper',
    moons: ['charon'],
    description: 'Ancienne neuvième planète, système binaire avec Charon'
  }],
  ['charon', {
    name: 'Charon',
    parent: 'pluto',
    type: 'moon',
    location: 'Ceinture de Kuiper',
    description: 'Plus grande lune de Pluton, système de marée mutuelle'
  }],
  ['quaoar', {
    name: 'Quaoar',
    order: 2,
    type: 'dwarf_planet',
    location: 'Ceinture de Kuiper',
    description: 'Objet transneptunien avec un anneau surprenant'
  }],
  ['sedna', {
    name: 'Sedna',
    order: 3,
    type: 'dwarf_planet',
    location: 'Nuage d\'Oort interne',
    description: 'Objet le plus éloigné observé, orbite extrêmement elliptique'
  }],
  ['orcus', {
    name: 'Orcus',
    order: 4,
    type: 'dwarf_planet',
    location: 'Ceinture de Kuiper',
    description: 'Anti-Pluton, orbite similaire mais en opposition de phase'
  }]
]);

// Mapping des planètes naines
export const dwarfPlanetsMap = new Map([
  ['ceres', {
    name: 'Cérès',
    order: 9, // Après Neptune
    location: 'Ceinture d\'astéroïdes',
    type: 'dwarf_planet',
    description: 'Plus grand objet de la ceinture d\'astéroïdes, contient de l\'eau sous forme de glace'
  }],
  ['eris', {
    name: 'Éris',
    order: 10,
    location: 'Ceinture de Kuiper',
    type: 'dwarf_planet',
    description: 'Planète naine la plus massive, responsable de la redéfinition de Pluton'
  }],
  ['haumea', {
    name: 'Hauméa',
    order: 11,
    location: 'Ceinture de Kuiper',
    type: 'dwarf_planet',
    description: 'Planète naine de forme ellipsoïdale avec rotation très rapide et deux lunes'
  }],
  ['makemake', {
    name: 'Makémaké',
    order: 12,
    location: 'Ceinture de Kuiper',
    type: 'dwarf_planet',
    description: 'Planète naine sans atmosphère significative, surface rougeâtre'
  }]
]);

// Fonction pour obtenir les objets de la ceinture d'astéroïdes
export const getAsteroidBeltObjects = (): CelestialBody[] => {
  return asteroidBelt.sort((a, b) => {
    const orderA = asteroidBeltMap.get(a.id)?.order || 0;
    const orderB = asteroidBeltMap.get(b.id)?.order || 0;
    return orderA - orderB;
  });
};

// Fonction pour obtenir les objets de la ceinture de Kuiper
export const getKuiperBeltObjects = (): CelestialBody[] => {
  return kuiperBelt
    .filter(obj => obj.type !== 'moon') // Exclure les lunes pour le tri principal
    .sort((a, b) => {
      const orderA = kuiperBeltMap.get(a.id)?.order || 0;
      const orderB = kuiperBeltMap.get(b.id)?.order || 0;
      return orderA - orderB;
    });
};

// Fonction pour obtenir toutes les planètes triées par ordre
export const getPlanetsOrdered = (): CelestialBody[] => {
  return solarSystemBodies
    .filter(body => body.type === 'planet' && body.parent === 'sun')
    .sort((a, b) => {
      const orderA = planetsMap.get(a.id)?.order || 0;
      const orderB = planetsMap.get(b.id)?.order || 0;
      return orderA - orderB;
    });
};

// Fonction pour obtenir toutes les planètes naines triées par ordre
export const getDwarfPlanetsOrdered = (): CelestialBody[] => {
  return dwarfPlanets.sort((a, b) => {
    const orderA = dwarfPlanetsMap.get(a.id)?.order || 0;
    const orderB = dwarfPlanetsMap.get(b.id)?.order || 0;
    return orderA - orderB;
  });
};

// Fonction pour obtenir les lunes d'une planète
export const getMoonsOfPlanet = (planetId: string): CelestialBody[] => {
  const planetInfo = planetsMap.get(planetId);
  if (!planetInfo) return [];
  
  return solarSystemBodies
    .filter(body => body.type === 'moon' && body.parent === planetId)
    .sort((a, b) => a.distance - b.distance); // Tri par distance à la planète
};

// Fonction pour obtenir les informations d'un corps céleste
export const getCelestialBodyInfo = (bodyId: string) => {
  // Chercher dans les corps principaux du système solaire
  const body = solarSystemBodies.find(b => b.id === bodyId);
  if (body) {
    if (body.type === 'planet') {
      return {
        ...body,
        info: planetsMap.get(bodyId),
        moons: getMoonsOfPlanet(bodyId)
      };
    } else if (body.type === 'moon') {
      return {
        ...body,
        info: moonsMap.get(bodyId)
      };
    }
    return body;
  }
  
  // Chercher dans les planètes naines
  const dwarfPlanet = dwarfPlanets.find(d => d.id === bodyId);
  if (dwarfPlanet) {
    return {
      ...dwarfPlanet,
      info: dwarfPlanetsMap.get(bodyId)
    };
  }
  
  return null;
};

// Fonction pour analyser les apsides du système solaire
export const getApsidesAnalysis = () => {
  const planets = solarSystemBodies.filter(b => b.type === 'planet' && b.parent === 'sun');
  const transneptunianObjects = kuiperBelt.filter(b => b.type === 'dwarf_planet');
  
  const analysis = {
    innerPlanets: planets.filter(p => ['mercury', 'venus', 'earth', 'mars'].includes(p.id)).map(p => ({
      name: p.name,
      perihelion: p.perihelion,
      aphelion: p.aphelion,
      eccentricity: p.eccentricity,
      variation: p.perihelion && p.aphelion ? 
        ((p.aphelion - p.perihelion) / p.perihelion * 100).toFixed(1) + '%' : 'N/A'
    })),
    
    outerPlanets: planets.filter(p => ['jupiter', 'saturn', 'uranus', 'neptune'].includes(p.id)).map(p => ({
      name: p.name,
      perihelion: p.perihelion,
      aphelion: p.aphelion,
      eccentricity: p.eccentricity,
      variation: p.perihelion && p.aphelion ? 
        ((p.aphelion - p.perihelion) / p.perihelion * 100).toFixed(1) + '%' : 'N/A',
      resonances: p.id === 'jupiter' ? 'Influence dominante sur l\'architecture du système' :
                  p.id === 'saturn' ? 'Résonances avec Jupiter, précession des anneaux' :
                  p.id === 'uranus' ? 'Précession lente des apsides' :
                  'Mouvement stable, orbite quasi-circulaire'
    })),
    
    transneptunianObjects: transneptunianObjects.map(obj => ({
      name: obj.name,
      perihelion: obj.perihelion,
      aphelion: obj.aphelion,
      eccentricity: obj.eccentricity,
      variation: obj.perihelion && obj.aphelion ? 
        ((obj.aphelion - obj.perihelion) / obj.perihelion * 100).toFixed(1) + '%' : 'N/A',
      isCloserThanNeptune: obj.perihelion ? obj.perihelion < 30.07 : false,
      regime: obj.id === 'pluto' ? 'Chaotique, ligne d\'apsides mobile' :
              obj.id === 'sedna' ? 'Témoin fossile, perturbations passées' :
              'Excentrique, frontières du système solaire'
    })),
    
    extremeObjects: {
      mostEccentric: transneptunianObjects.reduce((max, obj) => 
        (obj.eccentricity || 0) > (max.eccentricity || 0) ? obj : max
      ),
      farthestAphelion: transneptunianObjects.reduce((max, obj) => 
        (obj.aphelion || 0) > (max.aphelion || 0) ? obj : max
      ),
      closestPerihelion: transneptunianObjects.reduce((min, obj) => 
        (obj.perihelion || Infinity) < (min.perihelion || Infinity) ? obj : min
      )
    },
    
    systemBoundaries: {
      innerSystemLimit: 'Ceinture d\'astéroïdes (2.2 - 3.2 UA)',
      outerPlanetsRegion: 'Jupiter à Neptune (5.2 - 30.1 UA)',
      kuiperBeltRegion: 'Ceinture de Kuiper (30 - 50 UA)',
      scatteredDiskRegion: 'Disque dispersé (30 - 100 UA)',
      oortCloudInner: 'Nuage de Oort interne (> 500 UA)',
      oortCloudOuter: 'Nuage de Oort externe (> 50 000 UA)'
    },
    
    gravitationalEffects: {
      jupiterDominance: 'Jupiter influence l\'architecture du système solaire',
      resonances: 'Résonances gravitationnelles modifient lentement les apsides',
      precession: 'Précession des lignes d\'apsides détectable spectroscopiquement',
      chaosRegime: 'Objets transneptuniens en régime chaotique',
      relativistic: 'Effets relativistes sur les trajectoires extrêmes',
      galacticTides: 'Marées galactiques affectent les objets du nuage de Oort'
    }
  };
  
  return analysis;
};

// Fonction pour obtenir les statistiques du système solaire
export const getSolarSystemStats = () => {
  const planets = solarSystemBodies.filter(b => b.type === 'planet' && b.parent === 'sun');
  const moons = solarSystemBodies.filter(b => b.type === 'moon');
  const asteroids = asteroidBelt.filter(b => b.type === 'asteroid');
  const kuiperObjects = kuiperBelt.filter(b => b.type === 'dwarf_planet');
  
  return {
    // Corps célestes
    totalPlanets: planets.length,
    totalMoons: moons.length,
    totalDwarfPlanets: dwarfPlanets.length + kuiperObjects.length,
    totalAsteroids: asteroids.length,
    totalKuiperObjects: kuiperBelt.length,
    
    // Classification des planètes
    rockyPlanets: planets.filter(p => ['mercury', 'venus', 'earth', 'mars'].includes(p.id)).length,
    gasGiants: planets.filter(p => ['jupiter', 'saturn'].includes(p.id)).length,
    iceGiants: planets.filter(p => ['uranus', 'neptune'].includes(p.id)).length,
    
    // Ceintures
    asteroidBeltObjects: asteroidBelt.length,
    kuiperBeltObjects: kuiperBelt.length,
    
    // Caractéristiques
    planetsWithRings: Array.from(planetsMap.values()).filter(p => p.hasRings).length,
    notableMoons: Array.from(moonsMap.values()).filter(m => m.notable).length,
    
    // Textures et assets
    totalBodiesWithTextures: planets.length + dwarfPlanets.length + kuiperObjects.length + asteroids.length + Array.from(moonsMap.keys()).length + 1, // +1 pour le Soleil
    
    // Données du Soleil
    sunData: {
      texture: sunMap.texture,
      temperature: sunMap.temperature,
      luminosity: sunMap.luminosity,
      age: sunMap.age,
      spectralClass: sunMap.spectralClass,
      intensityRange: {
        min: sunMap.intensitySettings.minimum,
        max: sunMap.intensitySettings.maximum,
        default: sunMap.intensitySettings.default
      }
    },
    
    // Statistiques des ceintures
    belts: {
      asteroidBelt: {
        location: 'Entre Mars et Jupiter (2.2 - 3.2 UA)',
        totalObjects: asteroidBelt.length,
        largestObject: 'Cérès',
        composition: 'Roches et métaux'
      },
      kuiperBelt: {
        location: 'Au-delà de Neptune (30 - 50 UA)',
        totalObjects: kuiperBelt.length,
        largestObject: 'Pluton',
        composition: 'Glaces et roches'
      }
    }
  };
};