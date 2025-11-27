import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Package, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Donors = () => {
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
          <Leaf className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">For Donors (Restaurants)</h2>
        </div>
        <p className="text-muted-foreground">Turn surplus into impact. Post donations and see your contributions grow.</p>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <Package className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Easy Posting</h3>
            <p className="text-sm text-muted-foreground">Add food items with quantity, unit, pickup window, and location in minutes.</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <HeartHandshake className="w-10 h-10 text-accent mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Verified NGOs</h3>
            <p className="text-sm text-muted-foreground">NGOs accept full or partial quantities based on their requirements.</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <Leaf className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground">Contribution Credits</h3>
            <p className="text-sm text-muted-foreground">Each fulfilled donation increases your contribution count on the dashboard.</p>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button className="bg-primary" onClick={() => navigate('/auth?role=restaurant')}>Get Started</Button>
          <Button variant="outline" onClick={() => navigate('/restaurant')}>Go to Dashboard</Button>
        </div>
      </main>
    </div>
  );
};

export default Donors;