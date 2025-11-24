import { api } from './api';
import { Incident, IncidentStats, Fix, StatusType } from '@/types/incident';

export const incidentService = {
  // Get all incidents with optional filters
  getIncidents: async () => {
  const response = await api.get<Incident[]>('/incidents');
  return response.data;
},

  // Get incident statistics
  getStats: async () => {
    const response = await api.get<IncidentStats>('/incidents/stats');
    return response.data;
  },

  // Get latest incidents
  getLatest: async (limit: number = 5) => {
    const response = await api.get<Incident[]>('/incidents', {
      params: { limit },
    });
    return response.data;
  },

  // Get single incident by ID
  getIncident: async (id: string) => {
    const response = await api.get<Incident>(`/incidents/${id}`);
    return response.data;
  },

  // Get fixes for an incident
  getFixes: async (incidentId: number) => {
    const response = await api.get<Fix[]>(`/incidents/${incidentId}/fixes`);
    return response.data;
  },

  // Add a fix to an incident
  addFix: async (incidentId: number, fix: Omit<Fix, 'id' | 'incidentId' | 'createdAt'>) => {
    const response = await api.post<Fix>(`/incidents/${incidentId}/fixes`, fix);
    return response.data;
  },

  // Update incident status
  updateIncidentStatus: async (id: string, status: string) => {
    const response = await api.put<Incident>(`/incidents/${id}/status`, { status });
    return response.data;
  },
  getFixesByIncident: async (incidentId: string) => {
    const response = await api.get<Fix[]>(`/incidents/${incidentId}/fixes`);
    return response.data;
  },
  
  createFix: async (incidentId: string, fix: { title: string; description: string; fixedBy: string, status: string }) => {
    const response = await api.post<Fix>(`/incidents/${incidentId}/fixes`, fix);
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get<IncidentStats>('/incidents/stats');
    return response.data;
  },
};
