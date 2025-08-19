import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { TextureLoader } from 'three';
import { Line } from '@react-three/drei';
import { CelestialBody } from '@/types/astronomy';
import { calculateMoonPosition, calculatePlanetPosition, calculateDisplayRadius } from '@/utils/orbitalCalculations';
import { PlanetLabel } from './PlanetLabel';

// Import des textures haute qualité depuis public pour les lunes principales
const moonTexture = '/2k_moon.jpg';
const ioTexture = '/src/assets/textures/io.jpg'; // Pas de version 2k disponible
const europaTexture = '/src/assets/textures/europa.jpg'; // Pas de version 2k disponible
const mimasTexture = '/src/assets/textures/mimas.jpg'; // Pas de version 2k disponible
const enceladusTexture = '/src/assets/textures/enceladus.jpg'; // Pas de version 2k disponible
const tritonTexture = '/src/assets/textures/triton.jpg'; // Pas de version 2k disponible

interface MoonProps {
  body: CelestialBody;
  parentBody: CelestialBody;
  currentDate: Date;
  timeScale: number;
  showOrbit: boolean;
  showLabel?: boolean;
  cameraDistance?: number;
}

export const Moon: React.FC<MoonProps> = ({ 
  body, 
  parentBody,
  currentDate, 
  timeScale, 
  showOrbit,
  showLabel = false,
  cameraDistance = 1000
}) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  
  // Charger la texture appropriée selon la lune
  const getTextureForMoon = () => {
    switch (body.id) {
      case 'moon': return moonTexture;
      case 'io': return ioTexture;
      case 'europa': return europaTexture;
      case 'mimas': return mimasTexture;
      case 'enceladus': return enceladusTexture;
      case 'triton': return tritonTexture;
      default: return null;
    }
  };
  
  const textureUrl = getTextureForMoon();
  const texture = textureUrl ? useLoader(TextureLoader, textureUrl) : null;
  
    // Calculate positions based on current date
  const moonRadius = calculateDisplayRadius(body);
  const moonOrbitRadius = body.distance * 0.03; // Échelle cohérente avec les nouvelles constantes
  
  useFrame((state, delta) => {
    if (groupRef.current && meshRef.current) {
      // Calculer la position actuelle de la lune basée sur la simulation
      const simulationTime = new Date(currentDate.getTime() + (state.clock.elapsedTime * timeScale * 24 * 60 * 60 * 1000));
      const currentPosition = calculateMoonPosition(body, parentBody, simulationTime);
      
      // Mettre à jour la position du groupe
      groupRef.current.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);
      
      // Rotation de la lune (généralement synchrone avec l'orbite)
      const rotationSpeed = (delta * timeScale) / Math.abs(body.rotationPeriod);
      if (body.rotationPeriod < 0) {
        // Rotation rétrograde (Triton)
        meshRef.current.rotation.y -= rotationSpeed * 2;
      } else {
        meshRef.current.rotation.y += rotationSpeed * 2;
      }
    }
  });

  // Generate moon orbit points with realistic 3D inclination relative to parent planet
  const orbitPoints = [];
  
  // Utiliser les vraies données d'inclinaison orbitale amplifiées modérément pour visibilité
  const moonInclination = (body.inclination || 0) * Math.PI / 180 * 1.2; // Facteur 1.2 pour visibilité des lunes
  const longitudeOfAscendingNode = (body.longitudeOfAscendingNode || 0) * Math.PI / 180;
  
  for (let i = 0; i <= 64; i++) { // Plus de points pour des orbites lisses
    const angle = (i / 64) * Math.PI * 2;
    
    // Position dans le plan orbital local de la lune
    const x = Math.cos(angle) * moonOrbitRadius;
    const y = Math.sin(angle) * moonOrbitRadius;
    const z = 0;
    
    // Appliquer les transformations 3D pour inclinaison réelle de la lune
    // Étape 1: Rotation autour de l'axe X (inclinaison par rapport à l'équateur de la planète parent)
    const x1 = x;
    const y1 = y * Math.cos(moonInclination) - z * Math.sin(moonInclination);
    const z1 = y * Math.sin(moonInclination) + z * Math.cos(moonInclination);
    
    // Étape 2: Rotation autour de l'axe Z (longitude du nœud ascendant)
    const x_final = x1 * Math.cos(longitudeOfAscendingNode) - y1 * Math.sin(longitudeOfAscendingNode);
    const y_final = x1 * Math.sin(longitudeOfAscendingNode) + y1 * Math.cos(longitudeOfAscendingNode);
    const z_final = z1;
    
    orbitPoints.push([x_final, y_final, z_final]);
  }

  // Get moon-specific material properties
  const getMoonMaterial = () => {
    switch (body.id) {
      case 'moon':
        return { 
          color: body.color, 
          roughness: 0.95, 
          metalness: 0.0 
        };
      case 'io':
        return { 
          color: body.color, 
          roughness: 0.4, 
          metalness: 0.1,
          emissive: '#221100',
          emissiveIntensity: 0.1 
        };
      case 'europa':
        return { 
          color: body.color, 
          roughness: 0.1, 
          metalness: 0.9 
        };
      case 'enceladus':
        return {
          color: body.color,
          roughness: 0.05,
          metalness: 0.95 // Very reflective ice surface
        };
      case 'triton':
        return {
          color: body.color,
          roughness: 0.8,
          metalness: 0.0
        };
      default:
        return { 
          color: body.color, 
          roughness: 0.8, 
          metalness: 0.0 
        };
    }
  };

  const materialProps = getMoonMaterial();
  
  return (
    <group>
      {/* Moon orbit line centered around parent planet */}
      {showOrbit && (
        <Line
          points={orbitPoints}
          color="#888888"
          opacity={0.2}
          transparent
        />
      )}
      
      {/* Moon positioned along its orbit around parent */}
      <group ref={groupRef}>
        <mesh 
          ref={meshRef}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[moonRadius, 16, 16]} />
          {texture ? (
            <meshStandardMaterial 
              map={texture}
              roughness={materialProps.roughness}
              metalness={materialProps.metalness}
              color={materialProps.color}
            />
          ) : (
            <meshStandardMaterial {...materialProps} />
          )}
        </mesh>

        {/* Special effect for Europa (ice surface) */}
        {body.id === 'europa' && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[moonRadius * 1.02, 12, 12]} />
            <meshBasicMaterial 
              color="#B0E0E6"
              transparent 
              opacity={0.3}
            />
          </mesh>
        )}
      </group>
      
      {/* Moon Label - suit la lune */}
      {showLabel && (
        <PlanetLabel
          body={body}
          position={[0, 0, 0]}
          visible={true}
          cameraDistance={cameraDistance}
        />
      )}
    </group>
  );
};