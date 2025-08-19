import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Html } from '@react-three/drei';

interface AndromedaGalaxyProps {
  cameraDistance: number;
  visible?: boolean;
}

export const AndromedaGalaxy: React.FC<AndromedaGalaxyProps> = ({ 
  cameraDistance, 
  visible = true 
}) => {
  const groupRef = useRef<Group>(null);
  const centralBulgeRef = useRef<Mesh>(null);
  
  // Distance d'Andromède: 2,5 millions d'années-lumière depuis la Voie Lactée
  const andromedaDistance = 2500000 * 12.6; // Conversion AL vers unités
  
  // Ne montrer Andromède qu'à très grande distance
  const shouldShowAndromeda = cameraDistance > 50000000 && visible;
  
  // Rotation lente d'Andromède (plus rapide que la Voie Lactée car elle se rapproche)
  useFrame((state, delta) => {
    if (groupRef.current && shouldShowAndromeda) {
      groupRef.current.rotation.z += delta * 0.00003; // Rotation légèrement plus rapide
      
      // Animation subtile d'approche (très lente)
      const time = state.clock.elapsedTime;
      groupRef.current.position.x = Math.cos(time * 0.00001) * 50000 + andromedaDistance * 0.6;
      groupRef.current.position.z = Math.sin(time * 0.00001) * 30000 + andromedaDistance * 0.3;
    }
  });

  // Structure des bras spiraux d'Andromède
  const andromedaStructure = useMemo(() => {
    const arms = [];
    const galaxyRadius = 70000; // Andromède est plus grande que la Voie Lactée
    
    // Génération des bras spiraux (plus serrés qu'Andromède)
    for (let arm = 0; arm < 2; arm++) { // Andromède a 2 bras principaux
      const armAngle = (arm * Math.PI);
      const armPoints = [];
      
      for (let r = 2000; r < galaxyRadius; r += 3000) {
        const spiralAngle = armAngle + (r / galaxyRadius) * Math.PI * 3;
        const x = Math.cos(spiralAngle) * r * 15; // Plus étalée
        const z = Math.sin(spiralAngle) * r * 15;
        const y = (Math.random() - 0.5) * r * 0.015; // Légèrement plus fine
        
        armPoints.push([x, y, z]);
      }
      arms.push(armPoints);
    }
    
    return { arms };
  }, []);

  if (!shouldShowAndromeda) return null;

  return (
    <group ref={groupRef} position={[andromedaDistance * 0.6, 200000, andromedaDistance * 0.3]}>
      {/* Bulbe central d'Andromède (plus massif que la Voie Lactée) */}
      <mesh ref={centralBulgeRef} position={[0, 0, 0]}>
        <sphereGeometry args={[80000, 32, 32]} />
        <meshBasicMaterial
          color="#9370DB"
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
      
      {/* Trou noir supermassif central (plus massif que Sgr A*) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4000, 16, 16]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Disque de poussière d'Andromède */}
      <mesh rotation={[-Math.PI / 2.2, 0, Math.PI / 4]}>
        <cylinderGeometry args={[1000000, 1000000, 6000, 64, 1, true]} />
        <meshBasicMaterial
          color="#4B0082"
          transparent
          opacity={0.08}
        />
      </mesh>
      
      {/* Bras spiraux avec étoiles d'Andromède */}
      {andromedaStructure.arms.map((arm, armIndex) => (
        <group key={`andromeda-arm-${armIndex}`}>
          {arm.map((point, pointIndex) => {
            if (pointIndex % 15 !== 0) return null; // Échantillonnage pour performance
            
            const [x, y, z] = point;
            const starSize = 300 + Math.random() * 1000;
            const starColor = Math.random() > 0.6 ? '#9370DB' : 
                             Math.random() > 0.4 ? '#DA70D6' : '#E6E6FA';
            
            return (
              <mesh key={pointIndex} position={[x, y, z]}>
                <sphereGeometry args={[starSize, 8, 8]} />
                <meshBasicMaterial
                  color={starColor}
                  transparent
                  opacity={0.6}
                  toneMapped={false}
                />
              </mesh>
            );
          })}
        </group>
      ))}
      
      {/* Halo d'étoiles externes */}
      <mesh>
        <sphereGeometry args={[1200000, 32, 32]} />
        <meshBasicMaterial
          color="#DDA0DD"
          transparent
          opacity={0.02}
          toneMapped={false}
        />
      </mesh>
      
      {/* Informations sur Andromède */}
      <Html
        position={[0, 150000, 0]}
        center
        distanceFactor={8000000}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-white text-base bg-black/90 px-4 py-3 rounded-lg backdrop-blur-sm border border-purple-400/60 max-w-sm">
          <div className="font-bold text-purple-300 text-lg mb-2 flex items-center gap-2">
            🌀 Galaxie d'Andromède (M31)
          </div>
          <div className="text-sm space-y-1">
            <div>• Galaxie spirale géante</div>
            <div>• ~1 billion d'étoiles</div>
            <div>• Diamètre: ~220 000 AL</div>
            <div>• Distance: 2,5 millions AL</div>
            <div>• Se rapproche à 110 km/s</div>
            <div>• Collision prévue: ~4,5 Ga</div>
          </div>
        </div>
      </Html>
      
      {/* Galaxies satellites d'Andromède */}
      {cameraDistance > 80000000 && (
        <>
          {/* M32 */}
          <group position={[200000, 50000, 150000]}>
            <mesh>
              <sphereGeometry args={[15000, 12, 12]} />
              <meshBasicMaterial
                color="#8A2BE2"
                transparent
                opacity={0.4}
                toneMapped={false}
              />
            </mesh>
            <Html
              position={[0, 25000, 0]}
              center
              distanceFactor={3000000}
              style={{ pointerEvents: 'none' }}
            >
              <div className="text-purple-200 text-xs bg-black/70 px-2 py-1 rounded">
                M32 (satellite)
              </div>
            </Html>
          </group>
          
          {/* M110 */}
          <group position={[-180000, -30000, -200000]}>
            <mesh>
              <sphereGeometry args={[20000, 12, 12]} />
              <meshBasicMaterial
                color="#9932CC"
                transparent
                opacity={0.3}
                toneMapped={false}
              />
            </mesh>
            <Html
              position={[0, 30000, 0]}
              center
              distanceFactor={3000000}
              style={{ pointerEvents: 'none' }}
            >
              <div className="text-purple-200 text-xs bg-black/70 px-2 py-1 rounded">
                M110 (satellite)
              </div>
            </Html>
          </group>
        </>
      )}
    </group>
  );
};