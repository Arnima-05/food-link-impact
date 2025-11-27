import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, HandHeart, Package, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
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
        <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
        <p className="text-muted-foreground">A simple, effective flow connects surplus food from restaurants to NGOs.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <Package className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground">1. Post Donation</h3>
            <p className="text-sm text-muted-foreground">Restaurants list available food with quantity, pickup window, and location.</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <HandHeart className="w-10 h-10 text-accent mb-3" />
            <h3 className="text-lg font-semibold text-foreground">2. NGOs Accept</h3>
            <p className="text-sm text-muted-foreground">NGOs browse and accept full or partial donations that meet their needs.</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <MapPin className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground">3. Pickup</h3>
            <p className="text-sm text-muted-foreground">Collection happens within the scheduled pickup window and at the specified location.</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <CheckCircle className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground">4. Contribution Credit</h3>
            <p className="text-sm text-muted-foreground">Once fulfilled, restaurants receive a contribution credit recorded on their dashboard.</p>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button className="bg-primary" onClick={() => navigate('/auth?role=restaurant')}>Join as Restaurant</Button>
          <Button variant="outline" onClick={() => navigate('/auth?role=ngo')}>Join as NGO</Button>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;