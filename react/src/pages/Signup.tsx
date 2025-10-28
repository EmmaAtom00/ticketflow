import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Layout } from '../components/Layout';
import { toast } from 'sonner';
import { saveSession, isAuthenticated } from '../lib/auth';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }).max(100, { message: 'Name must be less than 100 characters' }),
  email: z.string().trim().email({ message: 'Invalid email address' }).max(255, { message: 'Email must be less than 255 characters' }),
  password: z.string().trim().min(6, { message: 'Password must be at least 6 characters' }).max(100, { message: 'Password must be less than 100 characters' }),
});

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = signupSchema.safeParse({ name, email, password });
      
      if (!result.success) {
        const fieldErrors: { name?: string; email?: string; password?: string } = {};
        result.error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as 'name' | 'email' | 'password'] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // Check if user already exists
      const usersStr = localStorage.getItem('ticketapp_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      if (users.some((u: any) => u.email === email)) {
        toast.error('An account with this email already exists');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password, // In production, this should be hashed
      };

      users.push(newUser);
      localStorage.setItem('ticketapp_users', JSON.stringify(users));

      // Create session
      const session = {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        token: crypto.randomUUID(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      saveSession(session);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="max-w-[1440px] w-full mx-auto">
          <Card className="max-w-md mx-auto shadow-large">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Enter your information to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  onClick={() => navigate('/auth/login')}
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
