import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IncidentTable, IncidentFilters } from '@/components/incidents/IncidentTable';
import { incidentService } from '@/services/incidents';
import { Incident } from '@/types/incident';

const IncidentsList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<IncidentFilters>({});

  const { data, isLoading, isError, error } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: () => incidentService.getIncidents(),
  });

  useEffect(() => {
    if (data) {
      console.log('✅ Full response received:', data);
      console.log('📊 Total incidents:', data.length);
      console.log('📝 Incidents array:', data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      console.error('❌ Error loading incidents:', error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isLoading) {
      console.log('⏳ Loading incidents...');
    }
  }, [isLoading]);

  // Filter incidents based on the current filters
  const filteredIncidents = useMemo(() => {
    if (!data) return [];

    return data.filter((incident) => {
      // Search filter - search in subject and description
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          incident.subject.toLowerCase().includes(searchLower) ||
          incident.description.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Severity filter
      if (filters.severity && filters.severity !== 'all') {
        if (incident.severity !== filters.severity) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (incident.status !== filters.status) return false;
      }

      return true;
    });
  }, [data, filters]);

  console.log('🎯 Rendering with incidents:', filteredIncidents);
  console.log('🎯 Number of incidents to render:', filteredIncidents.length);
  console.log('🔍 Active filters:', filters);

  if (isLoading) return <p>Loading incidents...</p>;
  if (isError) return <p>Error loading incidents.</p>;

  const totalPages = 1;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground">
            Manage and track all incidents across your system.
          </p>
        </div>

        <IncidentTable
          incidents={filteredIncidents}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onFilterChange={setFilters}
        />
      </div>
    </DashboardLayout>
  );
};

export default IncidentsList;