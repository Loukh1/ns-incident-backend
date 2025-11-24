import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { IncidentInfo } from '@/components/incident-details/IncidentInfo';
import { FixTimeline } from '@/components/incident-details/FixTimeline';
import { AddFixModal } from '@/components/incident-details/AddFixModal';
import { EditStatusModal } from '@/components/incident-details/EditStatusModal';
import { Button } from '@/components/ui/button';
import { incidentService } from '@/services/incidents';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusType, Incident, Fix } from '@/types/incident';

const IncidentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [addFixOpen, setAddFixOpen] = useState(false);
  const [editStatusOpen, setEditStatusOpen] = useState(false);

  // Fetch incident data from API
  const { data: incident, isLoading, isError } = useQuery<Incident>({
    queryKey: ['incident', id],
    queryFn: () => incidentService.getIncident(id!),
    enabled: !!id,
  });

  // Fetch fixes for this incident
  const { data: fixes = [], isLoading: fixesLoading } = useQuery<Fix[]>({
    queryKey: ['fixes', id],
    queryFn: () => incidentService.getFixesByIncident(id!),
    enabled: !!id,
  });

  // Mutation to update status
  const updateStatusMutation = useMutation({
    mutationFn: ({ incidentId, status }: { incidentId: string; status: string }) =>
      incidentService.updateIncidentStatus(incidentId, status),
    onSuccess: (updatedIncident) => {
      queryClient.setQueryData(['incident', id], updatedIncident);
      queryClient.invalidateQueries({ queryKey: ['incident', id] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      
      toast({
        title: 'Status updated',
        description: `Incident status changed to ${updatedIncident.status.replace('_', ' ')}`,
      });
      
      setEditStatusOpen(false);
    },
    onError: (error) => {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update incident status. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Mutation to add fix
  const addFixMutation = useMutation({
    mutationFn: (fix: { title: string; description: string; fixedBy: string, status: string }) =>
      incidentService.createFix(id!, fix),
    onSuccess: () => {
      // Invalidate fixes query to refetch
      queryClient.invalidateQueries({ queryKey: ['fixes', id] });
      
      toast({
        title: 'Fix added',
        description: 'The fix has been successfully recorded.',
      });
      
      setAddFixOpen(false);
    },
    onError: (error) => {
      console.error('Failed to add fix:', error);
      toast({
        title: 'Error',
        description: 'Failed to add fix. Please try again.',
        variant: 'destructive',
      });
    },
  });

  console.log('IncidentDetails - ID:', id);
  console.log('IncidentDetails - Data:', incident);
  console.log('IncidentDetails - Fixes:', fixes);
  console.log('IncidentDetails - Loading:', isLoading);
  console.log('IncidentDetails - Error:', isError);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading incident details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !incident) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Incident not found</h2>
          <p className="text-muted-foreground">The incident you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate('/incidents')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Incidents
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleAddFix = (fix: { title: string; description: string; fixedBy: string, status: string }) => {
    console.log('Adding fix:', fix);
    addFixMutation.mutate(fix);
  };

  const handleUpdateStatus = (status: StatusType) => {
    if (!id) return;
    
    console.log('Updating status to:', status);
    updateStatusMutation.mutate({ incidentId: id, status });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/incidents')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Incident #{incident.incidentId}
              </h1>
              <p className="text-muted-foreground">{incident.subject}</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setEditStatusOpen(true)}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Status
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <IncidentInfo incident={incident} />
          <FixTimeline 
            fixes={fixes} 
            onAddFix={() => setAddFixOpen(true)}
            isLoading={fixesLoading}
          />
        </div>
      </div>

      <AddFixModal
        open={addFixOpen}
        onClose={() => setAddFixOpen(false)}
        onSubmit={handleAddFix}
        isLoading={addFixMutation.isPending}
      />

      <EditStatusModal
        open={editStatusOpen}
        onClose={() => setEditStatusOpen(false)}
        currentStatus={incident.status}
        onSubmit={handleUpdateStatus}
      />
    </DashboardLayout>
  );
};

export default IncidentDetails;