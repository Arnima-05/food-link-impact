import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

  useEffect(() => {
    checkAuth();
    fetchAvailableDonations();
    fetchMyMatches();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roleData?.role !== 'ngo') {
        navigate('/restaurant');
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('food_donations')
        .select(`
          *,
          profiles!food_donations_restaurant_id_fkey (
            full_name,
            location,
            phone
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('ngo_id', session.user.id)
        .order('matched_at', { ascending: false });

      if (error) throw error;
      setMyMatches(data || []);
    } catch (error: any) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleAcceptDonation = async (donationId: string, restaurantId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('matches')
        .insert({
          donation_id: donationId,
          ngo_id: session.user.id,
          restaurant_id: restaurantId,
          status: 'pending'
        });

      if (error) throw error;

      // Update donation status
      await supabase
        .from('food_donations')
        .update({ status: 'reserved' })
        .eq('id', donationId);

      toast({
        title: "Donation accepted!",
        description: "You can now coordinate pickup with the restaurant."
      });

      fetchAvailableDonations();
      fetchMyMatches();
    } catch (error: any) {
      toast({
        title: "Error accepting donation",
        description: error.message,
        variant: "destructive"
      });
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
