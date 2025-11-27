import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DonationsAPI, MatchesAPI } from "@/lib/api";
import { ensureUserOrRedirect, getCurrentUser } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Leaf, LogOut, Search, Package, Heart, CheckCircle } from "lucide-react";
import AvailableFoodCard from "@/components/AvailableFoodCard";

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
  restaurant_id: string;
  profiles: {
    full_name: string;
    location: string;
    phone: string | null;
  };
}

const NGODashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [myMatches, setMyMatches] = useState<any[]>([]);
  const [donorBadges, setDonorBadges] = useState<Record<string, boolean>>({});
  const API_BASE = 'http://localhost:8080';

  useEffect(() => {
    const u = ensureUserOrRedirect('ngo');
    if (!u) {
      navigate('/auth');
      return;
    }
    setUser(u);
    setProfile(u.profile || null);
    fetchAvailableDonations();
    fetchMyMatches();
  }, [navigate]);

  const checkAuth = async () => {
    const u = ensureUserOrRedirect('ngo');
    if (!u) {
      navigate('/auth');
      return;
    }
    setUser(u);
    setProfile(u.profile || null);
    setLoading(false);
  };

  const fetchAvailableDonations = async () => {
    try {
      // Try server first (MongoDB)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const resp = await fetch(`${API_BASE}/api/donations/available`, { signal: controller.signal });
      clearTimeout(timeout);
      if (resp.ok) {
        const json = await resp.json();
        const mapped = (json.donations || []).map((d: any) => ({
          ...d,
          profiles: d.restaurant_profile
            ? {
                full_name: d.restaurant_profile.full_name || '',
                location: d.restaurant_profile.location || '',
                phone: d.restaurant_profile.phone || null,
              }
            : { full_name: '', location: '', phone: null },
        }));
        setDonations(mapped);
        return;
      }

      // Fallback removed: Supabase is no longer used
      const json = await DonationsAPI.listAvailable();
      const mapped = (json.donations || []).map((d: any) => ({
        ...d,
        profiles: d.restaurant_profile
          ? {
              full_name: d.restaurant_profile.full_name || '',
              location: d.restaurant_profile.location || '',
              phone: d.restaurant_profile.phone || null,
            }
          : { full_name: '', location: '', phone: null },
      }));
      setDonations(mapped);
    } catch (error: any) {
      toast({
        title: "Error fetching donations",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchMyMatches = async () => {
    try {
      const u = getCurrentUser();
      if (!u) return;
      const json = await MatchesAPI.listByNGO(u.id);
      setMyMatches(json.matches || []);
    } catch (error: any) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('foodlink_user');
    navigate('/');
  };

  const handleAcceptDonation = async (donationId: string, acceptedQuantity: number, restaurantId: string) => {
    try {
      const u = getCurrentUser();
      if (!u) return;
      // Fetch current donation state from local list
      const donation = donations.find((d) => d.id === donationId);
      if (!donation) throw new Error('Donation not found');

      // Check if the donation is still available
      if (donation.status !== 'available') {
        throw new Error('This donation is no longer available');
      }

      // Optimistic UI update BEFORE server calls
      const prevDonations = [...donations];
      if (acceptedQuantity >= donation.quantity) {
        setDonations((list) => list.filter((d) => d.id !== donationId));
      } else {
        const remaining = Number(donation.quantity) - Number(acceptedQuantity);
        setDonations((list) => list.map((d) => d.id === donationId ? { ...d, quantity: remaining } : d));
      }

      // Prefer Mongo API if available
      await DonationsAPI.accept({
        donationId,
        ngoId: u.id,
        restaurantId,
        acceptedQuantity,
      });

      toast({
        title: "Donation accepted!",
        description: `You've accepted ${acceptedQuantity} ${donation.unit} of ${donation.food_name}.`
      });

      // Mark donor badge locally so their other cards show the badge
      setDonorBadges((prev) => ({ ...prev, [restaurantId]: true }));

      // Refresh matches, and donations from server for consistency
      fetchMyMatches();
      fetchAvailableDonations();
    } catch (error: any) {
      console.error('Error accepting donation:', error);
      // Revert optimistic update on error
      setDonations(prevDonations);
      toast({
        title: "Error accepting donation",
        description: error.message,
        variant: "destructive"
      });
      throw error; // Re-throw to allow the dialog to handle the error state
    }
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

  const filteredDonations = donations.filter(d =>
    d.food_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.food_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <p className="text-sm text-muted-foreground">NGO Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/accepted-donations')}
                className="hidden sm:flex"
              >
                <Package className="w-4 h-4 mr-2" />
                My Donations
              </Button>
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
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <Package className="w-10 h-10 text-primary mb-3" />
            <div className="text-3xl font-bold text-foreground">{donations.length}</div>
            <p className="text-sm text-muted-foreground">Available Donations</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <Heart className="w-10 h-10 text-accent mb-3" />
            <div className="text-3xl font-bold text-foreground">{myMatches.length}</div>
            <p className="text-sm text-muted-foreground">Your Matches</p>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <CheckCircle className="w-10 h-10 text-primary mb-3" />
            <div className="text-3xl font-bold text-foreground">
              {myMatches.filter(m => m.status === 'fulfilled').length}
            </div>
            <p className="text-sm text-muted-foreground">Fulfilled</p>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by food type or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Available Donations */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Food Donations</h2>
          {filteredDonations.length === 0 ? (
            <Card className="p-12 text-center bg-[var(--gradient-card)] border-border">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? "No donations match your search" : "No available donations"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms" : "Check back soon for new food donations"}
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map((donation) => (
                <AvailableFoodCard
                  key={donation.id}
                  donation={donation}
                  onAccept={handleAcceptDonation}
                  hasBadge={Boolean(donorBadges[donation.restaurant_id])}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NGODashboard;
