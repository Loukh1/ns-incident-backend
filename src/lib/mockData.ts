import { Incident, IncidentStats, Fix } from '@/types/incident';

// Mock data for development/testing
export const mockIncidents: Incident[] = [
  {
    id: 1,
    subject: 'Database Connection Timeout',
    description: 'Users experiencing timeout errors when accessing the database during peak hours.',
    severity: 'CRITICAL',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    subject: 'API Rate Limiting Issues',
    description: 'Third-party API rate limits causing service degradation.',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    subject: 'UI Alignment on Mobile Devices',
    description: 'Layout breaks on certain mobile screen sizes.',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    subject: 'Typo in Welcome Email',
    description: 'Minor spelling error in automated welcome email template.',
    severity: 'LOW',
    status: 'CLOSED',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    subject: 'Memory Leak in Background Process',
    description: 'Background worker consuming excessive memory over time.',
    severity: 'HIGH',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockStats: IncidentStats = {
  total: 42,
  open: 12,
  closed: 30,
  critical: 3,
  high: 8,
  medium: 15,
  low: 16,
  bySeverity: [
    { severity: 'CRITICAL', count: 3 },
    { severity: 'HIGH', count: 8 },
    { severity: 'MEDIUM', count: 15 },
    { severity: 'LOW', count: 16 },
  ],
  byDay: [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 4 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 7 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 5 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 8 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 6 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 9 },
    { date: new Date().toISOString().split('T')[0], count: 3 },
  ],
};

export const mockFixes: Record<number, Fix[]> = {
  1: [
    {
      id: 1,
      incidentId: 1,
      title: 'Initial Investigation',
      description: 'Identified connection pool exhaustion during peak hours.',
      fixedBy: 'John Doe',
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      incidentId: 1,
      title: 'Temporary Mitigation',
      description: 'Increased connection pool size from 10 to 25.',
      fixedBy: 'Jane Smith',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
  ],
  2: [
    {
      id: 3,
      incidentId: 2,
      title: 'Implemented Caching',
      description: 'Added Redis cache to reduce API calls by 70%.',
      fixedBy: 'Bob Johnson',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ],
  3: [
    {
      id: 4,
      incidentId: 3,
      title: 'Fixed CSS Media Queries',
      description: 'Updated responsive breakpoints for mobile devices.',
      fixedBy: 'Alice Williams',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ],
};
