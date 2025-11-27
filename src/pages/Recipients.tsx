import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Package, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Recipients = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">FoodBridge</h1>
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-accent" />
          <h2 className="text-3xl font-bold text-foreground">For Recipients (NGOs)</h2>
        </div>
        <p className="text-muted-foreground">Find available food and accept what you need to serve communities.</p>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <Package className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Browse Donations</h3>
            <p className="text-sm text-muted-foreground">Filter by food type or location to find suitable donations.</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <MapPin className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Accept & Pickup</h3>
            <p className="text-sm text-muted-foreground">Accept full or partial quantities and collect within the pickup window.</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <Heart className="w-10 h-10 text-accent mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Impact Stories</h3>
            <p className="text-sm text-muted-foreground">Share outcomes to encourage more donations and community support.</p>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button className="bg-primary" onClick={() => navigate('/auth?role=ngo')}>Get Started</Button>
          <Button variant="outline" onClick={() => navigate('/ngo')}>Go to Dashboard</Button>
        </div>
      </main>
    </div>
  );
};

export default Recipients;