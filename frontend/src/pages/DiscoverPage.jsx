import React, { useEffect, useState } from 'react';
import { Search, MapPin, Send } from 'lucide-react';
import { userApi } from '@/api/users';
import { gamesApi } from '@/api/games';
import { playRequestApi } from '@/api/playRequests';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function initials(name = '') {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function DiscoverPage() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', game_id: '', skill_level: '' });
  const [requestTarget, setRequestTarget] = useState(null);
  const [requestForm, setRequestForm] = useState({ game_id: '', proposed_location: '', message: '' });
  const [sending, setSending] = useState(false);

  const loadGames = async () => {
    try {
      const data = await gamesApi.list();
      setGames(data.games);
    } catch {
      // non-fatal; filters just won't have game options
    }
  };

  const search = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.location) params.location = filters.location;
      if (filters.game_id) params.game_id = filters.game_id;
      if (filters.skill_level) params.skill_level = filters.skill_level;
      const data = await userApi.search(params);
      setPlayers(data.players);
    } catch {
      toast.error('Could not load players. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
    search();
  }, []);

  const openRequestDialog = (player) => {
    setRequestTarget(player);
    setRequestForm({ game_id: player.preferredGames?.[0]?.id || '', proposed_location: '', message: '' });
  };

  const sendRequest = async () => {
    if (!requestForm.game_id) {
      toast.error('Pick a game to play first.');
      return;
    }
    setSending(true);
    try {
      await playRequestApi.send({
        receiver_id: requestTarget.id,
        game_id: requestForm.game_id,
        proposed_location: requestForm.proposed_location,
        message: requestForm.message,
      });
      toast.success(`Play request sent to ${requestTarget.name}.`);
      setRequestTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send the request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Discover players</h1>
        <p className="text-sm text-muted-foreground mt-1">Find someone nearby for a game today.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Locality or society"
                className="pl-9"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            <Select value={filters.game_id} onValueChange={(v) => setFilters({ ...filters, game_id: v })}>
              <SelectTrigger><SelectValue placeholder="Any game" /></SelectTrigger>
              <SelectContent>
                {games.map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.skill_level} onValueChange={(v) => setFilters({ ...filters, skill_level: v })}>
              <SelectTrigger><SelectValue placeholder="Any skill level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={search} className="md:w-auto">
              <Search className="h-4 w-4 mr-1.5" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No players match these filters yet. Try widening your search, or check back soon — new players join Vexo often.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {players.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-base">{initials(p.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-display font-semibold leading-tight">{p.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {p.location_text || 'Location not set'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize shrink-0">{p.skill_level}</Badge>
                </div>

                {/* Signature element: scorecard-style game chip row, color-coded by indoor/outdoor */}
                {p.preferredGames?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.preferredGames.map((g) => (
                      <Badge key={g.id} variant={g.category === 'indoor' ? 'indoor' : 'outdoor'}>
                        {g.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => openRequestDialog(p)}
                  disabled={!p.preferredGames || p.preferredGames.length === 0}
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" /> Send play request
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!requestTarget} onOpenChange={(open) => !open && setRequestTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Play request to {requestTarget?.name}</DialogTitle>
            <DialogDescription>Suggest a game, place, and a short note.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Game</Label>
              <Select value={requestForm.game_id} onValueChange={(v) => setRequestForm({ ...requestForm, game_id: v })}>
                <SelectTrigger><SelectValue placeholder="Choose a game" /></SelectTrigger>
                <SelectContent>
                  {requestTarget?.preferredGames?.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Suggested location</Label>
              <Input
                placeholder="e.g. Society clubhouse"
                value={requestForm.proposed_location}
                onChange={(e) => setRequestForm({ ...requestForm, proposed_location: e.target.value })}
              />
            </div>
            <div>
              <Label>Message (optional)</Label>
              <Textarea
                placeholder="Hey! Up for a game this weekend?"
                value={requestForm.message}
                onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestTarget(null)}>Cancel</Button>
            <Button onClick={sendRequest} disabled={sending}>
              {sending ? 'Sending...' : 'Send request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
