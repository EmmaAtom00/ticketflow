import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Layout } from '../components/Layout';
import { WaveBackground } from '../components/WaveBackground';
import { DecorativeCircle } from '../components/DecorativeCircle';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, BarChart3, Shield } from 'lucide-react';
import { isAuthenticated } from '../lib/auth';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <DecorativeCircle size="xl" position={{ top: '-10%', right: '-10%' }} opacity={0.15} />
        <DecorativeCircle size="lg" position={{ bottom: '10%', left: '-5%' }} opacity={0.1} />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              TicketFlow
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in">
              Streamline your support workflow with modern ticket management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/auth/signup')}
                className="text-lg px-8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth/login')}
                className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
        
        <WaveBackground />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background relative">
        <DecorativeCircle size="md" position={{ top: '20%', right: '5%' }} opacity={0.05} />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose TicketFlow?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage tickets efficiently and effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 shadow-medium hover:shadow-large transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Tracking</h3>
              <p className="text-muted-foreground">
                Track all your tickets in one place with intuitive status management
              </p>
            </Card>

            <Card className="p-6 shadow-medium hover:shadow-large transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Get instant notifications and updates on ticket status changes
              </p>
            </Card>

            <Card className="p-6 shadow-medium hover:shadow-large transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-info" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Comprehensive dashboard with insights into your ticket metrics
              </p>
            </Card>

            <Card className="p-6 shadow-medium hover:shadow-large transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-muted-foreground">
                Your data is protected with enterprise-grade security measures
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-accent relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams using TicketFlow to streamline their support workflow
          </p>
          <Button size="lg" onClick={() => navigate('/auth/signup')} className="text-lg px-8">
            Create Free Account
          </Button>
        </div>
      </section>
    </Layout>
  );
}
