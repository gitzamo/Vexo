import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Zap, MapPin, Calendar, MessageSquare, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Trophy className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold">Vexo</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container space-y-8 py-20 md:py-32">
        <div className="space-y-6 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Find Your Sports Partner
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Connect with players nearby, discover new games, and never play alone again. Vexo makes it easy to find your perfect match for any sport.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Start Playing <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 pt-8 sm:grid-cols-3">
          {[
            { label: 'Active Players', value: '500+' },
            { label: 'Games Available', value: '8+' },
            { label: 'Matches Made', value: '1000+' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-card p-6 text-center">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-16 py-20">
        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl font-bold">Why Vexo?</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">Everything you need to find, connect, and play with sports partners in your area.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Users,
              title: 'Find Players',
              description: 'Search for players by location, skill level, and favorite games. Filter to find your perfect match.',
            },
            {
              icon: Zap,
              title: 'Send Play Requests',
              description: 'Send quick play requests to other players. Suggest a game, time, and location all in one message.',
            },
            {
              icon: MapPin,
              title: 'Location-Based',
              description: 'Find players and games near you. See who\'s playing in your area right now.',
            },
            {
              icon: Calendar,
              title: 'Availability',
              description: 'Set your weekly availability so others know when you\'re free to play.',
            },
            {
              icon: MessageSquare,
              title: 'Easy Communication',
              description: 'Chat with players, coordinate times, and share game details all in the app.',
            },
            {
              icon: Trophy,
              title: 'Track Games',
              description: 'Keep track of your game history and build your player profile over time.',
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="space-y-3 rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Games Section */}
      <section className="container space-y-12 py-20">
        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl font-bold">Sports We Support</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">Indoor or outdoor, individual or team sports — Vexo has them all.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            { name: 'Chess', category: 'Indoor' },
            { name: 'Badminton', category: 'Indoor' },
            { name: 'Table Tennis', category: 'Indoor' },
            { name: 'Cards', category: 'Indoor' },
            { name: 'Cricket', category: 'Outdoor' },
            { name: 'Football', category: 'Outdoor' },
            { name: 'Basketball', category: 'Outdoor' },
            { name: 'Carrom', category: 'Indoor' },
          ].map((game) => (
            <div key={game.name} className="flex items-center justify-between rounded-lg border bg-card p-4">
              <span className="font-medium">{game.name}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                game.category === 'Indoor' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-secondary/10 text-secondary'
              }`}>
                {game.category}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container space-y-8 py-20">
        <div className="rounded-xl bg-gradient-to-r from-primary to-secondary p-12 text-center text-primary-foreground space-y-6">
          <h2 className="font-display text-3xl font-bold">Ready to play?</h2>
          <p className="text-lg opacity-90">Join thousands of players finding their perfect sports match.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
                Create Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Already have an account?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Vexo. Find a partner. Play today.</p>
        </div>
      </footer>
    </div>
  );
}
