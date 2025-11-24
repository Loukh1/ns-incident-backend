import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Incident } from '@/types/incident';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface IncidentInfoProps {
  incident: Incident;
}

const severityConfig: Record<string, { className: string }> = {
  Disaster: { className: 'bg-red-900 hover:bg-red-900/90 text-white' },
  High: { className: 'bg-red-600 hover:bg-red-600/90 text-white' },
  Average: { className: 'bg-orange-500 hover:bg-orange-500/90 text-white' },
  Warning: { className: 'bg-yellow-500 hover:bg-yellow-500/90 text-white' },
  Information: { className: 'bg-blue-500 hover:bg-blue-500/90 text-white' },
};

const getSeverityConfig = (severity: string) => {
  return severityConfig[severity] || { className: 'bg-gray-500 hover:bg-gray-600' };
};

const statusIcons: Record<string, any> = {
  OPEN: AlertCircle,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle2,
  CLOSED: CheckCircle2,
};

export function IncidentInfo({ incident }: IncidentInfoProps) {
  const StatusIcon = statusIcons[incident.status] || AlertCircle;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Incident Details
          <Badge className={getSeverityConfig(incident.severity).className}>
            {incident.severity}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium text-muted-foreground">ID</label>
          <p className="text-lg font-semibold">#{incident.incidentId}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Subject</label>
          <p className="text-lg font-semibold">{incident.subject}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <p className="text-foreground whitespace-pre-wrap">{incident.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <Badge variant="outline" className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {incident.status.replace('_', ' ')}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created</label>
            <p className="text-sm">{incident.timestamp}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="text-sm">{incident.updatedAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}