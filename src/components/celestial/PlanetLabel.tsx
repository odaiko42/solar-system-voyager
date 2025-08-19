import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group } from 'three';
import { CelestialBody } from '@/types/astronomy';

interface PlanetLabelProps {
  body: CelestialBody;
  position: [number, number, number];
  visible: boolean;
  cameraDistance?: number; // Distance de la caméra pour ajuster la taille
}

export const PlanetLabel: React.FC<PlanetLabelProps> = ({ 
  body, 
  position, 
  visible,
  cameraDistance = 30
}) => {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Always face the camera
      groupRef.current.lookAt(state.camera.position);
    }
  });

  if (!visible) return null;

  const getLabelColor = () => {
    switch (body.id) {
      case 'sun':
        return 'text-yellow-400';
      case 'mercury':
        return 'text-orange-300';
      case 'venus':
        return 'text-yellow-200';
      case 'earth':
        return 'text-blue-400';
      case 'mars':
        return 'text-red-400';
      case 'jupiter':
        return 'text-orange-400';
      case 'saturn':
        return 'text-yellow-300';
      case 'uranus':
        return 'text-cyan-400';
      case 'neptune':
        return 'text-blue-600';
      // Lunes
      case 'moon':
        return 'text-gray-300';
      case 'io':
        return 'text-yellow-300';
      case 'europa':
        return 'text-blue-300';
      case 'ganymede':
        return 'text-gray-400';
      case 'callisto':
        return 'text-gray-500';
      case 'mimas':
      case 'enceladus':
        return 'text-white';
      case 'titan':
        return 'text-orange-300';
      case 'triton':
        return 'text-pink-300';
      default:
        return 'text-white';
    }
  };

  const getLabelSize = () => {
    // Calcul de la taille adaptative basée sur la distance de la caméra avec progression plus douce
    let baseSize: string;
    let weight: string;
    
    if (cameraDistance < 5) {
      baseSize = 'text-xl';
      weight = 'font-bold';
    } else if (cameraDistance < 15) {
      baseSize = 'text-lg';
      weight = 'font-semibold';
    } else if (cameraDistance < 50) {
      baseSize = 'text-base';
      weight = 'font-medium';
    } else if (cameraDistance < 150) {
      baseSize = 'text-sm';
      weight = 'font-medium';
    } else if (cameraDistance < 400) {
      baseSize = 'text-xs';
      weight = 'font-normal';
    } else {
      baseSize = 'text-xs';
      weight = 'font-light';
    }
    
    // Ajustements spécifiques par type d'objet
    if (body.id === 'sun') {
      return `${baseSize} ${weight}`;
    }
    
    if (['jupiter', 'saturn'].includes(body.id)) {
      return `${baseSize} ${weight}`;
    }
    
    if (body.type === 'moon') {
      // Les lunes sont toujours un peu plus petites
      const moonSize = baseSize === 'text-xl' ? 'text-lg' :
                       baseSize === 'text-lg' ? 'text-base' :
                       baseSize === 'text-base' ? 'text-sm' :
                       baseSize === 'text-sm' ? 'text-xs' : 'text-xs';
      return `${moonSize} font-normal`;
    }
    
    return `${baseSize} ${weight}`;
  };

  // Calcul du facteur de distance adaptatif amélioré
  const getDistanceFactor = () => {
    if (body.type === 'moon') {
      return Math.max(2, Math.min(12, cameraDistance * 0.5));
    }
    return Math.max(3, Math.min(20, cameraDistance * 0.6));
  };

  // Calcul de la position adaptative améliorée
  const getLabelPosition = (): [number, number, number] => {
    // Position au-dessus de la planète avec décalage adaptatif
    let baseOffset = 2; // Décalage de base
    
    // Ajustement selon le type de corps
    if (body.id === 'sun') {
      baseOffset = 8; // Le soleil est plus grand
    } else if (['jupiter', 'saturn'].includes(body.id)) {
      baseOffset = 4; // Les géantes gazeuses sont plus grandes
    } else if (body.type === 'moon') {
      baseOffset = 1; // Les lunes sont plus petites
    }
    
    // Ajustement selon la distance de caméra pour éviter que le label soit trop proche/loin
    const distanceFactor = Math.max(0.5, Math.min(3, cameraDistance * 0.03));
    const finalOffset = baseOffset * distanceFactor;
    
    return [0, finalOffset, 0];
  };

  // Calcul du padding adaptatif avec progression plus douce
  const getPadding = () => {
    if (cameraDistance < 10) return 'px-4 py-2';
    if (cameraDistance < 30) return 'px-3 py-2';
    if (cameraDistance < 100) return 'px-2 py-1';
    if (cameraDistance < 300) return 'px-2 py-1';
    return 'px-1 py-0.5';
  };

  return (
    <group ref={groupRef} position={position}>
      <Html
        center
        distanceFactor={getDistanceFactor()}
        position={getLabelPosition()}
        className="pointer-events-none select-none"
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex flex-col items-center space-y-1">
          <div 
            className={`
              ${getPadding()} rounded-lg backdrop-blur-sm bg-black/80 border border-white/30 
              ${getLabelColor()} ${getLabelSize()} 
              shadow-xl whitespace-nowrap
              pointer-events-none select-none
            `}
            style={{ 
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            {body.name}
          </div>
          
          {/* Optional planet/moon type indicator */}
          {body.type === 'planet' && (
            <div 
              className="text-xs text-white/70 bg-black/40 px-1 rounded pointer-events-none select-none"
              style={{ pointerEvents: 'none' }}
            >
              Planète
            </div>
          )}
          
          {body.type === 'moon' && (
            <div 
              className="text-xs text-white/70 bg-black/40 px-1 rounded pointer-events-none select-none"
              style={{ pointerEvents: 'none' }}
            >
              Lune
            </div>
          )}
          
          {body.id === 'sun' && (
            <div 
              className="text-xs text-yellow-300/70 bg-black/40 px-1 rounded pointer-events-none select-none"
              style={{ pointerEvents: 'none' }}
            >
              Étoile
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};