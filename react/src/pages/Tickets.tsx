import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { getTickets, createTicket, updateTicket, deleteTicket } from '../lib/tickets';
import type { Ticket, TicketStatus } from '../lib/tickets';
import { DecorativeCircle } from '../components/DecorativeCircle';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const ticketSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }).max(200, { message: 'Title must be less than 200 characters' }),
  description: z.string().trim().max(1000, { message: 'Description must be less than 1000 characters' }).optional(),
  status: z.enum(['open', 'in_progress', 'closed'], { message: 'Invalid status' }),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export default function Tickets() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTicketId, setDeleteTicketId] = useState<string | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open' as TicketStatus,
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [errors, setErrors] = useState<{ title?: string; description?: string; status?: string }>({});

  useEffect(() => {
    loadTickets();
    if (searchParams.get('action') === 'create') {
      setIsCreateOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const loadTickets = () => {
    setTickets(getTickets());
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
    });
    setErrors({});
  };

  const handleCreate = () => {
    setErrors({});
    
    const result = ticketSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { title?: string; description?: string; status?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'title' | 'description' | 'status'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      createTicket(formData);
      toast.success('Ticket created successfully!');
      setIsCreateOpen(false);
      resetForm();
      loadTickets();
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority || 'medium',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingTicket) return;
    
    setErrors({});
    
    const result = ticketSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { title?: string; description?: string; status?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'title' | 'description' | 'status'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      updateTicket(editingTicket.id, formData);
      toast.success('Ticket updated successfully!');
      setIsEditOpen(false);
      resetForm();
      setEditingTicket(null);
      loadTickets();
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const handleDelete = () => {
    if (!deleteTicketId) return;
    
    try {
      deleteTicket(deleteTicketId);
      toast.success('Ticket deleted successfully!');
      setDeleteTicketId(null);
      loadTickets();
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-success/10 text-success border-success/20';
      case 'in_progress':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'closed':
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    return status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="relative">
          <DecorativeCircle size="lg" position={{ top: '10%', right: '-5%' }} opacity={0.05} />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="mb-4 gap-2 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Ticket Management</h1>
                <p className="text-muted-foreground">Create, update, and manage your support tickets</p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                New Ticket
              </Button>
            </div>

            {/* Tickets Grid */}
            {tickets.length === 0 ? (
              <Card className="p-12 text-center shadow-medium">
                <p className="text-lg text-muted-foreground mb-4">No tickets yet</p>
                <Button onClick={() => setIsCreateOpen(true)}>Create Your First Ticket</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="p-6 shadow-medium hover:shadow-large transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(ticket)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteTicketId(ticket.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{ticket.title}</h3>
                    {ticket.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {ticket.description}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Created {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
              <DialogDescription>Fill in the details to create a new support ticket</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of the issue"
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the issue"
                  rows={4}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value: TicketStatus) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) { resetForm(); setEditingTicket(null); } }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Ticket</DialogTitle>
              <DialogDescription>Update the ticket details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select value={formData.status} onValueChange={(value: TicketStatus) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditOpen(false); resetForm(); setEditingTicket(null); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteTicketId} onOpenChange={(open) => !open && setDeleteTicketId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the ticket.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout>
    </ProtectedRoute>
  );
}
