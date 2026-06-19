import React, { useEffect, useState } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/api/users';
import { gamesApi } from '@/api/games';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    location_text: user?.location_text || '',
    location_type: user?.location_type || '',
    skill_level: user?.skill_level || 'beginner',
  });
  const [games, setGames] = useState([]);
  const [preferredGames, setPreferredGames] = useState([]);
  const [newGameId, setNewGameId] = useState('');
  const [availability, setAvailability] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingGames, setSavingGames] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);

  useEffect(() => {
    gamesApi.list().then((data) => setGames(data.games)).catch(() => {});
    userApi.getProfile(user.id).then((data) => {
      const prefs = (data.user.preferredGames || []).map((g) => ({
        game_id: g.id,
        name: g.name,
        category: g.category,
        skill_level: g.UserGamePreference?.skill_level || 'beginner',
      }));
      setPreferredGames(prefs);
      const avail = (data.user.availability || []).map((a) => ({
        day_of_week: a.day_of_week,
        start_time: a.start_time,
        end_time: a.end_time,
      }));
      setAvailability(avail);
    }).catch(() => toast.error('Could not load your full profile.'));
  }, [user.id]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const data = await userApi.updateProfile(profileForm);
      setUser({ ...user, ...data.user });
      localStorage.setItem('user', JSON.stringify({ ...user, ...data.user }));
      toast.success('Profile updated.');
      
      const refreshed = await userApi.getProfile(user.id);
      setUser(refreshed.user);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const addGame = () => {
    if (!newGameId) return;
    if (preferredGames.some((g) => g.game_id === newGameId)) {
      toast.error('You already added this game.');
      return;
    }
    const game = games.find((g) => g.id === newGameId);
    setPreferredGames([...preferredGames, { game_id: newGameId, name: game?.name, category: game?.category, skill_level: 'beginner' }]);
    setNewGameId('');
  };

  const removeGame = (game_id) => setPreferredGames(preferredGames.filter((g) => g.game_id !== game_id));

  const updateGameSkill = (game_id, skill_level) =>
    setPreferredGames(preferredGames.map((g) => (g.game_id === game_id ? { ...g, skill_level } : g)));

  const saveGames = async () => {
    setSavingGames(true);
    try {
      await userApi.setPreferredGames(preferredGames.map(({ game_id, skill_level }) => ({ game_id, skill_level })));
      toast.success('Preferred games saved.');
      
      const data = await userApi.getProfile(user.id);
      const prefs = (data.user.preferredGames || []).map((g) => ({
        game_id: g.id,
        name: g.name,
        category: g.category,
        skill_level: g.UserGamePreference?.skill_level || 'beginner',
      }));
      setPreferredGames(prefs);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save your games.');
    } finally {
      setSavingGames(false);
    }
  };

  const toggleSlot = (dayIndex) => {
    const exists = availability.find((a) => a.day_of_week === dayIndex);
    if (exists) {
      setAvailability(availability.filter((a) => a.day_of_week !== dayIndex));
    } else {
      setAvailability([...availability, { day_of_week: dayIndex, start_time: '17:00', end_time: '20:00' }]);
    }
  };

  const updateSlotTime = (dayIndex, field, value) =>
    setAvailability(availability.map((a) => (a.day_of_week === dayIndex ? { ...a, [field]: value } : a)));

  const saveAvailability = async () => {
    setSavingAvailability(true);
    try {
      await userApi.setAvailability(availability);
      toast.success('Availability saved.');
      
      const data = await userApi.getProfile(user.id);
      const avail = (data.user.availability || []).map((a) => ({
        day_of_week: a.day_of_week,
        start_time: a.start_time,
        end_time: a.end_time,
      }));
      setAvailability(avail);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save availability.');
    } finally {
      setSavingAvailability(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Keep this current so the right players can find you.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic info</CardTitle>
          <CardDescription>Your name, location, and overall skill level.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
              </div>
              <div>
                <Label>Locality / society</Label>
                <Input value={profileForm.location_text} onChange={(e) => setProfileForm({ ...profileForm, location_text: e.target.value })} placeholder="e.g. Green Park, Delhi" />
              </div>
              <div>
                <Label>Usual playing spot</Label>
                <Select value={profileForm.location_type} onValueChange={(v) => setProfileForm({ ...profileForm, location_type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select a spot" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="society_clubhouse">Society clubhouse</SelectItem>
                    <SelectItem value="local_ground">Local ground</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Overall skill level</Label>
                <Select value={profileForm.skill_level} onValueChange={(v) => setProfileForm({ ...profileForm, skill_level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={savingProfile}>
              <Save className="h-3.5 w-3.5 mr-1.5" /> {savingProfile ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferred games</CardTitle>
          <CardDescription>Games you'd like to find a partner for, with your skill in each.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newGameId} onValueChange={setNewGameId}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Add a game" /></SelectTrigger>
              <SelectContent>
                {games.filter((g) => !preferredGames.some((p) => p.game_id === g.id)).map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={addGame}><Plus className="h-4 w-4" /></Button>
          </div>

          {preferredGames.length === 0 ? (
            <p className="text-sm text-muted-foreground">No games added yet. Add one above to start matching.</p>
          ) : (
            <div className="space-y-2">
              {preferredGames.map((g) => (
                <div key={g.game_id} className="flex items-center gap-3 rounded-md border border-border p-3">
                  <Badge variant={g.category === 'indoor' ? 'indoor' : 'outdoor'} className="shrink-0">{g.name}</Badge>
                  <Select value={g.skill_level} onValueChange={(v) => updateGameSkill(g.game_id, v)}>
                    <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <button onClick={() => removeGame(g.game_id)} className="ml-auto text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button onClick={saveGames} disabled={savingGames}>
            <Save className="h-3.5 w-3.5 mr-1.5" /> {savingGames ? 'Saving...' : 'Save games'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>Pick the days you're usually free, and a rough time window.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {DAYS.map((label, idx) => {
              const active = availability.some((a) => a.day_of_week === idx);
              return (
                <button
                  key={label}
                  onClick={() => toggleSlot(idx)}
                  className={`h-10 w-12 rounded-md text-sm font-medium border transition-colors ${
                    active ? 'bg-primary text-primary-foreground border-primary' : 'border-input text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {availability.length > 0 && (
            <div className="space-y-2">
              {availability.sort((a, b) => a.day_of_week - b.day_of_week).map((slot) => (
                <div key={slot.day_of_week} className="flex items-center gap-3 text-sm">
                  <span className="w-10 font-medium">{DAYS[slot.day_of_week]}</span>
                  <Input
                    type="time"
                    className="h-8 w-32"
                    value={slot.start_time}
                    onChange={(e) => updateSlotTime(slot.day_of_week, 'start_time', e.target.value)}
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    className="h-8 w-32"
                    value={slot.end_time}
                    onChange={(e) => updateSlotTime(slot.day_of_week, 'end_time', e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <Button onClick={saveAvailability} disabled={savingAvailability}>
            <Save className="h-3.5 w-3.5 mr-1.5" /> {savingAvailability ? 'Saving...' : 'Save availability'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}