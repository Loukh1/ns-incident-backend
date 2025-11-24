import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Incident } from '@/types/incident';

interface RecentIncidentsProps {
  incidents: Incident[];
}

const severityConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  Disaster: { variant: 'destructive', className: 'bg-red-900 hover:bg-red-900/90 text-white' },
  High: { variant: 'destructive', className: 'bg-red-600 hover:bg-red-600/90 text-white' },
  Average: { variant: 'default', className: 'bg-orange-500 hover:bg-orange-500/90 text-white' },
  Warning: { variant: 'default', className: 'bg-yellow-500 hover:bg-yellow-500/90 text-white' },
  Information: { variant: 'default', className: 'bg-blue-500 hover:bg-blue-500/90 text-white' },
};

// Helper function to get severity config safely
const getSeverityConfig = (severity: string) => {
  return severityConfig[severity] || { variant: 'default' as const, className: 'bg-gray-500 hover:bg-gray-600' };
};

// Helper function to safely format dates
const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return 'N/A';
  
  try {
    // Check if it's the custom format: "10:48:38 on 2025.11.13"
    if (typeof dateString === 'string' && dateString.includes(' on ')) {
      const [time, datepart] = dateString.split(' on ');
      const [year, month, day] = datepart.split('.');
      
      // Create ISO format string: "2025-11-13T10:48:38"
      const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`;
      const parsedDate = new Date(isoString);
      
      if (isNaN(parsedDate.getTime())) {
        return 'Invalid date';
      }
      
      // Use Intl for relative time formatting
      const now = new Date();
      const diffMs = now.getTime() - parsedDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffMinutes < 1) return 'just now';
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays < 30) return `${diffDays} days ago`;
      
      return parsedDate.toLocaleDateString();
    }
    
    // Try parsing as regular date
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - parsedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    
    return parsedDate.toLocaleDateString();
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateString);
    return 'Invalid date';
  }
};

export function RecentIncidents({ incidents }: RecentIncidentsProps) {
  const navigate = useNavigate();

  if (incidents.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No incidents found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => {
              const config = getSeverityConfig(incident.severity);
              
              return (
                <TableRow
                  key={incident.incidentId}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => navigate(`/incidents/${incident.incidentId}`)}
                >
                  <TableCell className="font-medium">#{incident.incidentId}</TableCell>
                  <TableCell className="max-w-xs truncate">{incident.subject}</TableCell>
                  <TableCell>
                    <Badge className={config.className}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{incident.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(incident.timestamp)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}