import React, { useEffect, useState } from 'react';
import { Check, X, Ban, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { playRequestApi } from '@/api/playRequests';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const statusVariant = {
  pending: 'pending',
  accepted: 'success',
  declined: 'destructive',
  cancelled: 'pending',
  completed: 'secondary',
};

function RequestRow({ request, perspective, onRespond }) {
  const { user } = useAuth();
  const other = perspective === 'received' ? request.sender : request.receiver;
  const isReceiver = request.receiver_id === user.id;
  const canAct = request.status === 'pending' && isReceiver;
  const canCancel = request.status === 'pending' && request.sender_id === user.id;

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-medium">
            {perspective === 'received' ? `${other?.name} wants to play` : `You asked ${other?.name} to play`}{' '}
            <span className="text-primary">{request.game?.name}</span>
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {request.proposed_location && (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{request.proposed_location}</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />{format(new Date(request.createdAt), 'MMM d, h:mm a')}
            </span>
          </div>
          {request.message && <p className="mt-1.5 text-sm text-muted-foreground italic">"{request.message}"</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={statusVariant[request.status]} className="capitalize">{request.status}</Badge>
          {canAct && (
            <>
              <Button size="sm" variant="outline" onClick={() => onRespond(request.id, 'declined')}>
                <X className="h-3.5 w-3.5 mr-1" /> Decline
              </Button>
              <Button size="sm" onClick={() => onRespond(request.id, 'accepted')}>
                <Check className="h-3.5 w-3.5 mr-1" /> Accept
              </Button>
            </>
          )}
          {canCancel && (
            <Button size="sm" variant="ghost" onClick={() => onRespond(request.id, 'cancelled')}>
              <Ban className="h-3.5 w-3.5 mr-1" /> Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await playRequestApi.list();
      setRequests(data.requests);
    } catch {
      toast.error('Could not load your play requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRespond = async (id, status) => {
    try {
      await playRequestApi.respond(id, status);
      const messages = {
        accepted: 'Request accepted — see you on the court!',
        declined: 'Request declined.',
        cancelled: 'Request cancelled.',
      };
      toast.success(messages[status] || 'Request updated.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update the request.');
    }
  };

  const received = requests.filter((r) => r.receiver_id === user.id);
  const sent = requests.filter((r) => r.sender_id === user.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Play requests</h1>
        <p className="text-sm text-muted-foreground mt-1">Accept, decline, or track requests you've sent.</p>
      </div>

      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">Received {received.length > 0 && `(${received.length})`}</TabsTrigger>
          <TabsTrigger value="sent">Sent {sent.length > 0 && `(${sent.length})`}</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : received.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No requests yet. Once someone wants to play, it'll show up here.</CardContent></Card>
          ) : (
            received.map((r) => <RequestRow key={r.id} request={r} perspective="received" onRespond={handleRespond} />)
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : sent.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">You haven't sent any requests yet. Head to Discover to find a partner.</CardContent></Card>
          ) : (
            sent.map((r) => <RequestRow key={r.id} request={r} perspective="sent" onRespond={handleRespond} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}