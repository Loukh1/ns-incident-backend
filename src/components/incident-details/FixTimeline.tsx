import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fix } from '@/types/incident';
import { format } from 'date-fns';
import { Plus, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface FixTimelineProps {
  fixes: Fix[];
  onAddFix: () => void;
  isLoading?: boolean;
}

// Status configuration with colors and icons
const statusConfig = {
  SUCCESS: {
    label: 'Success',
    className: 'bg-green-500 hover:bg-green-600 text-white',
    icon: CheckCircle2,
  },
  FAILED: {
    label: 'Failed',
    className: 'bg-red-500 hover:bg-red-600 text-white',
    icon: XCircle,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-blue-500 hover:bg-blue-600 text-white',
    icon: Clock,
  },
};

export function FixTimeline({ fixes, onAddFix, isLoading = false }: FixTimelineProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fix Timeline</CardTitle>
        <Button size="sm" onClick={onAddFix} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Fix
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">Loading fixes...</p>
          </div>
        ) : (
          <div className="relative space-y-6">
            {/* Vertical line */}
            {fixes.length > 0 && (
              <div className="absolute left-4 top-2 h-[calc(100%-2rem)] w-0.5 bg-border" />
            )}
            
            {fixes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No fixes recorded yet. Click "Add Fix" to create one.
              </p>
            ) : (
              fixes.map((fix) => {
                const config = statusConfig[fix.status as keyof typeof statusConfig] || statusConfig.IN_PROGRESS;
                const StatusIcon = config.icon;
                
                return (
                  <div key={fix.id} className="relative pl-12">
                    {/* Circle marker */}
                    <div className="absolute left-2.5 top-2 h-3 w-3 rounded-full border-2 border-primary bg-card" />
                    
                    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{fix.title}</h4>
                            <Badge className={config.className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {fix.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{format(new Date(fix.createdAt), 'PPp')}</span>
                        <span>•</span>
                        <span>By {fix.fixedBy}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}