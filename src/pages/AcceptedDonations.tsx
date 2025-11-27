import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MatchesAPI } from "@/lib/api";
import { ensureUserOrRedirect } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, MapPin, Package, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

export interface AcceptedDonation {
  id: string;
  donation_id: string;
  ngo_id: string;
  restaurant_id: string;
  status: 'pending' | 'scheduled' | 'picked_up' | 'cancelled';
  matched_at: string;
  picked_up_at: string | null;
  accepted_quantity: number;
  original_quantity: number;
  food_donations: {
    food_name: string;
    food_type: string;
    description: string | null;
    pickup_time_start: string;
    pickup_time_end: string;
    expires_at: string;
    location: string;
    unit: string;
    profiles: {
      full_name: string;
      phone: string | null;
      email: string;
    };
  };
}

const AcceptedDonations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donations, setDonations] = useState<AcceptedDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const u = ensureUserOrRedirect('ngo');
    if (!u) {
      navigate('/auth?role=ngo');
      return;
    }
    fetchAcceptedDonations(u.id);
  }, []);

  const fetchAcceptedDonations = async (ngoId: string) => {
    try {
      const { matches } = await MatchesAPI.listByNGO(ngoId);
      const valid = (matches || []).filter((m: any) => m.food_donations !== null);
      setDonations(valid as unknown as AcceptedDonation[]);
    } catch (error: any) {
      console.error('Error fetching accepted donations:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (id: string, status: 'scheduled' | 'picked_up' | 'cancelled') => {
    try {
      setUpdating(id);
      
      // Optimistically update the UI
      setDonations(currentDonations => 
        currentDonations.map(donation => 
          donation.id === id 
            ? { 
                ...donation, 
                status,
                ...(status === 'picked_up' ? { picked_up_at: new Date().toISOString() } : {})
              } 
            : donation
        )
      );
      
      // Update the database
      const { match } = await MatchesAPI.updateStatus(id, status);
      setDonations(currentDonations => 
        currentDonations.map(donation => 
          // our match id may be `_id`
          ((donation as any)._id || donation.id) === id 
            ? { ...(match as any) } as AcceptedDonation
            : donation
        )
      );
      
      toast({
        title: "Success",
        description: `Donation marked as ${status.replace('_', ' ')}`
      });
    } catch (error: any) {
      console.error('Error updating donation status:', error);
      
      // Revert optimistic update on error
      await fetchAcceptedDonations();
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      scheduled: { text: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
      picked_up: { text: 'Picked Up', color: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Cancelled', color: 'bg-red-100 text-red-800' },
    };
    
    const statusInfo = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  const filteredDonations = donations.filter(d => 
    d.food_donations.food_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.food_donations.food_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.food_donations.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)}
                className="md:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Your Accepted Donations</h1>
                <p className="text-sm text-muted-foreground">Manage and track your food donations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              placeholder="Search by food name, type, or donor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Donations List */}
        <div className="space-y-6">
          {filteredDonations.length === 0 ? (
            <Card className="p-12 text-center bg-[var(--gradient-card)] border-border">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? "No matching donations found" : "No accepted donations yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Accept donations from the main dashboard to see them here"}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => navigate('/ngo')} 
                  className="mt-4"
                >
                  Browse Available Donations
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDonations.map((donation) => (
                <Card key={donation.id} className="overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {donation.food_donations.food_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {donation.food_donations.food_type}
                        </p>
                      </div>
                      {getStatusBadge(donation.status)}
                    </div>

                    <div className="pt-2 space-y-2 border-t border-border">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {donation.accepted_quantity} {donation.food_donations.unit} accepted
                        </span>
                        {donation.original_quantity > donation.accepted_quantity && (
                          <span className="text-xs text-muted-foreground">
                            (of {donation.original_quantity} {donation.food_donations.unit})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          {donation.food_donations.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          {format(new Date(donation.food_donations.pickup_time_start), 'MMM dd, yyyy')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          {format(new Date(donation.food_donations.pickup_time_start), 'h:mm a')} - {format(new Date(donation.food_donations.pickup_time_end), 'h:mm a')}
                        </span>
                      </div>
                    </div>

                    {donation.food_donations.description && (
                      <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                        {donation.food_donations.description}
                      </p>
                    )}

                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-medium text-foreground mb-2">Donor Information</h4>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{donation.food_donations.profiles.full_name}</p>
                        <p className="text-muted-foreground">{donation.food_donations.profiles.email}</p>
                        {donation.food_donations.profiles.phone && (
                          <p className="text-muted-foreground">{donation.food_donations.profiles.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {donation.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => updateDonationStatus(donation.id, 'scheduled')}
                              disabled={updating === donation.id}
                              className="flex-1"
                            >
                              {updating === donation.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4 mr-2" />
                              )}
                              Mark as Scheduled
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateDonationStatus(donation.id, 'cancelled')}
                              disabled={updating === donation.id}
                              className="flex-1"
                            >
                              {updating === donation.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4 mr-2" />
                              )}
                              Cancel Pickup
                            </Button>
                          </>
                        )}
                        
                        {donation.status === 'scheduled' && (
                          <Button 
                            className="w-full" 
                            onClick={() => updateDonationStatus(donation.id, 'picked_up')}
                            disabled={updating === donation.id}
                          >
                            {updating === donation.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            Mark as Picked Up
                          </Button>
                        )}

                        {donation.status === 'picked_up' && (
                          <div className="w-full text-center py-2 text-sm text-green-600">
                            Successfully picked up on {format(new Date(donation.picked_up_at!), 'MMM dd, yyyy')}
                          </div>
                        )}

                        {donation.status === 'cancelled' && (
                          <div className="w-full text-center py-2 text-sm text-amber-600">
                            Pickup was cancelled
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AcceptedDonations;
