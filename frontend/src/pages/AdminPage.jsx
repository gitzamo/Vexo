import React, { useEffect, useState } from 'react';
import { Users, Activity, Trophy, TrendingUp, Plus, Ban, CheckCircle2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { gamesApi } from '@/api/games';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold font-display leading-none">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(() => toast.error('Could not load platform stats.')).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={Users} label="Registered users" value={stats.registered_users} accent="bg-primary/15 text-primary" />
      <StatCard icon={Activity} label="Active users" value={stats.active_users} accent="bg-success/15 text-success" />
      <StatCard icon={Trophy} label="Active games" value={stats.active_games} accent="bg-secondary/15 text-secondary" />
      <StatCard icon={TrendingUp} label="Match success rate" value={`${Math.round(stats.success_rate * 100)}%`} accent="bg-indoor/15 text-indoor" />
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.listUsers().then((data) => setUsers(data.users)).catch(() => toast.error('Could not load users.')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleStatus = async (u) => {
    try {
      await adminApi.setUserStatus(u.id, !u.is_active);
      toast.success(`${u.name} is now ${!u.is_active ? 'active' : 'deactivated'}.`);
      load();
    } catch {
      toast.error('Could not update this user.');
    }
  };

  const updateRole = async (u, newRole) => {
    setUpdating(u.id);
    try {
      await adminApi.setUserRole(u.id, newRole);
      toast.success(`${u.name} is now a ${newRole}.`);
      load();
    } catch {
      toast.error('Could not update user role.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;

  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3 text-muted-foreground">{u.location_text || '-'}</td>
                <td className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className="capitalize cursor-pointer hover:bg-primary/10"
                      onClick={() => updateRole(u, u.role === 'admin' ? 'user' : 'admin')}
                      title="Click to toggle admin"
                    >
                      {u.role}
                    </Badge>
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant={u.is_active ? 'success' : 'destructive'}>{u.is_active ? 'Active' : 'Deactivated'}</Badge>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => toggleStatus(u)}>
                    {u.is_active ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function AdminsTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.listUsers().then((data) => {
      setUsers(data.users.filter(u => u.role === 'admin' || u.role === 'organizer'));
    }).catch(() => toast.error('Could not load users.')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateRole = async (u, newRole) => {
    setUpdating(u.id);
    try {
      await adminApi.setUserRole(u.id, newRole);
      toast.success(`${u.name} is now a ${newRole}.`);
      load();
    } catch {
      toast.error('Could not update user role.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;

  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Current Role</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3"><Badge variant="outline" className="capitalize">{u.role}</Badge></td>
                <td className="p-3 flex gap-2">
                  {u.role !== 'admin' && (
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => updateRole(u, 'admin')}
                      disabled={updating === u.id}
                    >
                      Make Admin
                    </Button>
                  )}
                  {u.role !== 'organizer' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateRole(u, 'organizer')}
                      disabled={updating === u.id}
                    >
                      Make Organizer
                    </Button>
                  )}
                  {u.role !== 'user' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateRole(u, 'user')}
                      disabled={updating === u.id}
                    >
                      Make User
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No admins or organizers yet. Promote users from the Users tab first.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GamesTab() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: 'indoor' });
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    gamesApi.list().then((data) => setGames(data.games)).catch(() => toast.error('Could not load games.')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const createGame = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      await gamesApi.create(form);
      toast.success(`${form.name} added to the catalog.`);
      setForm({ name: '', category: 'indoor' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add this game.');
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (g) => {
    try {
      await gamesApi.update(g.id, { is_active: !g.is_active });
      toast.success(`${g.name} ${g.is_active ? 'deactivated' : 'activated'}.`);
      load();
    } catch {
      toast.error('Could not update this game.');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add a game</CardTitle>
          <CardDescription>New entries appear immediately in player profile and search filters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createGame} className="flex gap-2">
            <Input placeholder="Game name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex-1" />
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={creating}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-muted-foreground">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {games.map((g) => (
                  <tr key={g.id} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium">{g.name}</td>
                    <td className="p-3"><Badge variant={g.category === 'indoor' ? 'indoor' : 'outdoor'}>{g.category}</Badge></td>
                    <td className="p-3"><Badge variant={g.is_active ? 'success' : 'pending'}>{g.is_active ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(g)}>
                        {g.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor activity and manage users, admins, and the game catalog.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="admins"><AdminsTab /></TabsContent>
        <TabsContent value="games"><GamesTab /></TabsContent>
      </Tabs>
    </div>
  );
}
