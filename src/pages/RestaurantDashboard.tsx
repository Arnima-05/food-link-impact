import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DonationsAPI, ProfilesAPI } from "@/lib/api";
import { ensureUserOrRedirect } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Leaf, LogOut, Plus, Package, Calendar, MapPin, HeartHandshake } from "lucide-react";
import DonationPostDialog from "@/components/DonationPostDialog";
import DonationCard from "@/components/DonationCard";

interface Donation {
  id: string;
  food_name: string;
  food_type: string;
  quantity: number;
  unit: string;
  description: string | null;
  pickup_time_start: string;
  pickup_time_end: string;
  expires_at: string;
  location: string;
  image_url: string | null;
  status: string;
  created_at: string;
}

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostDialog, setShowPostDialog] = useState(false);

  useEffect(() => {
    const u = ensureUserOrRedirect('restaurant');
    if (!u) {
      navigate('/auth?role=restaurant');
      return;
    }
    setUser({ id: u.id });
    fetchProfile(u.id);
    fetchDonations(u.id);
  }, [navigate]);

  const fetchProfile = async (id: string) => {
    try {
      const p = await ProfilesAPI.getById(id);
      setProfile(p);
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async (restaurantId: string) => {
    try {
      const { donations } = await DonationsAPI.listByRestaurant(restaurantId);
      setDonations(donations || []);
    } catch (error: any) {
      toast({
        title: "Error fetching donations",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate('/');
  };

  const handleDonationCreated = () => {
    setShowPostDialog(false);
    fetchDonations();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const activeDonations = donations.filter(d => d.status === 'available');
  const totalDonations = donations.length;
  const contributionsCount = (profile as any)?.contributions_count ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">FoodBridge</h1>
                <p className="text-sm text-muted-foreground">Restaurant Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{profile?.full_name}</p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <Package className="w-10 h-10 text-primary mb-3" />
            <div className="text-3xl font-bold text-foreground">{totalDonations}</div>
            <p className="text-sm text-muted-foreground">Total Donations</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <Calendar className="w-10 h-10 text-accent mb-3" />
            <div className="text-3xl font-bold text-foreground">{activeDonations.length}</div>
            <p className="text-sm text-muted-foreground">Active Donations</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <HeartHandshake className="w-10 h-10 text-primary mb-3" />
            <div className="text-3xl font-bold text-foreground">{contributionsCount}</div>
            <p className="text-sm text-muted-foreground">Contributions</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <MapPin className="w-10 h-10 text-primary mb-3" />
            <div className="text-lg font-semibold text-foreground truncate">{profile?.location}</div>
            <p className="text-sm text-muted-foreground">Your Location</p>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Button 
            size="lg" 
            onClick={() => setShowPostDialog(true)}
            className="bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Plus className="mr-2 w-5 h-5" />
            Post Food Donation
          </Button>
        </div>

        {/* Donations List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Donations</h2>
          {donations.length === 0 ? (
            <Card className="p-12 text-center bg-[var(--gradient-card)] border-border">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No donations yet</h3>
              <p className="text-muted-foreground mb-6">Start making a difference by posting your first donation</p>
              <Button onClick={() => setShowPostDialog(true)} className="bg-primary">
                <Plus className="mr-2 w-4 h-4" />
                Post Your First Donation
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((donation) => (
                <DonationCard key={donation.id} donation={donation} onUpdate={fetchDonations} />
              ))}
            </div>
          )}
        </div>
      </main>

      <DonationPostDialog 
        open={showPostDialog} 
        onOpenChange={setShowPostDialog}
        onSuccess={handleDonationCreated}
      />
    </div>
  );
};

export default RestaurantDashboard;
