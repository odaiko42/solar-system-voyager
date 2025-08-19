import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Vector3 } from 'three';
import { Line } from '@react-three/drei';
import { Meteorite as MeteoriteType } from '@/types/astronomy';

interface MeteoriteProps {
  meteorite: MeteoriteType;
  currentDate: Date;
  timeScale: number;
  showTrail: boolean;
}

export const Meteorite: React.FC<MeteoriteProps> = ({ 
  meteorite, 
  currentDate, 
  timeScale,
  showTrail 
}) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  
  // Calculer la taille visuelle basée sur la masse/diamètre
  const visualSize = useMemo(() => {
    // Taille minimale pour la visibilité, maximum pour les gros objets
    return Math.max(0.02, Math.min(0.5, meteorite.diameter * 20));
  }, [meteorite.diameter]);
  
  // Calculer la position actuelle basée sur la vitesse et le temps
  const calculateCurrentPosition = (date: Date): [number, number, number] => {
    const startDate = new Date(meteorite.discoveryDate || date);
    const timeDiff = (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24); // jours
    
    // Convertir la vitesse de km/s en AU/jour
    const kmPerAU = 149597870.7; // km
    const secondsPerDay = 86400;
    const velocityAUPerDay: [number, number, number] = [
      (meteorite.velocity[0] * secondsPerDay) / kmPerAU,
      (meteorite.velocity[1] * secondsPerDay) / kmPerAU,
      (meteorite.velocity[2] * secondsPerDay) / kmPerAU
    ];
    
    // Position = position initiale + vitesse * temps (trajectoire linéaire simplifiée)
    const x = meteorite.position[0] + velocityAUPerDay[0] * timeDiff;
    const y = meteorite.position[1] + velocityAUPerDay[1] * timeDiff;
    const z = meteorite.position[2] + velocityAUPerDay[2] * timeDiff;
    
    return [x, y, z];
  };
  
  const currentPosition = calculateCurrentPosition(currentDate);
  
  useFrame((state, delta) => {
    if (groupRef.current && meshRef.current && meteorite.isActive) {
      // Mettre à jour la position avec le temps qui passe
      const newDate = new Date(currentDate.getTime() + (delta * timeScale * 24 * 60 * 60 * 1000));
      const newPosition = calculateCurrentPosition(newDate);
      
      // Facteur d'échelle pour la visualisation (même que les planètes)
      const scaledPosition: [number, number, number] = [
        newPosition[0] * 10,
        newPosition[1] * 10,
        newPosition[2] * 10
      ];
      
      groupRef.current.position.set(...scaledPosition);
      
      // Rotation de la météorite
      meshRef.current.rotation.x += delta * 2;
      meshRef.current.rotation.y += delta * 1.5;
    }
  });
  
  // Propriétés du matériau selon le type
  const getMeteoriteMaterial = () => {
    const baseProps = {
      color: meteorite.color,
      emissive: meteorite.color,
      emissiveIntensity: 0.2,
      roughness: 0.7,
      metalness: 0.3
    };
    
    switch (meteorite.type) {
      case 'comet':
        return { 
          ...baseProps, 
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.9
        };
      case 'debris':
        return { 
          ...baseProps, 
          emissiveIntensity: 0.6,
          roughness: 0.3
        };
      case 'artificial':
        return { 
          ...baseProps, 
          metalness: 0.8,
          emissiveIntensity: 0.3,
          color: '#9B59B6'
        };
      default:
        return baseProps;
    }
  };
  
  const materialProps = getMeteoriteMaterial();
  
  // Générer les points de trajectoire simplifiés
  const trajectoryPoints = useMemo(() => {
    const points: [number, number, number][] = [];
    const currentTime = new Date(currentDate);
    
    // Générer 40 points de trajectoire (passé et futur)
    for (let i = -20; i <= 20; i++) {
      const time = new Date(currentTime.getTime() + i * 12 * 60 * 60 * 1000); // ±20 * 12h = ±10 jours
      const pos = calculateCurrentPosition(time);
      
      // Échelle visuelle directe sans courbure complexe
      points.push([
        pos[0] * 10, 
        pos[1] * 10, 
        pos[2] * 10
      ]);
    }
    
    return points;
  }, [meteorite, currentDate]);
  
  return (
    <group ref={groupRef}>
      {/* Trajectoire de la météorite */}
      {showTrail && trajectoryPoints.length > 0 && (
        <Line
          points={trajectoryPoints}
          color={meteorite.color}
          lineWidth={3}
          transparent
          opacity={0.8}
          dashed={true}
          dashSize={0.2}
          gapSize={0.1}
        />
      )}
      
      {/* Corps de la météorite */}
      <mesh ref={meshRef} castShadow>
        {meteorite.type === 'comet' ? (
          <coneGeometry args={[visualSize, visualSize * 2, 8]} />
        ) : (
          <sphereGeometry args={[visualSize, 12, 12]} />
        )}
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Halo lumineux pour les gros objets */}
      {meteorite.mass > 1000000 && (
        <mesh>
          <sphereGeometry args={[visualSize * 1.5, 16, 16]} />
          <meshBasicMaterial 
            color={meteorite.color}
            transparent 
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};