import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { Vector3, Group, Mesh, Camera } from 'three';
import { getCurrentScale } from '@/utils/starSystemUtils';
import { solarSystemBodies } from '@/data/solarSystem';
import { nearbyPlanetarySystems } from '@/components/celestial/ExoplanetSystem';

interface MiniMap3DProps {
  cameraDistance: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  onNavigate: (position: [number, number, number], target: [number, number, number]) => void;
}

// Composant pour afficher le système solaire dans la minimap
const SolarSystemMiniature: React.FC<{ scale: number; opacity: number }> = ({ scale, opacity }) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const planets = solarSystemBodies.filter(body => body.type === 'planet');

  return (
    <group ref={groupRef} scale={scale}>
      {/* Soleil */}
      <mesh>
        <sphereGeometry args={[2, 8, 8]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={opacity} />
      </mesh>
      
      {/* Planètes */}
      {planets.map((planet, index) => (
        <group key={planet.id}>
          {/* Orbite */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.distance * 0.1 - 0.1, planet.distance * 0.1 + 0.1, 16]} />
            <meshBasicMaterial 
              color="#444444" 
              transparent 
              opacity={opacity * 0.3} 
            />
          </mesh>
          
          {/* Planète */}
          <mesh position={[planet.distance * 0.1, 0, 0]}>
            <sphereGeometry args={[Math.max(planet.radius * 0.01, 0.2), 6, 6]} />
            <meshBasicMaterial 
              color={planet.color} 
              transparent 
              opacity={opacity} 
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Composant pour afficher les étoiles proches
const NearbyStarsMiniature: React.FC<{ scale: number; opacity: number }> = ({ scale, opacity }) => {
  return (
    <group scale={scale}>
      {nearbyPlanetarySystems.map((system) => (
        <group key={system.starId} position={[
          system.position[0] * 0.00001,
          system.position[1] * 0.00001,
          system.position[2] * 0.00001
        ]}>
          <mesh>
            <sphereGeometry args={[0.5, 6, 6]} />
            <meshBasicMaterial 
              color="#FFF8DC" 
              transparent 
              opacity={opacity}
              toneMapped={false}
            />
          </mesh>
          
          {/* Nom du système */}
          <Html
            position={[0, 1, 0]}
            center
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-xs text-white bg-black/60 px-1 rounded">
              {system.starName}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

// Indicateur de position de la caméra (simplifié)
const CameraIndicator: React.FC<{ 
  position: [number, number, number]; 
  target: [number, number, number];
  scale: number;
}> = ({ position, target, scale }) => {
  const indicatorRef = useRef<Group>(null);
  
  // Normaliser les positions selon l'échelle
  const normalizedPosition = useMemo(() => [
    position[0] * scale,
    position[1] * scale,
    position[2] * scale
  ] as [number, number, number], [position, scale]);
  
  const normalizedTarget = useMemo(() => [
    target[0] * scale,
    target[1] * scale,
    target[2] * scale
  ] as [number, number, number], [target, scale]);

  // Points pour la ligne
  const linePoints = useMemo(() => [
    new Vector3(...normalizedPosition),
    new Vector3(...normalizedTarget)
  ], [normalizedPosition, normalizedTarget]);

  useFrame((state) => {
    if (indicatorRef.current) {
      // Animation de pulsation
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      indicatorRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={indicatorRef}>
      {/* Position de la caméra */}
      <mesh position={normalizedPosition}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.8} />
      </mesh>
      
      {/* Ligne vers la cible */}
      <Line
        points={linePoints}
        color="#00FF00"
        lineWidth={2}
        transparent
        opacity={0.5}
      />
      
      {/* Cible */}
      <mesh position={normalizedTarget}>
        <sphereGeometry args={[0.5, 6, 6]} />
        <meshBasicMaterial color="#FF0000" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// Composant principal de la scène minimap (sans contrôles interactifs)
const MiniMapScene: React.FC<{
  cameraDistance: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  onNavigate: (position: [number, number, number], target: [number, number, number]) => void;
}> = ({ cameraDistance, cameraPosition, cameraTarget, onNavigate }) => {
  const { camera } = useThree();
  const currentScale = getCurrentScale(cameraDistance);
  
  // Ajuster la vue de la minimap selon l'échelle
  const minimapConfig = useMemo(() => {
    switch (currentScale.name) {
      case 'Planétaire':
        return {
          scale: 1,
          cameraScale: 0.001,
          showSolarSystem: true,
          showStars: false,
          cameraPosition: [0, 0, 50]
        };
      case 'Système local':
        return {
          scale: 0.1,
          cameraScale: 0.0001,
          showSolarSystem: true,
          showStars: false,
          cameraPosition: [0, 0, 100]
        };
      case 'Système stellaire':
        return {
          scale: 0.01,
          cameraScale: 0.00001,
          showSolarSystem: true,
          showStars: false,
          cameraPosition: [0, 0, 200]
        };
      case 'Interstellaire':
        return {
          scale: 0.001,
          cameraScale: 0.000001,
          showSolarSystem: false,
          showStars: true,
          cameraPosition: [0, 0, 500]
        };
      default:
        return {
          scale: 0.0001,
          cameraScale: 0.0000001,
          showSolarSystem: false,
          showStars: true,
          cameraPosition: [0, 0, 1000]
        };
    }
  }, [currentScale.name]);

  // Positionner la caméra de la minimap de façon fixe
  useEffect(() => {
    const [x, y, z] = minimapConfig.cameraPosition;
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, minimapConfig.cameraPosition]);

  const handleClick = (event: any) => {
    event.stopPropagation();
    
    // Calculer une nouvelle position de caméra basée sur le clic
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    const newTarget: [number, number, number] = [
      x * 100 / minimapConfig.cameraScale,
      0,
      y * 100 / minimapConfig.cameraScale
    ];
    
    const newPosition: [number, number, number] = [
      newTarget[0] + cameraDistance * 0.3,
      cameraDistance * 0.2,
      newTarget[2] + cameraDistance * 0.3
    ];
    
    onNavigate(newPosition, newTarget);
  };

  return (
    <group onClick={handleClick}>
      {/* Système solaire */}
      {minimapConfig.showSolarSystem && (
        <SolarSystemMiniature 
          scale={minimapConfig.scale} 
          opacity={0.8}
        />
      )}
      
      {/* Étoiles proches */}
      {minimapConfig.showStars && (
        <NearbyStarsMiniature 
          scale={minimapConfig.scale} 
          opacity={0.9}
        />
      )}
      
      {/* Indicateur de position de la caméra */}
      <CameraIndicator
        position={cameraPosition}
        target={cameraTarget}
        scale={minimapConfig.cameraScale}
      />
      
      {/* Grille de référence simplifiée */}
      <gridHelper args={[200, 20, '#333333', '#555555']} position={[0, -10, 0]} />
    </group>
  );
};

export const MiniMap3D: React.FC<MiniMap3DProps> = ({
  cameraDistance,
  cameraPosition,
  cameraTarget,
  onNavigate
}) => {
  const currentScale = getCurrentScale(cameraDistance);
  
  // État pour la position et la taille de la mini-map
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 210 }); // bottom-4 left-4
  const [size, setSize] = useState({ width: 256, height: 192 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 256, height: 192 });
  
  const minimapRef = useRef<HTMLDivElement>(null);
  
  // Gérer le déplacement
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.minimap-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  }, [position]);
  
  // Gérer le redimensionnement
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    e.stopPropagation();
    e.preventDefault();
  }, [size]);
  
  // Gérer les mouvements de souris
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(200, Math.min(600, resizeStart.width + deltaX));
      const newHeight = Math.max(150, Math.min(450, resizeStart.height + deltaY));
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragStart, resizeStart, size.width, size.height]);
  
  // Gérer la fin du glissement/redimensionnement
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);
  
  // Ajouter les écouteurs d'événements globaux
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);
  
  // Ajuster la position lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - size.width),
        y: Math.min(prev.y, window.innerHeight - size.height)
      }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  return (
    <div 
      ref={minimapRef}
      className="fixed z-20 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="bg-black/80 rounded-lg border border-white/30 backdrop-blur-sm overflow-hidden shadow-2xl h-full flex flex-col"
        // Empêcher la propagation des événements vers la scène principale
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête avec poignée de déplacement */}
        <div className="minimap-header px-3 py-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-white/20 cursor-grab active:cursor-grabbing">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-white">Mini-Map 3D</span>
              <span className="text-xs text-gray-400">📍</span>
            </div>
            <span className="text-xs text-blue-300">{currentScale.name}</span>
          </div>
        </div>
        
        {/* Canvas 3D redimensionnable */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ 
              fov: 45,
              near: 0.1,
              far: 10000,
              position: [0, 50, 100]
            }}
            style={{ background: 'rgba(0,0,0,0.1)' }}
            gl={{ 
              antialias: false, 
              alpha: true,
              powerPreference: 'low-power'
            }}
            onPointerMissed={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
            
            <MiniMapScene
              cameraDistance={cameraDistance}
              cameraPosition={cameraPosition}
              cameraTarget={cameraTarget}
              onNavigate={onNavigate}
            />
          </Canvas>
          
          {/* Overlay d'informations (statique) */}
          <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
            <div className="text-xs text-white/80 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span>📍 Distance: {(cameraDistance / 149597870.7).toFixed(2)} UA</span>
                <span className="text-green-300">🎯 Vue d'ensemble</span>
              </div>
            </div>
          </div>
          
          {/* Poignée de redimensionnement */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100 transition-opacity"
            onMouseDown={handleResizeMouseDown}
            style={{
              background: 'linear-gradient(-45deg, transparent 30%, #fff 30%, #fff 40%, transparent 40%, transparent 60%, #fff 60%, #fff 70%, transparent 70%)'
            }}
          />
        </div>
        
        {/* Légende compacte */}
        <div className="px-3 py-1 bg-black/60 border-t border-white/10 shrink-0">
          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/70">Caméra</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-white/70">Cible</span>
            </div>
            {currentScale.name === 'Interstellaire' && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span className="text-white/70">Étoiles</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};