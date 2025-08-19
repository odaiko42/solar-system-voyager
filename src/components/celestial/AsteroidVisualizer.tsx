import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { Line } from '@react-three/drei';
import { Asteroid } from '@/types/astronomy';
import { calculateAsteroidPosition, generateAsteroidTrajectory } from '@/utils/orbitalCalculations';

interface AsteroidVisualizerProps {
  asteroid: Asteroid;
  currentDate: Date;
  timeScale: number;
}

export const AsteroidVisualizer: React.FC<AsteroidVisualizerProps> = ({ 
  asteroid, 
  currentDate, 
  timeScale 
}) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  
  // Calculate current position based on the simulation date
  const currentPosition = useMemo(() => 
    calculateAsteroidPosition(asteroid, currentDate), 
    [asteroid, currentDate]
  );
  
  // Generate trajectory centered on current date
  const trajectoryPoints = useMemo(() => 
    generateAsteroidTrajectory(asteroid, currentDate), 
    [asteroid, currentDate]
  );
  
  const asteroidRadius = Math.max(0.02, asteroid.diameter * 0.001);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 2;
      meshRef.current.rotation.x += delta * 0.5;
    }

    if (groupRef.current && timeScale > 0) {
      // Update position based on time progression
      const newDate = new Date(currentDate.getTime() + (delta * timeScale * 24 * 60 * 60 * 1000));
      const newPosition = calculateAsteroidPosition(asteroid, newDate);
      
      // Smooth interpolation to new position
      groupRef.current.position.lerp({ x: newPosition[0], y: newPosition[1], z: newPosition[2] } as any, 0.1);
    } else if (groupRef.current) {
      // Set exact position when paused
      groupRef.current.position.set(...currentPosition);
    }
  });

  // Get asteroid material based on type
  const getAsteroidMaterial = () => {
    const baseProps = {
      roughness: 0.95,
      metalness: 0.05
    };

    switch (asteroid.type) {
      case 'Near-Earth':
        return { 
          ...baseProps, 
          color: '#8B4513',
          emissive: '#331100',
          emissiveIntensity: 0.05 
        };
      case 'Main Belt':
        return { 
          ...baseProps, 
          color: '#696969',
          metalness: 0.1 
        };
      default:
        return { 
          ...baseProps, 
          color: '#A0522D' 
        };
    }
  };

  const materialProps = getAsteroidMaterial();

  return (
    <group>
      {/* Asteroid trajectory */}
      <Line
        points={trajectoryPoints}
        color="#FF6B6B"
        lineWidth={2}
        dashed
      />
      
      {/* Current position marker on trajectory */}
      <mesh position={currentPosition}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial 
          color="#00FF00" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Asteroid body with realistic material */}
      <group ref={groupRef} position={currentPosition}>
        <mesh 
          ref={meshRef} 
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[asteroidRadius, 0]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {/* Asteroid identification glow */}
        <mesh>
          <sphereGeometry args={[asteroidRadius * 2, 8, 8]} />
          <meshBasicMaterial 
            color="#FF6B6B" 
            transparent 
            opacity={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};