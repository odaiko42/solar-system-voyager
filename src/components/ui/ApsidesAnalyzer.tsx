import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getApsidesAnalysis } from '@/data/solarSystem';
import { Info, Orbit, AlertTriangle, Zap } from 'lucide-react';

interface ApsidesAnalyzerProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ApsidesAnalyzer: React.FC<ApsidesAnalyzerProps> = ({
  isVisible,
  onClose
}) => {
  const [analysis] = useState(() => getApsidesAnalysis());

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto bg-cosmic-black/95 backdrop-blur-sm border border-cosmic-blue/30 rounded-lg">
      <Card className="bg-transparent border-none text-cosmic-text">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Orbit className="w-5 h-5 text-cosmic-blue" />
              Analyse des Apsides
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-cosmic-text hover:text-white"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs defaultValue="planets" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-cosmic-black/50">
              <TabsTrigger value="planets">Planètes</TabsTrigger>
              <TabsTrigger value="transneptunian">TNOs</TabsTrigger>
              <TabsTrigger value="effects">Effets</TabsTrigger>
            </TabsList>

            <TabsContent value="planets" className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-cosmic-blue mb-2">Planètes Intérieures</h4>
                <div className="space-y-2">
                  {analysis.innerPlanets.map((planet) => (
                    <div key={planet.name} className="bg-cosmic-black/30 p-2 rounded text-xs">
                      <div className="font-medium">{planet.name}</div>
                      <div className="flex justify-between">
                        <span>Périhélie: {planet.perihelion?.toFixed(3)} UA</span>
                        <span>Aphélie: {planet.aphelion?.toFixed(3)} UA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>e = {planet.eccentricity?.toFixed(4)}</span>
                        <Badge variant="secondary" className="text-xs">
                          Δ {planet.variation}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-cosmic-blue mb-2">Planètes Extérieures</h4>
                <div className="space-y-2">
                  {analysis.outerPlanets.map((planet) => (
                    <div key={planet.name} className="bg-cosmic-black/30 p-2 rounded text-xs">
                      <div className="font-medium flex items-center gap-1">
                        {planet.name}
                        {planet.name === 'Jupiter' && <Zap className="w-3 h-3 text-yellow-400" />}
                      </div>
                      <div className="flex justify-between">
                        <span>Périhélie: {planet.perihelion?.toFixed(2)} UA</span>
                        <span>Aphélie: {planet.aphelion?.toFixed(2)} UA</span>
                      </div>
                      <div className="text-xs text-cosmic-text/70 mt-1">
                        {planet.resonances}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transneptunian" className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-cosmic-blue mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Objets Transneptuniens
                </h4>
                <div className="space-y-2">
                  {analysis.transneptunianObjects.map((obj) => (
                    <div key={obj.name} className="bg-cosmic-black/30 p-2 rounded text-xs">
                      <div className="font-medium flex items-center gap-2">
                        {obj.name}
                        {obj.isCloserThanNeptune && (
                          <Badge variant="destructive" className="text-xs">
                            &lt; Neptune
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span>Périhélie: {obj.perihelion?.toFixed(1)} UA</span>
                        <span>Aphélie: {obj.aphelion?.toFixed(1)} UA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>e = {obj.eccentricity?.toFixed(3)}</span>
                        <Badge 
                          variant={(obj.eccentricity || 0) > 0.5 ? "destructive" : "secondary"} 
                          className="text-xs"
                        >
                          Δ {obj.variation}
                        </Badge>
                      </div>
                      <div className="text-xs text-cosmic-text/70 mt-1">
                        {obj.regime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">Objets Extrêmes</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Plus excentrique:</span>
                    <span className="font-medium">{analysis.extremeObjects.mostEccentric.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aphélie max:</span>
                    <span className="font-medium">{analysis.extremeObjects.farthestAphelion.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Périhélie min:</span>
                    <span className="font-medium">{analysis.extremeObjects.closestPerihelion.name}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="effects" className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-cosmic-blue mb-2">Frontières du Système</h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(analysis.systemBoundaries).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-cosmic-blue mb-2">Effets Gravitationnels</h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(analysis.gravitationalEffects).map(([key, value]) => (
                    <div key={key} className="bg-cosmic-black/30 p-2 rounded">
                      <div className="font-medium capitalize text-cosmic-blue">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-cosmic-text/80">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 p-2 rounded text-xs">
                <div className="flex items-center gap-1 text-yellow-400 font-medium mb-1">
                  <Info className="w-3 h-3" />
                  Note Scientifique
                </div>
                <div className="text-cosmic-text/80">
                  Les trajectoires extrêmes nécessitent des simulations numériques car les effets 
                  relativistes, résonances et marées galactiques ne peuvent être décrits 
                  analytiquement.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
