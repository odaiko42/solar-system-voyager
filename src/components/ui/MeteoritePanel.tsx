import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Zap, 
  Plus, 
  Target, 
  Trash2, 
  Info, 
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Shuffle,
  Route
} from 'lucide-react';
import { Meteorite, SimulationState } from '@/types/astronomy';
import { famousMeteorites, generateRandomMeteorite } from '@/data/meteorites';

interface MeteoritePanelProps {
  simulationState: SimulationState;
  onSimulationChange: (state: Partial<SimulationState>) => void;
  meteorites: Meteorite[];
  onMeteoritesChange: (meteorites: Meteorite[]) => void;
  catalogTrajectories: string[];
  onCatalogTrajectoriesChange: (trajectories: string[]) => void;
}

export const MeteoritePanel: React.FC<MeteoritePanelProps> = ({
  simulationState,
  onSimulationChange,
  meteorites,
  onMeteoritesChange,
  catalogTrajectories,
  onCatalogTrajectoriesChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMeteorite, setNewMeteorite] = useState<Partial<Meteorite>>({
    name: '',
    type: 'asteroid',
    mass: 1000000,
    diameter: 0.01,
    velocity: [15, -5, 2],
    position: [2, 0, 0],
    direction: [-1, 0, 0],
    color: '#FF6B35',
    description: ''
  });

  const handleAddFamousMeteorite = (meteorite: Meteorite) => {
    const newMeteorites = [...meteorites, { ...meteorite, isActive: true }];
    onMeteoritesChange(newMeteorites);
  };

  const handleCreateCustomMeteorite = () => {
    if (!newMeteorite.name) return;
    
    const customMeteorite: Meteorite = {
      id: `custom-${Date.now()}`,
      name: newMeteorite.name,
      type: newMeteorite.type || 'asteroid',
      mass: newMeteorite.mass || 1000000,
      diameter: newMeteorite.diameter || 0.01,
      velocity: newMeteorite.velocity || [15, -5, 2],
      position: newMeteorite.position || [2, 0, 0],
      direction: newMeteorite.direction || [-1, 0, 0],
      color: newMeteorite.color || '#FF6B35',
      trail: [],
      isActive: true,
      discoveryDate: new Date().toISOString().split('T')[0],
      description: newMeteorite.description || 'Météorite personnalisée'
    };
    
    const newMeteorites = [...meteorites, customMeteorite];
    onMeteoritesChange(newMeteorites);
    setIsCreateDialogOpen(false);
    
    // Reset form
    setNewMeteorite({
      name: '',
      type: 'asteroid',
      mass: 1000000,
      diameter: 0.01,
      velocity: [15, -5, 2],
      position: [2, 0, 0],
      direction: [-1, 0, 0],
      color: '#FF6B35',
      description: ''
    });
  };

  const handleAddRandomMeteorite = () => {
    const randomMeteorite = generateRandomMeteorite();
    const newMeteorites = [...meteorites, randomMeteorite];
    onMeteoritesChange(newMeteorites);
  };

  const handleRemoveMeteorite = (id: string) => {
    const newMeteorites = meteorites.filter(m => m.id !== id);
    onMeteoritesChange(newMeteorites);
    
    // Désélectionner si c'était la météorite sélectionnée
    if (simulationState.selectedMeteorite?.id === id) {
      onSimulationChange({ selectedMeteorite: null });
    }
  };

  const handleSelectMeteorite = (meteorite: Meteorite) => {
    onSimulationChange({ selectedMeteorite: meteorite });
  };

  const handleToggleCatalogTrajectory = (meteoriteId: string) => {
    const newTrajectories = catalogTrajectories.includes(meteoriteId)
      ? catalogTrajectories.filter(id => id !== meteoriteId)
      : [...catalogTrajectories, meteoriteId];
    onCatalogTrajectoriesChange(newTrajectories);
  };

  const formatMass = (mass: number) => {
    if (mass >= 1e12) return `${(mass / 1e12).toFixed(1)} trillion kg`;
    if (mass >= 1e9) return `${(mass / 1e9).toFixed(1)} milliard kg`;
    if (mass >= 1e6) return `${(mass / 1e6).toFixed(1)} million kg`;
    if (mass >= 1e3) return `${(mass / 1e3).toFixed(1)} millier kg`;
    return `${mass.toFixed(1)} kg`;
  };

  const formatVelocity = (velocity: [number, number, number]) => {
    const speed = Math.sqrt(velocity[0]**2 + velocity[1]**2 + velocity[2]**2);
    return `${speed.toFixed(1)} km/s`;
  };

  return (
    <div className={`fixed right-4 bottom-4 w-96 max-h-[70vh] glass-panel rounded-lg z-10 transition-all duration-300 ${isCollapsed ? 'h-14' : ''}`}>
      <Card className="bg-transparent border-0 shadow-none h-full">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="stellar-text text-lg font-bold flex items-center gap-2">
              <Flame className="h-5 w-5 animate-pulse text-orange-500" />
              Météorites
              {meteorites.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {meteorites.length}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0"
            >
              {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="p-4 pt-0 space-y-4 overflow-y-auto">
            {/* Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-md bg-card/20">
                <Label htmlFor="showMeteorites" className="text-xs flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Afficher météorites
                </Label>
                <Switch
                  id="showMeteorites"
                  checked={simulationState.showMeteorites}
                  onCheckedChange={(checked) => 
                    onSimulationChange({ showMeteorites: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-card/20">
                <Label htmlFor="showMeteoriteTrails" className="text-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Trajectoires
                </Label>
                <Switch
                  id="showMeteoriteTrails"
                  checked={simulationState.showMeteoriteTrails}
                  onCheckedChange={(checked) => 
                    onSimulationChange({ showMeteoriteTrails: checked })
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddRandomMeteorite}
                      className="flex-1 text-xs"
                    >
                      <Shuffle className="w-3 h-3 mr-1" />
                      Aléatoire
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Générer une météorite aléatoire</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Créer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Créer une Météorite</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        value={newMeteorite.name}
                        onChange={(e) => setNewMeteorite({ ...newMeteorite, name: e.target.value })}
                        placeholder="Nom de la météorite"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select 
                        value={newMeteorite.type} 
                        onValueChange={(value) => setNewMeteorite({ ...newMeteorite, type: value as Meteorite['type'] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type de météorite" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asteroid">Astéroïde</SelectItem>
                          <SelectItem value="comet">Comète</SelectItem>
                          <SelectItem value="debris">Débris</SelectItem>
                          <SelectItem value="artificial">Artificiel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="mass">Masse (kg)</Label>
                        <Input
                          id="mass"
                          type="number"
                          value={newMeteorite.mass}
                          onChange={(e) => setNewMeteorite({ ...newMeteorite, mass: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="diameter">Diamètre (km)</Label>
                        <Input
                          id="diameter"
                          type="number" 
                          step="0.001"
                          value={newMeteorite.diameter}
                          onChange={(e) => setNewMeteorite({ ...newMeteorite, diameter: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <Button onClick={handleCreateCustomMeteorite} className="w-full">
                      Créer la Météorite
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Separator />

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Actives ({meteorites.length})</TabsTrigger>
                <TabsTrigger value="catalog">Catalogue ({famousMeteorites.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-2">
                <ScrollArea className="h-48">
                  {meteorites.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Flame className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucune météorite active</p>
                      <p className="text-xs">Ajoutez-en une depuis le catalogue</p>
                    </div>
                  ) : (
                    meteorites.map((meteorite) => (
                      <div
                        key={meteorite.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                          simulationState.selectedMeteorite?.id === meteorite.id 
                            ? 'ring-2 ring-orange-500 bg-orange-500/10' 
                            : 'glass-panel hover:bg-accent/30'
                        }`}
                        onClick={() => handleSelectMeteorite(meteorite)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{meteorite.name}</h4>
                          <div className="flex gap-1">
                            <Badge variant={meteorite.type === 'comet' ? 'default' : 'secondary'} className="text-xs">
                              {meteorite.type}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMeteorite(meteorite.id);
                              }}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <span>Masse: {formatMass(meteorite.mass)}</span>
                          <span>Vitesse: {formatVelocity(meteorite.velocity)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="catalog" className="space-y-2">
                <ScrollArea className="h-48">
                  {famousMeteorites.map((meteorite) => (
                    <div
                      key={meteorite.id}
                      className="p-3 rounded-lg glass-panel hover:bg-accent/30 transition-all duration-200 mb-2"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{meteorite.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {meteorite.impactDate && meteorite.impactLocation}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={catalogTrajectories.includes(meteorite.id) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleToggleCatalogTrajectory(meteorite.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Route className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{catalogTrajectories.includes(meteorite.id) ? 'Masquer' : 'Afficher'} la trajectoire</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddFamousMeteorite(meteorite)}
                            className="h-6 text-xs"
                            disabled={meteorites.some(m => m.id === meteorite.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {meteorite.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={meteorite.type === 'comet' ? 'default' : 'secondary'} className="text-xs">
                          {meteorite.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatMass(meteorite.mass)}
                        </span>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </div>
  );
};