import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, PointLight, AdditiveBlending, Color } from 'three';
import { TextureLoader } from 'three';
import { Sphere, Sparkles } from '@react-three/drei';
import { calculateDisplayRadius } from '@/utils/orbitalCalculations';
import { sunMap } from '@/data/solarSystem';
import { PlanetLabel } from './PlanetLabel';

// Import de la texture haute qualité du soleil depuis public
const sunTexture = sunMap.texture;

// Données astronomiques réelles du Soleil - compatible avec CelestialBody
const SUN_DATA = {
  id: sunMap.id,
  name: sunMap.name,
  type: 'star' as const,
  radius: sunMap.radius, // km - rayon réel du Soleil
  distance: 0,
  color: '#FDB813',
  rotationPeriod: sunMap.rotationPeriod, // jours - période de rotation équatoriale
  orbitalPeriod: 0,
  axialTilt: sunMap.axialTilt, // degrés - inclinaison de l'axe par rapport à l'écliptique
  texture: sunMap.texture,
  temperature: sunMap.temperature,
  luminosity: sunMap.luminosity,
  mass: sunMap.mass
};

interface SunProps {
  intensity?: number;
  showSolarActivity?: boolean;
  showCoronaLayers?: boolean;
  enableRealisticCycle?: boolean;
  showLabel?: boolean;
  cameraDistance?: number;
}

