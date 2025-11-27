import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Package, Clock } from "lucide-react";
import { format } from "date-fns";
import { DonationsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DonationCardProps {
  donation: {
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
    status: string;
    created_at: string;
  };
  onUpdate: () => void;
}

const DonationCard = ({ donation, onUpdate }: DonationCardProps) => {
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'reserved':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'fulfilled':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleMarkFulfilled = async () => {
    try {
      await DonationsAPI.fulfill(donation.id);

      toast({
        title: "Marked as fulfilled",
        description: "Great job helping the community!"
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error updating donation",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-all">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{donation.food_name}</h3>
            <p className="text-sm text-muted-foreground">{donation.food_type}</p>
          </div>
          <Badge className={getStatusColor(donation.status)}>
            {donation.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="w-4 h-4" />
          <span>{donation.quantity} {donation.unit}</span>
        </div>

        {donation.description && (
          <p className="text-sm text-muted-foreground">{donation.description}</p>
        )}

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{donation.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              Pickup: {format(new Date(donation.pickup_time_start), 'MMM dd, HH:mm')} - {format(new Date(donation.pickup_time_end), 'HH:mm')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">
              Expires: {format(new Date(donation.expires_at), 'MMM dd, HH:mm')}
            </span>
          </div>
        </div>

        {donation.status === 'reserved' && (
          <Button 
            onClick={handleMarkFulfilled}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Mark as Fulfilled
          </Button>
        )}
      </div>
    </Card>
  );
};

export default DonationCard;
