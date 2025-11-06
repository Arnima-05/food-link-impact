import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Utensils, Heart, TrendingUp, Users, ArrowRight, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-food-donation.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    mealsServed: 15420,
    restaurantsJoined: 234,
    ngosHelped: 156,
    co2Saved: 45.8
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (roleData?.role === 'restaurant') {
          navigate('/restaurant');
        } else if (roleData?.role === 'ngo') {
          navigate('/ngo');
        }
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">FoodBridge</span>
          </div>
          <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                End Food Waste,
                <span className="text-primary block">Feed Communities</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect restaurants with surplus food to NGOs that need it. Make every meal count.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-primary hover:bg-primary/90 shadow-lg"
                >
                  Join as Restaurant <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Join as NGO
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--gradient-hero)] blur-3xl opacity-20 rounded-full" />
              <img 
                src={heroImage} 
                alt="Food donation connecting restaurants to communities" 
                className="relative rounded-2xl shadow-[var(--shadow-lg)] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
              <Heart className="w-10 h-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.mealsServed.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-1">Meals Served</p>
            </Card>
            <Card className="p-6 text-center bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
              <Utensils className="w-10 h-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.restaurantsJoined}</div>
              <p className="text-sm text-muted-foreground mt-1">Restaurants</p>
            </Card>
            <Card className="p-6 text-center bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
              <Users className="w-10 h-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.ngosHelped}</div>
              <p className="text-sm text-muted-foreground mt-1">NGOs Helped</p>
            </Card>
            <Card className="p-6 text-center bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-accent" />
              <div className="text-3xl font-bold text-foreground">{stats.co2Saved}t</div>
              <p className="text-sm text-muted-foreground mt-1">CO₂ Saved</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple, efficient, impactful</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Post Available Food</h3>
              <p className="text-muted-foreground">
                Restaurants post surplus food with details, pickup times, and quantities.
              </p>
            </Card>
            
            <Card className="p-8 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Smart Matching</h3>
              <p className="text-muted-foreground">
                Our system matches donations with NGO requests based on location and need.
              </p>
            </Card>
            
            <Card className="p-8 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Feed Communities</h3>
              <p className="text-muted-foreground">
                NGOs pick up food and distribute to those in need. Everyone wins!
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--gradient-hero)] text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of restaurants and NGOs fighting food waste together.</p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-background text-primary hover:bg-background/90 shadow-lg"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 FoodBridge. Making every meal count.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
