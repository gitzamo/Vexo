import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', location_text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Welcome to Vexo! Let’s set up your profile.');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create your account.');
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
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Find people nearby to play with, today.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Asha Verma" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
              </div>
              <div>
                <Label htmlFor="location_text">Locality / society (optional)</Label>
                <Input id="location_text" name="location_text" value={form.location_text} onChange={handleChange} placeholder="e.g. Green Park, Delhi" />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
