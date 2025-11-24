import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SeverityChart } from '@/components/dashboard/SeverityChart';
import { DailyIncidentsChart } from '@/components/dashboard/DailyIncidentsChart';
import { RecentIncidents } from '@/components/dashboard/RecentIncidents';
import { AlertCircle, CheckCircle, XCircle, Activity, Loader2 } from 'lucide-react';
import { incidentService } from '@/services/incidents';
import { IncidentStats, Incident } from '@/types/incident';

const Dashboard = () => {
  // Fetch statistics from API
  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery<IncidentStats>({
    queryKey: ['incidentStats'],
    queryFn: () => incidentService.getStatistics(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch recent incidents
  const { data: allIncidents, isLoading: incidentsLoading } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: () => incidentService.getIncidents(),
  });

  // Get the 5 most recent incidents
  const recentIncidents = allIncidents?.slice(0, 5) || [];

  // Loading state
  if (statsLoading || incidentsLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (statsError || !stats) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">Failed to load statistics. Please try again.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your incidents.
          </p>
        </div>

        {/* Stats Grid */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  <StatsCard
    title="Total Incidents"
    value={stats.total}
    icon={Activity}
    variant="primary"
  />
  <StatsCard
    title="Open Incidents"
    value={stats.open}
    icon={AlertCircle}
    variant="warning"
  />
  <StatsCard
    title="Closed Incidents"
    value={stats.closed}
    icon={CheckCircle}
    variant="success"
  />
  <StatsCard
    title="Disaster Issues"
    value={stats.disaster}
    icon={XCircle}
    variant="critical"
  />
</div>

        {/* Severity Breakdown Grid */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
  <StatsCard
    title="Disaster"
    value={stats.disaster}
    icon={AlertCircle}
    variant="critical"
  />
  <StatsCard
    title="High Priority"
    value={stats.high}
    icon={AlertCircle}
    variant="warning"
  />
  <StatsCard
    title="Average"
    value={stats.average}
    icon={AlertCircle}
    variant="warning"
  />
  <StatsCard
    title="Warning"
    value={stats.warning}
    icon={AlertCircle}
    variant="warning"
  />
  <StatsCard
    title="Information"
    value={stats.information}
    icon={AlertCircle}
    variant="success"
  />
</div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SeverityChart stats={stats} />
          <DailyIncidentsChart stats={stats} />
        </div>

        {/* Recent Incidents Table */}
        <RecentIncidents incidents={recentIncidents} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;