import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Html, Sparkles } from '@react-three/drei';

interface MilkyWayGalaxyProps {
  cameraDistance: number;
}

export const MilkyWayGalaxy: React.FC<MilkyWayGalaxyProps> = ({ cameraDistance }) => {
  const groupRef = useRef<Group>(null);
  const spiralArmsRef = useRef<Group>(null);
  const centralBulgeRef = useRef<Mesh>(null);
  const dustLanesRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  
  // Ne montrer la galaxie que quand on zoom très loin (échelle galactique)
  const shouldShowGalaxy = cameraDistance > 10000000; // ~160 AL
  
  // Rotation différentielle réaliste de la galaxie
  useFrame((state, delta) => {
    if (groupRef.current && shouldShowGalaxy) {
      const time = state.clock.elapsedTime;
      
      // Rotation principale de la galaxie
      groupRef.current.rotation.z += delta * 0.00001;
      
      // Rotation différentielle du bulbe central (plus rapide)
      if (centralBulgeRef.current) {
        centralBulgeRef.current.rotation.z += delta * 0.00003;
        // Pulsation subtile du cœur galactique
        const scale = 1.0 + Math.sin(time * 0.5) * 0.05;
        centralBulgeRef.current.scale.setScalar(scale);
      }
      
      // Animation des bras spiraux (rotation plus lente)
      if (spiralArmsRef.current) {
        spiralArmsRef.current.rotation.z -= delta * 0.000005;
      }
      
      // Animation des poussières galactiques
      if (dustLanesRef.current) {
        dustLanesRef.current.rotation.z += delta * 0.000008;
        // Opacité variable pour effet de mouvement
        const opacity = 0.15 + Math.sin(time * 0.3) * 0.05;
        if (dustLanesRef.current.material) {
          (dustLanesRef.current.material as any).opacity = opacity;
        }
      }
      
      // Animation du halo galactique
      if (haloRef.current) {
        haloRef.current.rotation.z -= delta * 0.000002;
        const haloScale = 1.0 + Math.sin(time * 0.2) * 0.02;
        haloRef.current.scale.setScalar(haloScale);
      }
    }
  });

  // Données améliorées des bras spiraux et structure galactique
  const galaxyStructure = useMemo(() => {
    const arms = [];
    const centerDistance = 26000; // Notre distance du centre en AL
    const galaxyRadius = 50000; // Rayon de la galaxie en AL
    
    // Génération de 4 bras spiraux principaux avec sous-structures
    for (let arm = 0; arm < 4; arm++) {
      const armAngle = (arm * Math.PI * 2) / 4;
      const armPoints = [];
      const subArmPoints = []; // Bras secondaires
      
      for (let r = 2000; r < galaxyRadius; r += 1500) {
        const spiralAngle = armAngle + (r / galaxyRadius) * Math.PI * 6; // Spirale plus serrée
        const x = Math.cos(spiralAngle) * r * 12.6;
        const z = Math.sin(spiralAngle) * r * 12.6;
        const y = (Math.random() - 0.5) * r * 0.015; // Épaisseur du disque réduite
        
        armPoints.push([x, y, z]);
        
        // Bras secondaires avec décalage
        if (r % 3000 === 0) {
          const subAngle = spiralAngle + 0.3;
          const subX = Math.cos(subAngle) * r * 0.7 * 12.6;
          const subZ = Math.sin(subAngle) * r * 0.7 * 12.6;
          subArmPoints.push([subX, y, subZ]);
        }
      }
      
      arms.push({ main: armPoints, sub: subArmPoints });
    }
    
    return { arms, centerDistance: centerDistance * 12.6 };
  }, []);

  if (!shouldShowGalaxy) return null;

  return (
    <group ref={groupRef}>
      {/* Halo galactique sombre */}
      <mesh ref={haloRef} position={[0, 0, 0]}>
        <sphereGeometry args={[800000, 32, 32]} />
        <meshBasicMaterial
          color="#2D1B69"
          transparent
          opacity={0.03}
          toneMapped={false}
        />
      </mesh>
      
      {/* Particules de poussière cosmique */}
      <Sparkles
        count={5000}
        scale={400000}
        size={2}
        speed={0.1}
        opacity={0.3}
        color="#8B4513"
      />
      
      {/* Bulbe central galactique amélioré */}
      <mesh ref={centralBulgeRef} position={[0, 0, 0]}>
        <sphereGeometry args={[45000, 64, 64]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>
      
      {/* Cœur lumineux central */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[25000, 32, 32]} />
        <meshBasicMaterial
          color="#FFF8DC"
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>
      
      {/* Trou noir supermassif central (Sagittarius A*) avec disque d'accrétion */}
      <group>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1500, 24, 24]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={1.0}
          />
        </mesh>
        
        {/* Disque d'accrétion du trou noir */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1500, 8000, 32]} />
          <meshBasicMaterial
            color="#FF4500"
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      </group>
      
      {/* Disque de poussière galactique amélioré */}
      <mesh ref={dustLanesRef} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[580000, 620000, 3000, 128, 1, true]} />
        <meshBasicMaterial
          color="#654321"
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Bras spiraux principaux avec étoiles améliorées */}
      <group ref={spiralArmsRef}>
        {galaxyStructure.arms.map((arm, armIndex) => (
          <group key={`arm-${armIndex}`}>
            {/* Bras principal */}
            {arm.main.map((point, pointIndex) => {
              if (pointIndex % 8 !== 0) return null; // Échantillonnage optimisé
              
              const [x, y, z] = point;
              const distance = Math.sqrt(x*x + z*z);
              const starSize = 150 + Math.random() * 600;
              
              // Couleurs réalistes selon la position dans la galaxie
              let starColor;
              if (distance < 200000) {
                starColor = Math.random() > 0.6 ? '#FFD700' : '#FFF8DC'; // Centre: étoiles plus vieilles
              } else if (distance < 400000) {
                starColor = Math.random() > 0.7 ? '#4169E1' : 
                           Math.random() > 0.4 ? '#FFD700' : '#FFF8DC'; // Milieu: mélange
              } else {
                starColor = Math.random() > 0.5 ? '#4169E1' : '#87CEEB'; // Extérieur: étoiles jeunes
              }
              
              return (
                <mesh key={pointIndex} position={[x, y, z]}>
                  <sphereGeometry args={[starSize, 12, 12]} />
                  <meshBasicMaterial
                    color={starColor}
                    transparent
                    opacity={0.7 + Math.random() * 0.3}
                    toneMapped={false}
                  />
                </mesh>
              );
            })}
            
            {/* Bras secondaires */}
            {arm.sub.map((point, pointIndex) => {
              const [x, y, z] = point;
              const starSize = 100 + Math.random() * 400;
              const starColor = Math.random() > 0.6 ? '#87CEEB' : '#B0C4DE';
              
              return (
                <mesh key={`sub-${pointIndex}`} position={[x, y, z]}>
                  <sphereGeometry args={[starSize, 8, 8]} />
                  <meshBasicMaterial
                    color={starColor}
                    transparent
                    opacity={0.5}
                    toneMapped={false}
                  />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>
      
      {/* Régions de formation d'étoiles (nébuleuses) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 200000 + Math.random() * 300000;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 5000;
        
        return (
          <mesh key={`nebula-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[8000 + Math.random() * 12000, 16, 16]} />
            <meshBasicMaterial
              color={Math.random() > 0.5 ? '#FF69B4' : '#DA70D6'}
              transparent
              opacity={0.2}
              toneMapped={false}
            />
          </mesh>
        );
      })}
      
      {/* Position de notre système solaire avec animation */}
      <group position={[galaxyStructure.centerDistance * 0.7, 0, galaxyStructure.centerDistance * 0.3]}>
        <mesh>
          <sphereGeometry args={[800, 24, 24]} />
          <meshBasicMaterial
            color="#00FF00"
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
        
        {/* Anneau indicateur pulsant */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1200, 1500, 16]} />
          <meshBasicMaterial
            color="#ADFF2F"
            transparent
            opacity={0.6}
            toneMapped={false}
          />
        </mesh>
        
        {/* Label amélioré pour notre système */}
        <Html
          position={[0, 4000, 0]}
          center
          distanceFactor={1000000}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-green-400 text-lg font-bold bg-black/90 px-4 py-3 rounded-xl backdrop-blur-sm border border-green-400/60 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2">
              🌟 <span className="animate-pulse">Notre Système Solaire</span>
            </div>
            <div className="text-sm mt-2 text-green-300">
              Bras d'Orion - 26 000 AL du centre galactique
            </div>
            <div className="text-xs mt-1 text-white/70">
              Vitesse orbitale: ~220 km/s
            </div>
          </div>
        </Html>
      </group>
      
      {/* Informations galactiques améliorées */}
      {cameraDistance > 50000000 && (
        <Html
          position={[0, 250000, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-white text-base bg-black/95 px-6 py-4 rounded-xl backdrop-blur-sm border border-purple-400/60 max-w-lg shadow-2xl animate-fade-in">
            <div className="font-bold text-purple-300 text-xl mb-3 flex items-center gap-2">
              🌌 <span className="animate-pulse">Voie Lactée</span>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                <span>Galaxie spirale barrée</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">🔢</span>
                <span>200-400 milliards d'étoiles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">📏</span>
                <span>Diamètre: ~100 000 années-lumière</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">⏰</span>
                <span>Age: ~13,6 milliards d'années</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-400">🕳️</span>
                <span>Trou noir central: Sagittarius A*</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">🌀</span>
                <span>Vitesse de rotation: 1 tour / 225 millions d'années</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/20 text-xs text-white/70">
              Structure visible: bulbe central, bras spiraux, halo sombre
            </div>
          </div>
        </Html>
      )}
      
      {/* Galaxies voisines visibles à très grande distance */}
      {cameraDistance > 100000000 && (
        <>
          {/* Andromède (M31) */}
          <group position={[15000000, 500000, 8000000]}>
            <mesh>
              <sphereGeometry args={[220000, 32, 32]} />
              <meshBasicMaterial
                color="#6A5ACD"
                transparent
                opacity={0.4}
                toneMapped={false}
              />
            </mesh>
            
            {/* Particules d'Andromède */}
            <Sparkles
              count={1000}
              scale={400000}
              size={1.5}
              speed={0.05}
              opacity={0.4}
              color="#9370DB"
            />
            
            <Html
              position={[0, 350000, 0]}
              center
              distanceFactor={5000000}
              style={{ pointerEvents: 'none' }}
            >
              <div className="text-purple-300 text-sm bg-black/80 px-3 py-2 rounded-lg backdrop-blur-sm border border-purple-400/50 animate-fade-in">
                <div className="font-bold">🌌 Galaxie d'Andromède (M31)</div>
                <div className="text-xs opacity-75 mt-1">2,5 millions AL - Collision dans 4,5 Ga</div>
              </div>
            </Html>
          </group>
          
          {/* Grand Nuage de Magellan */}
          <group position={[-1000000, -200000, -1500000]}>
            <mesh>
              <sphereGeometry args={[55000, 24, 24]} />
              <meshBasicMaterial
                color="#FF69B4"
                transparent
                opacity={0.5}
                toneMapped={false}
              />
            </mesh>
            
            <Html
              position={[0, 90000, 0]}
              center
              distanceFactor={2000000}
              style={{ pointerEvents: 'none' }}
            >
              <div className="text-pink-300 text-xs bg-black/80 px-2 py-1 rounded backdrop-blur-sm border border-pink-400/50 animate-fade-in">
                <div className="font-bold">Grand Nuage de Magellan</div>
                <div className="text-xs opacity-75">160 000 AL - Galaxie satellite</div>
              </div>
            </Html>
          </group>
          
          {/* Petit Nuage de Magellan */}
          <group position={[-800000, -300000, -1800000]}>
            <mesh>
              <sphereGeometry args={[35000, 20, 20]} />
              <meshBasicMaterial
                color="#FF1493"
                transparent
                opacity={0.4}
                toneMapped={false}
              />
            </mesh>
            
            <Html
              position={[0, 60000, 0]}
              center
              distanceFactor={1800000}
              style={{ pointerEvents: 'none' }}
            >
              <div className="text-pink-400 text-xs bg-black/80 px-2 py-1 rounded backdrop-blur-sm border border-pink-500/50 animate-fade-in">
                <div className="font-bold">Petit Nuage de Magellan</div>
                <div className="text-xs opacity-75">200 000 AL</div>
              </div>
            </Html>
          </group>
        </>
      )}
    </group>
  );
};