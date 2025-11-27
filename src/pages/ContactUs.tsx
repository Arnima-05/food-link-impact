import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">FoodBridge</h1>
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <h2 className="text-3xl font-bold text-foreground">Contact Us</h2>
        <p className="text-muted-foreground">Questions, feedback, or partnerships — we’d love to hear from you.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-foreground mb-4">Reach Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@foodbridge.example</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Hours: Mon–Fri, 9am–5pm</li>
            </ul>
          </Card>
          <Card className="p-6 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-foreground mb-4">Send a Message</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Input id="message" placeholder="How can we help?" />
              </div>
              <Button className="bg-primary" onClick={() => alert('Thanks! We will get back to you.')}>Submit</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;