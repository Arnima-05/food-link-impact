import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Leaf, MapPin, Clock, Truck, Heart } from "lucide-react";

const Volunteers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interests, setInterests] = useState({ pickup: false, coordination: false, outreach: false });
  const [vehicleAccess, setVehicleAccess] = useState("no");
  const [availability, setAvailability] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    toast({
      title: "Volunteer application submitted",
      description: "Thanks for joining! We’ll reach out with next steps.",
    });

    console.log("Volunteer signup:", { ...payload, interests, vehicleAccess, availability });
    form.reset();
    setInterests({ pickup: false, coordination: false, outreach: false });
    setVehicleAccess("no");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Nav (simple) */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">FoodBridge</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
            <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Volunteer with FoodBridge</h1>
            <p className="mt-3 text-muted-foreground text-lg">Help rescue surplus food and deliver it to local communities. Flexible roles, real impact.</p>

            <Card className="mt-6 p-6 bg-[var(--gradient-card)] border-border">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Truck className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">Food Pickup & Delivery</div>
                    <div className="text-sm text-muted-foreground">Pick up donations and transport them safely to NGOs.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">Flexible Scheduling</div>
                    <div className="text-sm text-muted-foreground">Choose weekdays, weekends, or evenings that work for you.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">Neighborhood Coordination</div>
                    <div className="text-sm text-muted-foreground">Help match donors with nearby recipients and optimize routes.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">Community Outreach</div>
                    <div className="text-sm text-muted-foreground">Spread the word, recruit volunteers, and promote food-rescue events.</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Signup Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-foreground">Volunteer Sign Up</h2>
            <p className="text-sm text-muted-foreground mb-4">Share a few details and we’ll connect you with nearby opportunities.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required placeholder="Jane Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" name="phone" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="location">City / Area</Label>
                  <Input id="location" name="location" required placeholder="San Francisco, CA" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Availability</Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="evenings">Evenings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vehicle Access</Label>
                  <RadioGroup value={vehicleAccess} onValueChange={setVehicleAccess} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="vehicle-yes" />
                      <Label htmlFor="vehicle-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="vehicle-no" />
                      <Label htmlFor="vehicle-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <Label>Interests</Label>
                <div className="mt-2 grid sm:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pickup" checked={interests.pickup} onCheckedChange={(v) => setInterests(s => ({ ...s, pickup: Boolean(v) }))} />
                    <Label htmlFor="pickup">Pickup</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="coordination" checked={interests.coordination} onCheckedChange={(v) => setInterests(s => ({ ...s, coordination: Boolean(v) }))} />
                    <Label htmlFor="coordination">Coordination</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="outreach" checked={interests.outreach} onCheckedChange={(v) => setInterests(s => ({ ...s, outreach: Boolean(v) }))} />
                    <Label htmlFor="outreach">Outreach</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Tell us about your schedule, skills, or interests" />
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button type="submit" className="bg-primary hover:bg-primary/90">Submit Application</Button>
                <Button type="button" variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Volunteers;
