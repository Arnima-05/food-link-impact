import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PartialAcceptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation: {
    id: string;
    food_name: string;
    quantity: number;
    unit: string;
  };
  onAccept: (donationId: string, acceptedQuantity: number, restaurantId: string) => Promise<void>;
  restaurantId: string;
}

const PartialAcceptDialog = ({
  open,
  onOpenChange,
  donation,
  onAccept,
  restaurantId,
}: PartialAcceptDialogProps) => {
  const [acceptedQuantity, setAcceptedQuantity] = useState<number>(donation.quantity);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (acceptedQuantity <= 0 || acceptedQuantity > donation.quantity) {
      toast({
        title: "Invalid quantity",
        description: `Please enter a quantity between 1 and ${donation.quantity}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await onAccept(donation.id, acceptedQuantity, restaurantId);
      onOpenChange(false);
    } catch (error) {
      console.error("Error accepting partial donation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accept Partial Donation</DialogTitle>
          <DialogDescription>
            How much of this donation would you like to accept? The remaining will stay available for other NGOs.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="acceptedQuantity" className="text-right">
              Quantity
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="acceptedQuantity"
                type="number"
                min="1"
                max={donation.quantity}
                value={acceptedQuantity}
                onChange={(e) => setAcceptedQuantity(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                of {donation.quantity} {donation.unit}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Processing..." : "Accept Donation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartialAcceptDialog;
