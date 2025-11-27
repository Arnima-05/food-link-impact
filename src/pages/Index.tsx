import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Utensils, Heart, TrendingUp, Users, ArrowRight, Leaf, MapPin, Twitter, Instagram, Linkedin } from "lucide-react";
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
    const u = getCurrentUser();
    if (u?.role === 'restaurant') navigate('/restaurant');
    else if (u?.role === 'ngo') navigate('/ngo');
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/how-it-works')}>How It Works</Button>
            <Button variant="ghost" onClick={() => navigate('/donors')}>Donors</Button>
            <Button variant="ghost" onClick={() => navigate('/recipients')}>Recipients</Button>
            <Button variant="ghost" onClick={() => navigate('/contact-us')}>Contact Us</Button>
            <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10 pointer-events-none" />
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
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
                  onClick={() => navigate('/auth?role=restaurant')}
                  className="bg-primary hover:bg-primary/90 shadow-lg"
                >
                  Join as Restaurant <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/auth?role=ngo')}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Join as NGO
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--gradient-hero)] blur-3xl opacity-20 rounded-full pointer-events-none" />
              <div className="relative space-y-8">
                <div className="flex justify-center gap-6">
                  <img
                    src={heroImage}
                    alt="Chefs preparing surplus food"
                    className="w-36 h-36 rounded-full object-cover shadow-[var(--shadow-lg)]"
                  />
                  <img
                    src={heroImage}
                    alt="Community sharing meals"
                    className="w-36 h-36 rounded-full object-cover shadow-[var(--shadow-lg)]"
                  />
                  <img
                    src={heroImage}
                    alt="Fresh produce ready for pickup"
                    className="w-36 h-36 rounded-full object-cover shadow-[var(--shadow-lg)]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Utensils className="w-10 h-10 text-primary" />
                    <span className="mt-2 text-sm text-muted-foreground">Reduce Waste</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users className="w-10 h-10 text-primary" />
                    <span className="mt-2 text-sm text-muted-foreground">Nourish Communities</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <TrendingUp className="w-10 h-10 text-primary" />
                    <span className="mt-2 text-sm text-muted-foreground">Track Impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics Card (reference style) */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="p-8 lg:p-10 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)] rounded-2xl">
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8">
              {/* Left block: heading + metrics */}
              <div>
                <h2 className="text-3xl font-bold text-foreground">Our Impact</h2>
                <p className="text-muted-foreground mt-1">Real Change, Quantified.</p>

                <div className="mt-8 grid md:grid-cols-[220px_1fr_140px] items-center gap-8 relative">
                  {/* Donut progress */}
                  <div className="relative flex items-center justify-center">
                    <div
                      className="w-52 h-52 rounded-full"
                      style={{
                        background:
                          "conic-gradient(#22c55e 0% 75%, #e5e7eb 75% 100%)",
                      }}
                    />
                    <div className="absolute w-40 h-40 rounded-full bg-card shadow-sm flex flex-col items-center justify-center">
                      <div className="text-xs text-muted-foreground">75% of Goal</div>
                      <div className="text-xs text-muted-foreground">Achieved</div>
                      <div className="text-3xl font-bold text-foreground mt-2">
                        {stats.mealsServed.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Meals Served</div>
                    </div>
                  </div>

                  {/* Middle linked metrics */}
                  <div className="grid sm:grid-cols-1 gap-4">
                    <Card className="px-5 py-4 rounded-xl bg-card border-border flex items-center gap-3">
                      <Utensils className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-lg font-semibold text-foreground">{stats.restaurantsJoined}</div>
                        <div className="text-xs text-muted-foreground">Restaurants</div>
                      </div>
                    </Card>
                    <Card className="px-5 py-4 rounded-xl bg-card border-border flex items-center gap-3">
                      <Users className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-lg font-semibold text-foreground">{stats.ngosHelped}</div>
                        <div className="text-xs text-muted-foreground">NGOs Helped</div>
                      </div>
                    </Card>
                  </div>

                  {/* CO2 saved round badge */}
                  <div className="flex items-center justify-center">
                    <div
                      className="w-28 h-28 rounded-full bg-orange-100 border border-orange-200 shadow-sm flex flex-col items-center justify-center"
                    >
                      <TrendingUp className="w-6 h-6 text-orange-500" />
                      <div className="text-lg font-semibold text-foreground">{stats.co2Saved}t</div>
                      <div className="text-xs text-muted-foreground">Saved</div>
                    </div>
                  </div>
                </div>

                {/* Live feed bar */}
                <Card className="mt-6 bg-card/95 backdrop-blur-md border-border p-3 text-sm">
                  <div className="text-muted-foreground">Live Impact Feed</div>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <p className="text-muted-foreground">
                        New match: "Taste of Italy" → "Community" · 20 meals
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <p className="text-muted-foreground">
                        Volunteer Sarah L. completed pickup at "Green Farmacy"
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right block: heroes list placeholder */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Top Community Heroes</h3>
                <Card className="p-4 bg-card border-border flex items-center gap-3">
                  <img src={heroImage} alt="hero" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm text-foreground">Chef Alex Chen</div>
                    <div className="text-xs text-muted-foreground">320 meals donated</div>
                  </div>
                </Card>
                <Card className="p-4 bg-card border-border flex items-center gap-3">
                  <img src={heroImage} alt="hero" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm text-foreground">Chef Alex Cardwist</div>
                    <div className="text-xs text-muted-foreground">320 meals</div>
                  </div>
                </Card>
                <Card className="p-4 bg-card border-border flex items-center gap-3">
                  <img src={heroImage} alt="hero" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm text-foreground">Active Impact Zones</div>
                    <div className="text-xs text-muted-foreground">320 meals donated</div>
                  </div>
                </Card>
                <Button variant="outline" className="w-full">View Full Dashboard</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Impact Section (Reference-style) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left: Live Donation Feed */}
            <div>
              <h2 className="text-3xl font-bold text-foreground">See the Impact in Action</h2>
              <p className="text-muted-foreground mt-2">Live Donation Feed</p>
              <Card className="mt-6 p-4 shadow-[var(--shadow-card)] bg-[var(--gradient-card)] border-border">
                <div className="relative rounded-xl overflow-hidden">
                  {/* Map placeholder */}
                  <div className="aspect-video bg-muted/40 rounded-xl border border-border">
                    {/* Pins */}
                    <div className="absolute left-10 top-10">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute left-1/2 top-1/3 -translate-x-1/2">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute right-14 bottom-8">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  {/* Feed panel */}
                  <Card className="absolute left-6 top-6 w-[70%] bg-card/95 backdrop-blur-md border-border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Donation Now</span>
                      <span className="text-muted-foreground">feed</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <p className="text-muted-foreground">
                          New Match: "The Daily Brew" → "Community Shelter" · 20 mins
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <p className="text-muted-foreground">
                          Pickup Alert: Fresh food on the way to Parkview Pantry
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </div>

            {/* Right: Join Volunteer Community */}
            <div>
              <h2 className="text-3xl font-bold text-foreground">Join Our Volunteer Community</h2>
              <p className="text-muted-foreground mt-2">
                Discover roles in food rescue: on-site pickup, coordination, and outreach.
              </p>
              <Card className="mt-6 p-4 shadow-[var(--shadow-card)] bg-[var(--gradient-card)] border-border">
                <img src={heroImage} alt="Volunteers handling donations" className="rounded-lg" />
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-3">
                    <img src={heroImage} className="w-10 h-10 rounded-full object-cover" alt="volunteer" />
                    <div>
                      <div className="text-foreground text-sm font-medium">Sarah L.</div>
                      <div className="text-muted-foreground text-xs">Volunteer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={heroImage} className="w-10 h-10 rounded-full object-cover" alt="donor" />
                    <div>
                      <div className="text-foreground text-sm font-medium">Taste of Italy</div>
                      <div className="text-muted-foreground text-xs">Donor</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={heroImage} className="w-10 h-10 rounded-full object-cover" alt="ngo" />
                    <div>
                      <div className="text-foreground text-sm font-medium">Hope Foundation</div>
                      <div className="text-muted-foreground text-xs">Partner NGO</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid sm:grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Meals</div>
                    <div className="text-lg font-semibold text-foreground">150</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Community Champion</div>
                    <div className="text-lg font-semibold text-foreground">Flexligic</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                    <div className="text-lg font-semibold text-foreground">30kg</div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={() => navigate('/volunteers')} className="bg-primary hover:bg-primary/90">Learn More &amp; Sign Up</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Reference styled card */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-emerald-50 to-primary/10 dark:from-primary/10 dark:via-muted dark:to-primary/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto rounded-3xl p-12 bg-card/90 backdrop-blur-md border-border shadow-[var(--shadow-lg)] text-center">
            <h2 className="text-5xl font-bold text-foreground mb-6">Join the Movement</h2>
            <p className="text-xl text-muted-foreground mb-8">Connect, donate, and make a real difference today.</p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 shadow-[var(--shadow-lg)]"
            >
              Get Started Today
            </Button>
            <div className="mt-8 text-sm text-muted-foreground">© 2025 FoodBridge. Making every meal count.</div>
            <div className="mt-6 flex justify-center gap-4">
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/15">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/15">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/15">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </Card>
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
