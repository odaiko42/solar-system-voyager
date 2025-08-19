import { useState, useEffect } from 'react';
import { SimulationState } from '@/types/astronomy';

export const useSimulation = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    currentDate: new Date(),
    timeScale: 1,
    isPlaying: false,
    selectedAsteroid: null,
    selectedMeteorite: null,
    showOrbits: true,
    showAsteroidPath: false,
    showPlanetNames: true,
    showMeteorites: true,
    showMeteoriteTrails: true,
    sunIntensity: 4.0, // Default sun intensity
    showGalaxies: true, // Show galaxies by default
    showAsteroidBelt: true, // Show asteroid belt by default
    showKuiperBelt: true, // Show Kuiper belt by default
    showBeltDensity: true, // Show belt density by default
    showMoons: {
      earth: true,
      jupiter: true,
      saturn: true,
      uranus: true,
      neptune: true
    }
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (simulationState.isPlaying) {
      intervalId = setInterval(() => {
        setSimulationState(prev => ({
          ...prev,
          currentDate: new Date(prev.currentDate.getTime() + (prev.timeScale * 24 * 60 * 60 * 1000))
        }));
      }, 100); // Update every 100ms
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [simulationState.isPlaying, simulationState.timeScale]);

  const updateSimulation = (updates: Partial<SimulationState>) => {
    setSimulationState(prev => ({ ...prev, ...updates }));
  };

  return {
    simulationState,
    updateSimulation
  };
};