export const Sun: React.FC<SunProps> = ({ 
  intensity = sunMap.intensitySettings.default,
  showSolarActivity = true,
  showCoronaLayers = true,
  enableRealisticCycle = false,
  showLabel = false,
  cameraDistance = 1000
}) => {
  const meshRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const coronaRef = useRef<Mesh>(null);
  const flareRef = useRef<Mesh>(null);
  const photosphereRef = useRef<Mesh>(null);
  
  // Calculer la vraie taille d'affichage du Soleil
  const sunRadius = calculateDisplayRadius(SUN_DATA);
  
  // Charger la texture du soleil depuis le mapping
  const texture = useLoader(TextureLoader, sunTexture);
  
  // Calculer l'intensité dynamique basée sur l'intensité fournie
  const dynamicIntensity = useMemo(() => {
    const baseIntensity = intensity;
    const minIntensity = sunMap.intensitySettings.minimum;
    const maxIntensity = sunMap.intensitySettings.maximum;
    
    // Assurer que l'intensité reste dans les limites
    return Math.max(minIntensity, Math.min(maxIntensity, baseIntensity));
  }, [intensity]);
  
  // Calculer la température de couleur basée sur l'intensité
  const colorTemperature = useMemo(() => {
    const baseTemp = SUN_DATA.temperature;
    const tempVariation = 0.8 + (dynamicIntensity / sunMap.intensitySettings.maximum) * 0.4;
    return baseTemp * tempVariation;
  }, [dynamicIntensity]);
  
  // Couleurs dynamiques adaptées à l'intensité
  const sunColors = useMemo(() => {
    const intensityFactor = dynamicIntensity / sunMap.intensitySettings.default;
    return {
      core: new Color('#FFD700').multiplyScalar(0.8 + intensityFactor * 0.4),
      photosphere: new Color('#FFA500').multiplyScalar(0.9 + intensityFactor * 0.3),
      chromosphere: new Color('#FF6347').multiplyScalar(0.8 + intensityFactor * 0.5),
      corona: new Color('#FFFFE0').multiplyScalar(0.7 + intensityFactor * 0.6),
      flare: new Color('#FF4500').multiplyScalar(0.6 + intensityFactor * 0.8)
    };
  }, [dynamicIntensity]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Convertir la période de rotation en radians par seconde
    const rotationSpeed = (2 * Math.PI) / (SUN_DATA.rotationPeriod * 24 * 60 * 60); // rad/s réel
    const scaledRotationSpeed = rotationSpeed * delta * 1000; // Accéléré pour visibilité
    
    // Appliquer l'inclinaison axiale du Soleil
    const axialTiltRad = SUN_DATA.axialTilt * Math.PI / 180;
    
    // Vraie rotation du Soleil avec période réaliste
    if (meshRef.current) {
      meshRef.current.rotation.x = axialTiltRad;
      meshRef.current.rotation.y += scaledRotationSpeed;
    }
    
    // Animation photosphère avec pulsation réaliste
    if (photosphereRef.current) {
      // Rotation différentielle du Soleil (équateur plus rapide que les pôles)
      const equatorialSpeed = scaledRotationSpeed * 0.9;
      photosphereRef.current.rotation.y -= equatorialSpeed;
      
      // Variation de taille basée sur l'activité solaire (cycle de 11 ans simulé)
      const solarCycle = Math.sin(time * 0.00001) * 0.01; // Très subtil
      const scale = 1.1 + solarCycle + Math.sin(time * 2) * 0.005;
      photosphereRef.current.scale.setScalar(scale);
      photosphereRef.current.rotation.x = axialTiltRad;
    }
    
    // Animation couronne avec rotation lente et inclinaison
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= scaledRotationSpeed * 0.7;
      coronaRef.current.rotation.z += delta * 0.01;
      coronaRef.current.rotation.x = axialTiltRad;
      
      const opacity = 0.05 + Math.sin(time * 1.5) * 0.02;
      if (coronaRef.current.material) {
        (coronaRef.current.material as any).opacity = opacity;
      }
    }
    
    // Animation des flares solaires avec inclinaison
    if (flareRef.current) {
      flareRef.current.rotation.x = axialTiltRad + delta * 0.1;
      flareRef.current.rotation.y -= scaledRotationSpeed * 0.8;
      
      // Flares plus intenses aux pôles (où les lignes de champ magnétique convergent)
      const flareScale = 2.8 + Math.sin(time * 3) * 0.3 + Math.sin(time * 0.1) * 0.1;
      flareRef.current.scale.setScalar(flareScale);
    }
    
    // Variation d'intensité lumineuse pour effet réaliste (cycle solaire)
    if (lightRef.current) {
      const baseIntensity = dynamicIntensity;
      
      if (enableRealisticCycle) {
        // Cycle solaire de 11 ans simulé en accéléré
        const solarCycle = Math.sin(time * 0.00001) * 0.2; // Cycle long
        const solarFlares = Math.sin(time * 2) * 0.1; // Éruptions solaires
        lightRef.current.intensity = baseIntensity + solarCycle + solarFlares;
      } else {
        // Variation subtile pour effet visuel
        const solarVariation = Math.sin(time * 0.00001) * 0.1;
        const shortVariation = Math.sin(time * 0.5) * 0.2;
        lightRef.current.intensity = baseIntensity + solarVariation + shortVariation;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Particules scintillantes autour du soleil - conditionnelles */}
      {showSolarActivity && (
        <Sparkles
          count={Math.round(200 * (dynamicIntensity / sunMap.intensitySettings.default))}
          scale={8 * (dynamicIntensity / sunMap.intensitySettings.default)}
          size={3 * (dynamicIntensity / sunMap.intensitySettings.default)}
          speed={0.3}
          opacity={0.8}
          color={sunColors.core.getHexString()}
        />
      )}
      
      {/* Lumière principale du soleil - intensité adaptative */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={dynamicIntensity}
        color={sunColors.core.getHexString()}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.5}
        shadow-camera-far={300}
        shadow-bias={-0.0001}
      />
      
      {/* Lumière ambiante chaude supplémentaire - proportionnelle */}
      <pointLight
        position={[0, 0, 0]}
        intensity={dynamicIntensity * 0.375}
        color={sunColors.photosphere.getHexString()}
        distance={80 * (dynamicIntensity / sunMap.intensitySettings.default)}
        decay={1.5}
      />
      
      {/* Lumière douce pour l'éclairage des planètes lointaines - adaptative */}
      <pointLight
        position={[0, 0, 0]}
        intensity={dynamicIntensity * 0.2}
        color={sunColors.corona.getHexString()}
        distance={200 * (dynamicIntensity / sunMap.intensitySettings.default)}
        decay={2}
      />
      
      {/* Cœur du soleil avec vraie taille et texture NASA */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow={false}>
        <sphereGeometry args={[sunRadius, 64, 64]} />
        <meshStandardMaterial 
          map={texture}
          color={sunColors.core}
          toneMapped={false}
          emissive={sunColors.core}
          emissiveIntensity={0.3 * (dynamicIntensity / sunMap.intensitySettings.default)}
          roughness={0}
          metalness={0}
        />
      </mesh>
      
      {/* Couches de la couronne solaire - conditionnelles */}
      {showCoronaLayers && (
        <>
          {/* Photosphère avec vraie proportion */}
          <mesh ref={photosphereRef} scale={1.1}>
            <sphereGeometry args={[sunRadius, 32, 32]} />
            <meshBasicMaterial 
              color={sunColors.photosphere}
              transparent 
              opacity={0.6 * (dynamicIntensity / sunMap.intensitySettings.default)}
              toneMapped={false}
              blending={AdditiveBlending}
            />
          </mesh>
          
          {/* Chromosphère - couche d'émission */}
          <mesh scale={1.25}>
            <sphereGeometry args={[sunRadius, 24, 24]} />
            <meshBasicMaterial 
              color={sunColors.chromosphere}
              transparent 
              opacity={0.3 * (dynamicIntensity / sunMap.intensitySettings.default)}
              toneMapped={false}
              blending={AdditiveBlending}
            />
          </mesh>
          
          {/* Couronne solaire animée avec vraie proportion */}
          <mesh ref={coronaRef} scale={1.8}>
            <sphereGeometry args={[sunRadius, 16, 16]} />
            <meshBasicMaterial 
              color={sunColors.corona}
              transparent 
              opacity={0.08 * (dynamicIntensity / sunMap.intensitySettings.default)}
              toneMapped={false}
              blending={AdditiveBlending}
            />
          </mesh>
        </>
      )}
      
      {/* Flares solaires externes - conditionnels */}
      {showSolarActivity && (
        <>
          <mesh ref={flareRef} scale={2.8}>
            <sphereGeometry args={[sunRadius, 12, 12]} />
            <meshBasicMaterial 
              color={sunColors.flare}
              transparent 
              opacity={0.03 * (dynamicIntensity / sunMap.intensitySettings.default)}
              toneMapped={false}
              blending={AdditiveBlending}
            />
          </mesh>
          
          {/* Halo externe ultra-subtil */}
          <mesh scale={4.5}>
            <sphereGeometry args={[sunRadius, 8, 8]} />
            <meshBasicMaterial 
              color={sunColors.flare}
              transparent 
              opacity={0.008 * (dynamicIntensity / sunMap.intensitySettings.default)}
              toneMapped={false}
              blending={AdditiveBlending}
            />
          </mesh>
        </>
      )}
      
      {/* Sun Label - suit le soleil */}
      {showLabel && (
        <PlanetLabel
          body={SUN_DATA}
          position={[0, 0, 0]}
          visible={true}
          cameraDistance={cameraDistance}
        />
      )}
    </group>
  );
};