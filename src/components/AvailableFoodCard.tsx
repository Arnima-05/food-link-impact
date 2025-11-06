import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Package, Clock, Phone, Building } from "lucide-react";
import { format } from "date-fns";
import PartialAcceptDialog from "./PartialAcceptDialog";

interface AvailableFoodCardProps {
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
    restaurant_id: string;
    profiles: {
      full_name: string;
      location: string;
      phone: string | null;
    };
  };
  onAccept: (donationId: string, acceptedQuantity: number, restaurantId: string) => Promise<void>;
}

const AvailableFoodCard = ({ donation, onAccept }: AvailableFoodCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-all">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{donation.food_name}</h3>
          <p className="text-sm text-muted-foreground">{donation.food_type}</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{donation.quantity} {donation.unit}</span>
        </div>

        {donation.description && (
          <p className="text-sm text-muted-foreground">{donation.description}</p>
        )}

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Building className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{donation.profiles.full_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{donation.location}</span>
          </div>
          {donation.profiles.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{donation.profiles.phone}</span>
            </div>
          )}
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

        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Accept Donation
          </Button>
          <Button 
            variant="outline"
            onClick={() => onAccept(donation.id, donation.quantity, donation.restaurant_id)}
            className="w-full"
          >
            Accept Full {donation.quantity} {donation.unit}
          </Button>
        </div>
        
        <PartialAcceptDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          donation={donation}
          onAccept={onAccept}
          restaurantId={donation.restaurant_id}
        />
      </div>
    </Card>
  );
};

export default AvailableFoodCard;
