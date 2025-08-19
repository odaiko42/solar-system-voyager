import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { TextureLoader } from 'three';
import { Line } from '@react-three/drei';
import { CelestialBody } from '@/types/astronomy';
import { calculatePlanetPosition, calculateDisplayRadius } from '@/utils/orbitalCalculations';

// Import des textures haute qualité pour les planètes naines
const ceresTexture = '/2k_ceres_fictional.jpg';
const erisTexture = '/2k_eris_fictional.jpg';
const haumeaTexture = '/2k_haumea_fictional.jpg';
const makemakeTexture = '/2k_makemake_fictional.jpg';

interface DwarfPlanetProps {
  body: CelestialBody;
  currentDate: Date;
  timeScale: number;
  showOrbit?: boolean;
}

export const DwarfPlanet: React.FC<DwarfPlanetProps> = ({ 
  body, 
  currentDate, 
  timeScale, 
  showOrbit 
}) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  
  // Charger la texture appropriée selon la planète naine
  const getTextureForDwarfPlanet = () => {
    switch (body.id) {
      case 'ceres': return ceresTexture;
      case 'eris': return erisTexture;
      case 'haumea': return haumeaTexture;
      case 'makemake': return makemakeTexture;
      default: return null;
    }
  };
  
  const textureUrl = getTextureForDwarfPlanet();
  const texture = textureUrl ? useLoader(TextureLoader, textureUrl) : null;
  
  const dwarfPlanetRadius = calculateDisplayRadius(body);
  const orbitRadius = body.distance * 15; // Distance orbitale cohérente avec les planètes

  useFrame((state, delta) => {
    if (groupRef.current && meshRef.current) {
      // Animation de rotation propre
      const rotationSpeed = (2 * Math.PI) / (body.rotationPeriod * 24 * 60 * 60); // rad/s
      const scaledRotationSpeed = rotationSpeed * delta * timeScale * 100; // Accéléré pour visibilité
      
      // Appliquer l'inclinaison axiale
      const axialTiltRad = (body.axialTilt || 0) * Math.PI / 180;
      meshRef.current.rotation.x = axialTiltRad;
      meshRef.current.rotation.y += scaledRotationSpeed;
      
      // Position orbitale basée sur la date actuelle
      const position = calculatePlanetPosition(body, currentDate);
      groupRef.current.position.set(position[0], position[1], position[2]);
    }
  });

  // Générer les points d'orbite pour l'affichage
  const orbitPoints: [number, number, number][] = [];
  const segments = 128;
  const eccentricity = body.eccentricity || 0;
  const inclination = (body.inclination || 0) * Math.PI / 180;
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    
    // Orbite elliptique
    const r = orbitRadius * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
    const x = r * Math.cos(angle);
    const y = 0;
    const z = r * Math.sin(angle);
    
    // Appliquer l'inclinaison orbitale
    const x_final = x;
    const y_final = y * Math.cos(inclination) - z * Math.sin(inclination);
    const z_final = y * Math.sin(inclination) + z * Math.cos(inclination);
    
    orbitPoints.push([x_final, y_final, z_final]);
  }

  // Propriétés matérielles spécifiques aux planètes naines
  const getDwarfPlanetMaterial = () => {
    const baseProps = {
      color: body.color,
      roughness: 0.8,
      metalness: 0.1
    };

    switch (body.id) {
      case 'ceres':
        return { ...baseProps, roughness: 0.9, metalness: 0.05 }; // Surface poussiéreuse
      case 'eris':
        return { ...baseProps, roughness: 0.2, metalness: 0.7 }; // Surface glacée réfléchissante
      case 'haumea':
        return { ...baseProps, roughness: 0.3, metalness: 0.6 }; // Surface cristalline
      case 'makemake':
        return { ...baseProps, roughness: 0.7, metalness: 0.2 }; // Surface rougeâtre
      default:
        return baseProps;
    }
  };

  const materialProps = getDwarfPlanetMaterial();

  return (
    <group>
      {/* Orbit line with proper 3D positioning */}
      {showOrbit && (
        <Line
          points={orbitPoints}
          color="#888888"
          opacity={0.2}
          transparent
        />
      )}
      
      {/* Planète naine positionnée le long de son orbite */}
      <group ref={groupRef}>
        <mesh 
          ref={meshRef} 
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[dwarfPlanetRadius, 16, 16]} />
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

        {/* Effet spécial pour Hauméa (forme ellipsoïdale) */}
        {body.id === 'haumea' && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[dwarfPlanetRadius * 1.5, 16, 8]} />
            <meshBasicMaterial 
              color="#D3D3D3"
              transparent 
              opacity={0.1}
              wireframe
            />
          </mesh>
        )}

        {/* Halo subtil pour Éris (planète naine la plus massive) */}
        {body.id === 'eris' && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[dwarfPlanetRadius * 1.1, 12, 12]} />
            <meshBasicMaterial 
              color="#E6E6FA"
              transparent 
              opacity={0.1}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
