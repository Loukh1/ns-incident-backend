export type SeverityType = 'Information' | 'Warning' | 'Average' | 'High' | 'Disaster';
export type StatusType = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Incident {
  incidentId: string;
  subject: string;
  description: string;
  severity: SeverityType;
  status: StatusType;
  timestamp: string;
  updatedAt: string;
}

export interface Fix {
  id: number;
  incidentId: number;
  title: string;
  description: string;
  status: string;
  fixedBy: string;
  createdAt: string;
}

export interface IncidentStats {
  total: number;
  open: number;
  closed: number;
  
  // Individual severity counts matching your backend
  disaster: number;      // Maps to "Disaster"
  high: number;          // Maps to "High"
  average: number;       // Maps to "Average"
  warning: number;       // Maps to "Warning"
  information: number;   // Maps to "Information"
  
  // For backward compatibility (if needed)
  critical?: number;     // Optional - can map to disaster
  medium?: number;       // Optional - can map to average
  low?: number;          // Optional - can map to information
  
  bySeverity: {
    severity: string;    // Changed from SeverityType to string for flexibility
    count: number;
  }[];
  byDay: {
    date: string;
    count: number;
  }[];
}
