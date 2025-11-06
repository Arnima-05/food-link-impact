import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const donationSchema = z.object({
  foodName: z.string().trim().min(2, "Food name is required").max(200),
  foodType: z.string().trim().min(2, "Food type is required").max(100),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().trim().min(1, "Unit is required").max(50),
  description: z.string().trim().max(1000).optional(),
  pickupTimeStart: z.string().min(1, "Pickup start time is required"),
  pickupTimeEnd: z.string().min(1, "Pickup end time is required"),
  expiresAt: z.string().min(1, "Expiry time is required"),
  location: z.string().trim().min(2, "Location is required").max(200)
});

interface DonationPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DonationPostDialog = ({ open, onOpenChange, onSuccess }: DonationPostDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    foodName: "",
    foodType: "",
    quantity: "",
    unit: "kg",
    description: "",
    pickupTimeStart: "",
    pickupTimeEnd: "",
    expiresAt: "",
    location: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = donationSchema.parse({
        ...formData,
        quantity: parseFloat(formData.quantity)
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('food_donations')
        .insert({
          restaurant_id: session.user.id,
          food_name: validated.foodName,
          food_type: validated.foodType,
          quantity: validated.quantity,
          unit: validated.unit,
          description: validated.description || null,
          pickup_time_start: validated.pickupTimeStart,
          pickup_time_end: validated.pickupTimeEnd,
          expires_at: validated.expiresAt,
          location: validated.location
        });

      if (error) throw error;

      toast({
        title: "Donation posted!",
        description: "Your food donation is now available for NGOs."
      });

      setFormData({
        foodName: "",
        foodType: "",
        quantity: "",
        unit: "kg",
        description: "",
        pickupTimeStart: "",
        pickupTimeEnd: "",
        expiresAt: "",
        location: ""
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error posting donation",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Food Donation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="foodName">Food Name *</Label>
              <Input
                id="foodName"
                value={formData.foodName}
                onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                placeholder="e.g., Fresh Sandwiches"
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foodType">Food Type *</Label>
              <Input
                id="foodType"
                value={formData.foodType}
                onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                placeholder="e.g., Prepared Meals, Bakery"
                required
                maxLength={100}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="kg, portions, boxes"
                required
                maxLength={50}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about the food..."
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupTimeStart">Pickup Start Time *</Label>
              <Input
                id="pickupTimeStart"
                type="datetime-local"
                value={formData.pickupTimeStart}
                onChange={(e) => setFormData({ ...formData, pickupTimeStart: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupTimeEnd">Pickup End Time *</Label>
              <Input
                id="pickupTimeEnd"
                type="datetime-local"
                value={formData.pickupTimeEnd}
                onChange={(e) => setFormData({ ...formData, pickupTimeEnd: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Food Expires At *</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Pickup Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Full address for pickup"
              required
              maxLength={200}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Donation"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DonationPostDialog;
