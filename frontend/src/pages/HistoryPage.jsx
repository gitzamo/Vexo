import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Clock } from 'lucide-react';
import { userApi } from '@/api/users';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const statusVariant = {
  pending: 'pending',
  accepted: 'success',
  declined: 'destructive',
  cancelled: 'pending',
  completed: 'secondary',
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getHistory()
      .then((data) => setRequests(data.requests))
      .catch(() => toast.error('Could not load your match history.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Match history</h1>
        <p className="text-sm text-muted-foreground mt-1">Every play request you've sent or received.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : requests.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No games yet, once you send or accept a request, it'll show up here.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const other = r.sender_id === user.id ? r.receiver : r.sender;
            return (
              <Card key={r.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium">
                      {r.game?.name} with <span className="text-primary">{other?.name}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {r.proposed_location && (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.proposed_location}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{format(new Date(r.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>
                  <Badge variant={statusVariant[r.status]} className="capitalize">{r.status}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
