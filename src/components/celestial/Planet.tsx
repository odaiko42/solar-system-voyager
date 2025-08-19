import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { TextureLoader } from 'three';
import { Line } from '@react-three/drei';
import { CelestialBody } from '@/types/astronomy';
import { calculatePlanetPosition, calculateDisplayRadius } from '@/utils/orbitalCalculations';
import { PlanetLabel } from './PlanetLabel';

// Import des textures haute qualité depuis public
const mercuryTexture = '/2k_mercury.jpg';
const venusTexture = '/2k_venus_surface.jpg'; // Ou '/2k_venus_atmosphere.jpg' pour l'atmosphère
const earthTexture = '/2k_earth_daymap.jpg';
const marsTexture = '/2k_mars.jpg';
const jupiterTexture = '/2k_jupiter.jpg';
const saturnTexture = '/2k_saturn.jpg';
const uranusTexture = '/2k_uranus.jpg';
const neptuneTexture = '/2k_neptune.jpg';

interface PlanetProps {
  body: CelestialBody;
  currentDate: Date;
  timeScale: number;
  showOrbit: boolean;
  showLabel?: boolean;
  cameraDistance?: number;
}

export const Planet: React.FC<PlanetProps> = ({ 
  body, 
  currentDate, 
  timeScale, 
  showOrbit,
  showLabel = false,
  cameraDistance = 30
}) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  
  // Charger la texture appropriée selon la planète
  const getTextureForPlanet = () => {
    switch (body.id) {
      case 'mercury': return mercuryTexture;
      case 'venus': return venusTexture;
      case 'earth': return earthTexture;
      case 'mars': return marsTexture;
      case 'jupiter': return jupiterTexture;
      case 'saturn': return saturnTexture;
      case 'uranus': return uranusTexture;
      case 'neptune': return neptuneTexture;
      default: return null;
    }
  };
  
  const textureUrl = getTextureForPlanet();
  const texture = textureUrl ? useLoader(TextureLoader, textureUrl) : null;
  
  const planetRadius = calculateDisplayRadius(body);
  const orbitRadius = body.distance * 15; // Distance orbitale cohérente avec calculatePlanetPosition

  useFrame((state, delta) => {
    if (groupRef.current && meshRef.current) {
      // Calculer la position actuelle basée sur la simulation
      const simulationTime = new Date(currentDate.getTime() + (state.clock.elapsedTime * timeScale * 24 * 60 * 60 * 1000));
      const currentPosition = calculatePlanetPosition(body, simulationTime);
      
      // Mettre à jour la position du groupe
      groupRef.current.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);
      
      // Rotation de la planète sur son axe
      const rotationSpeed = (delta * timeScale) / Math.abs(body.rotationPeriod);
      if (body.rotationPeriod < 0) {
        // Rotation rétrograde (Vénus, Uranus)
        meshRef.current.rotation.y -= rotationSpeed * 2;
      } else {
        meshRef.current.rotation.y += rotationSpeed * 2;
      }
      
      // Appliquer l'inclinaison axiale (obliquité)
      if (body.axialTilt !== undefined) {
        const axialTiltRad = (body.axialTilt * Math.PI) / 180;
        meshRef.current.rotation.z = axialTiltRad;
      }
    }
  });

  // Generate orbit line points with realistic 3D inclination (not on same plane)
  const orbitPoints = [];
  
  // Utiliser les vraies données d'inclinaison orbitale amplifiées modérément pour visibilité
  const inclination = (body.inclination || 0) * Math.PI / 180 * 1.5; // Facteur 1.5 pour visibilité
  const longitudeOfAscendingNode = (body.longitudeOfAscendingNode || 0) * Math.PI / 180;
  
  for (let i = 0; i <= 256; i++) { // Plus de points pour des orbites ultra-lisses
    const angle = (i / 256) * Math.PI * 2;
    
    // Position dans le plan orbital initial (écliptique de référence)
    const x = Math.cos(angle) * orbitRadius;
    const y = Math.sin(angle) * orbitRadius;
    const z = 0;
    
    // Appliquer les transformations 3D pour inclinaison réelle
    // Étape 1: Rotation autour de l'axe X (inclinaison orbitale par rapport à l'écliptique)
    const x1 = x;
    const y1 = y * Math.cos(inclination) - z * Math.sin(inclination);
    const z1 = y * Math.sin(inclination) + z * Math.cos(inclination);
    
    // Étape 2: Rotation autour de l'axe Z (longitude du nœud ascendant)
    const x_final = x1 * Math.cos(longitudeOfAscendingNode) - y1 * Math.sin(longitudeOfAscendingNode);
    const y_final = x1 * Math.sin(longitudeOfAscendingNode) + y1 * Math.cos(longitudeOfAscendingNode);
    const z_final = z1;
    
    orbitPoints.push([x_final, y_final, z_final]);
  }

  // Get planet-specific material properties
  const getPlanetMaterial = () => {
    const baseProps = {
      color: body.color,
      roughness: 0.7,
      metalness: 0.1
    };

    // Special materials for different planets
    switch (body.id) {
      case 'earth':
        return { ...baseProps, roughness: 0.4, metalness: 0.2 };
      case 'mars':
        return { ...baseProps, roughness: 0.9, metalness: 0.05 };
      case 'jupiter':
      case 'saturn':
        return { ...baseProps, roughness: 0.3, metalness: 0.0 };
      case 'venus':
        return { ...baseProps, roughness: 0.1, metalness: 0.8 };
      default:
        return baseProps;
    }
  };

  const materialProps = getPlanetMaterial();

  return (
    <group>
      {/* Orbit line with proper 3D positioning - centered at origin (Sun) */}
      {showOrbit && (
        <Line
          points={orbitPoints}
          color="#ffffff"
          opacity={0.3}
          transparent
        />
      )}
      
      {/* Planet positioned along its orbit */}
      <group ref={groupRef}>
        <mesh 
          ref={meshRef} 
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[planetRadius, 32, 32]} />
          {texture ? (
            <meshStandardMaterial 
              map={texture}
              roughness={materialProps.roughness}
              metalness={materialProps.metalness}
              color={materialProps.color}
            />
          ) : (
            <meshStandardMaterial 
              color={body.color}
              roughness={materialProps.roughness}
              metalness={materialProps.metalness}
            />
          )}
        </mesh>

        {/* Atmosphere effect for Earth and Venus */}
        {(body.id === 'earth' || body.id === 'venus') && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[planetRadius * 1.05, 16, 16]} />
            <meshBasicMaterial 
              color={body.id === 'earth' ? '#87CEEB' : '#FFC649'}
              transparent 
              opacity={0.1}
            />
          </mesh>
        )}

        {/* Anneaux de Saturne avec texture haute qualité */}
        {body.id === 'saturn' && (
          <SaturnRings planetRadius={planetRadius} />
        )}

        {/* Planet Label - intégré dans le groupe de la planète */}
        {showLabel && (
          <PlanetLabel
            body={body}
            position={[0, 0, 0]} // Position relative au groupe de la planète
            visible={true}
            cameraDistance={cameraDistance}
          />
        )}
      </group>
    </group>
  );
};

// Composant séparé pour les anneaux de Saturne
const SaturnRings: React.FC<{ planetRadius: number }> = ({ planetRadius }) => {
  const ringTexture = useLoader(TextureLoader, '/2k_saturn_ring_alpha.png');
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planetRadius * 1.2, planetRadius * 2.2, 64]} />
      <meshBasicMaterial 
        map={ringTexture}
        transparent 
        opacity={0.8}
        side={2} // DoubleSide
      />
    </mesh>
  );
};