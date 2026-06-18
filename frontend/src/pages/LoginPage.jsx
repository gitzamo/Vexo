import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate('/discover');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not log in. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trophy className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold">Vexo</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Log in to find your next game.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              New here?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
