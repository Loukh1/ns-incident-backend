import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Incident, SeverityType } from '@/types/incident';
import { formatDistanceToNow } from 'date-fns';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface IncidentTableProps {
  incidents: Incident[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: IncidentFilters) => void;
}

export interface IncidentFilters {
  search?: string;
  severity?: string;
  status?: string;
}

const severityConfig: Record<string, { className: string }> = {
  Disaster: { className: 'bg-red-900 hover:bg-red-900/90 text-white' },
  High: { className: 'bg-red-600 hover:bg-red-600/90 text-white' },
  Average: { className: 'bg-orange-500 hover:bg-orange-500/90 text-white' },
  Warning: { className: 'bg-yellow-500 hover:bg-yellow-500/90 text-white' },
  Information: { className: 'bg-blue-500 hover:bg-blue-500/90 text-white' },
};
// Add a helper function to get severity config safely
const getSeverityConfig = (severity: string) => {
  return severityConfig[severity] || { className: 'bg-gray-500 hover:bg-gray-600' };
};

const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return 'N/A';
  
  try {
    // Check if it's the custom format: "10:48:38 on 2025.11.13"
    if (typeof dateString === 'string' && dateString.includes(' on ')) {
      const [time, datepart] = dateString.split(' on ');
      const [year, month, day] = datepart.split('.');
      
      // Create ISO format string: "2025-11-13T10:48:38"
      const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`;
      console.log('Parsing date:', dateString, '→ ISO:', isoString);
      const parsedDate = new Date(isoString);
      
      if (isNaN(parsedDate.getTime())) {
        console.error('Failed to parse date:', dateString, 'ISO:', isoString);
        return 'Invalid date';
      }
      
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    }
    
    // Try parsing as regular date
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      console.error('Failed to parse date:', dateString);
      return 'Invalid date';
    }
    
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateString);
    return 'Invalid date';
  }
};

export function IncidentTable({
  incidents,
  totalPages,
  currentPage,
  onPageChange,
  onFilterChange,
}: IncidentTableProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<IncidentFilters>({});

  const handleFilterChange = (key: keyof IncidentFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                className="pl-10"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <Select
  value={filters.severity}
  onValueChange={(value) => handleFilterChange('severity', value)}
>
  <SelectTrigger className="w-full md:w-[180px]">
    <SelectValue placeholder="All Severities" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Severities</SelectItem>
    <SelectItem value="Disaster">Disaster</SelectItem>
    <SelectItem value="High">High</SelectItem>
    <SelectItem value="Average">Average</SelectItem>
    <SelectItem value="Warning">Warning</SelectItem>
    <SelectItem value="Information">Information</SelectItem>
  </SelectContent>
</Select>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {incidents.map((incident) => (
  <TableRow
    key={incident.incidentId}  // Fixed: use incidentId instead of id
    className="cursor-pointer transition-colors hover:bg-muted/50"
    onClick={() => navigate(`/incidents/${incident.incidentId}`)}
  >
                  <TableCell className="font-medium">#{incident.incidentId}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="font-medium">{incident.subject}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {incident.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityConfig(incident.severity).className}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{incident.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(incident.timestamp)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(incident.updatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}