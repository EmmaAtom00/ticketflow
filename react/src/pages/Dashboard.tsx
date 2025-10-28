import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { clearSession, getSession } from '../lib/auth';
import { getTicketStats } from '../lib/tickets';
import { DecorativeCircle } from '../components/DecorativeCircle';
import { toast } from 'sonner';
import { Ticket, CheckCircle, Clock, XCircle, LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 });

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUserName(session.user.name);
    }
    setStats(getTicketStats());
  }, []);

  const handleLogout = () => {
    clearSession();
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="relative">
          <DecorativeCircle size="lg" position={{ top: '-5%', right: '5%' }} opacity={0.05} />
          <DecorativeCircle size="md" position={{ bottom: '20%', left: '-5%' }} opacity={0.05} />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Welcome back, {userName}!
                </h1>
                <p className="text-muted-foreground">
                  Here's an overview of your ticket management dashboard
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="p-6 shadow-medium hover:shadow-large transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-3xl font-bold">{stats.total}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">Total Tickets</h3>
                <p className="text-sm text-muted-foreground">All tickets in system</p>
              </Card>

              <Card className="p-6 shadow-medium hover:shadow-large transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <span className="text-3xl font-bold">{stats.open}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">Open Tickets</h3>
                <p className="text-sm text-muted-foreground">Awaiting assignment</p>
              </Card>

              <Card className="p-6 shadow-medium hover:shadow-large transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <span className="text-3xl font-bold">{stats.inProgress}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">In Progress</h3>
                <p className="text-sm text-muted-foreground">Currently being worked on</p>
              </Card>

              <Card className="p-6 shadow-medium hover:shadow-large transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <span className="text-3xl font-bold">{stats.closed}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">Closed Tickets</h3>
                <p className="text-sm text-muted-foreground">Successfully resolved</p>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-8 shadow-medium">
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/tickets')}
                  className="flex-1"
                >
                  View All Tickets
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/tickets?action=create')}
                  className="flex-1"
                >
                  Create New Ticket
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
