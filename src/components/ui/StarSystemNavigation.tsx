import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Navigation, Star, Globe } from 'lucide-react';

interface StarSystemNavigationProps {
  onFocusStar: (starId: string) => void;
  cameraDistance: number;
}

const nearbySystemsData = [
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    distance: 4.24,
    type: 'Naine rouge (M5.5Ve)',
    planets: ['Proxima b (zone habitable)', 'Proxima c (Super-Terre)', 'Proxima d (candidate 2022)'],
    hasHabitablePlanets: true
  },
  {
    id: 'alpha-centauri-a',
    name: 'Alpha Centauri A',
    distance: 4.37,
    type: 'Étoile type solaire (G2V)',
    planets: [],
    hasHabitablePlanets: false
  },
  {
    id: 'alpha-centauri-b',
    name: 'Alpha Centauri B',
    distance: 4.37,
    type: 'Étoile orange (K1V)',
    planets: [],
    hasHabitablePlanets: false
  },
  {
    id: 'barnards-star',
    name: 'Étoile de Barnard',
    distance: 5.96,
    type: 'Naine rouge (M4.0Ve)',
    planets: ['Barnard b (candidate)'],
    hasHabitablePlanets: false
  },
  {
    id: 'wolf-359',
    name: 'Wolf 359',
    distance: 7.86,
    type: 'Naine rouge (M6.0V)',
    planets: ['Wolf 359 b (Super-Terre chaude)'],
    hasHabitablePlanets: false
  },
  {
    id: 'lalande-21185',
    name: 'Lalande 21185',
    distance: 8.31,
    type: 'Naine rouge (M2.0V)',
    planets: ['Lalande 21185 b (candidate)'],
    hasHabitablePlanets: false
  },
  {
    id: 'sirius-a',
    name: 'Sirius A',
    distance: 8.60,
    type: 'Étoile bleue-blanche (A1V)',
    planets: [],
    hasHabitablePlanets: false
  },
  {
    id: 'sirius-b',
    name: 'Sirius B',
    distance: 8.60,
    type: 'Naine blanche',
    planets: [],
    hasHabitablePlanets: false
  },
  {
    id: 'epsilon-eridani',
    name: 'Epsilon Eridani',
    distance: 10.5,
    type: 'Étoile type solaire (K2V)',
    planets: ['Epsilon Eridani b (géante gazeuse)'],
    hasHabitablePlanets: false
  },
  {
    id: 'ross-128',
    name: 'Ross 128',
    distance: 11.0,
    type: 'Naine rouge (M4.0V)',
    planets: ['Ross 128 b (zone habitable)'],
    hasHabitablePlanets: true
  },
  {
    id: '61-cygni-a',
    name: '61 Cygni A',
    distance: 11.4,
    type: 'Naine orange (K5.0V)',
    planets: ['61 Cygni A b (candidate)'],
    hasHabitablePlanets: false
  },
  {
    id: '61-cygni-b',
    name: '61 Cygni B',
    distance: 11.4,
    type: 'Naine orange (K7.0V)',
    planets: [],
    hasHabitablePlanets: false
  },
  {
    id: 'tau-ceti',
    name: 'Tau Ceti',
    distance: 11.9,
    type: 'Étoile type solaire (G8V)',
    planets: ['Tau Ceti g (chaude)', 'Tau Ceti h (tempérée)', 'Tau Ceti e (zone habitable)', 'Tau Ceti f (zone habitable)'],
    hasHabitablePlanets: true
  }
];

export const StarSystemNavigation: React.FC<StarSystemNavigationProps> = ({ 
  onFocusStar, 
  cameraDistance 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Ne montrer que si on peut voir les étoiles (distance interstellaire)
  const shouldShow = cameraDistance > 50000;
  
  if (!shouldShow) return null;

  return (
    <Card className="fixed top-20 right-4 w-96 glass-panel border-white/20 z-10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-white/5 transition-colors">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                Systèmes Stellaires Proches
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-2 max-h-[70vh] overflow-y-auto">
            {nearbySystemsData.map((system) => (
              <div
                key={system.id}
                className="p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors border border-white/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-400" />
                      {system.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {system.distance} AL • {system.type}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFocusStar(system.id)}
                    className="text-xs h-7 px-3 bg-blue-900/30 hover:bg-blue-800/50 border-blue-400/50 text-blue-300"
                  >
                    🚀 Visiter
                  </Button>
                </div>
                
                {system.planets.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-muted-foreground">Planètes:</span>
                      {system.hasHabitablePlanets && (
                        <Badge variant="secondary" className="text-xs h-4 px-1 bg-green-900/50 text-green-300">
                          Zone habitable
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {system.planets.map((planet, index) => (
                        <span key={index} className="text-xs text-blue-300 bg-blue-900/30 px-1 rounded">
                          {planet}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-400/30">
              <div className="text-xs text-blue-300 space-y-1">
                <p><strong>🚀 Navigation Interstellaire:</strong></p>
                <p>• Cliquez sur "Visiter" pour voyager vers le système</p>
                <p>• Utilisez la molette pour zoomer sur les planètes</p>
                <p>• Distance parcourue à la vitesse de la lumière !</p>
              </div>
            </div>
            
            <div className="mt-2 p-2 bg-green-900/20 rounded border border-green-500/30">
              <p className="text-xs text-green-300">
                🌍 <strong>{nearbySystemsData.filter(s => s.hasHabitablePlanets).length}</strong> systèmes avec zones habitables détectées
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};