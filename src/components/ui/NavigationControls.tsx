import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Home, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Focus,
  Navigation,
  Sun,
  Earth,
  Target
} from 'lucide-react';

interface NavigationControlsProps {
  onResetCamera: () => void;
  onFocusEarth: () => void;
  onFocusSun: () => void;
  onFocusAsteroid: () => void;
  hasSelectedAsteroid: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onResetCamera,
  onFocusEarth,
  onFocusSun,
  onFocusAsteroid,
  hasSelectedAsteroid
}) => {
  return (
    <div className="fixed right-4 top-4 z-10">
      <Card className="glass-panel border-0 bg-card/10">
        <CardContent className="p-3">
          <TooltipProvider>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-center text-muted-foreground mb-2">
                Navigation
              </h3>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onResetCamera}
                    className="cosmic-button h-8 w-8 p-0"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Vue d'ensemble</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFocusSun}
                    className="h-8 w-8 p-0 hover:bg-yellow-500/20"
                  >
                    <Sun className="h-4 w-4 text-yellow-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Centrer sur le Soleil</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onFocusEarth}
                    className="h-8 w-8 p-0 hover:bg-blue-500/20"
                  >
                    <Earth className="h-4 w-4 text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Centrer sur la Terre</p>
                </TooltipContent>
              </Tooltip>

              {hasSelectedAsteroid && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onFocusAsteroid}
                      className="h-8 w-8 p-0 hover:bg-red-500/20"
                    >
                      <Target className="h-4 w-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Suivre l'astéroïde</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};