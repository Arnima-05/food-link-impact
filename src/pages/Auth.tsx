import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProfilesAPI } from "@/lib/api";
import { setCurrentUser } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Loader2 } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  organizationName: z.string().trim().min(2, "Organization name is required").max(200),
  phone: z.string().trim().optional(),
  location: z.string().trim().min(2, "Location is required").max(200),
  address: z.string().trim().min(5, "Address is required").max(500)
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [role, setRole] = useState<"restaurant" | "ngo">("restaurant");

  // Set role from URL parameter if provided
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'restaurant' || roleParam === 'ngo') {
      setRole(roleParam);
      setMode('signup'); // Ensure we're on signup tab when coming from homepage buttons
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    organizationName: "",
    phone: "",
    location: "",
    address: ""
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = signupSchema.parse(formData);

      // Register or update profile via API (password ignored in demo)
      const profile = await ProfilesAPI.register({
        full_name: validated.fullName,
        email: validated.email,
        role,
        organization_name: validated.organizationName,
        phone: validated.phone || undefined,
        location: validated.location,
        address: validated.address,
      });

      setCurrentUser({
        id: profile.id,
        role,
        profile: {
          full_name: profile.full_name,
          email: profile.email,
          location: profile.location,
          phone: profile.phone,
        },
      });

      toast({
        title: "Account created!",
        description: "Welcome to FoodBridge. Redirecting to your dashboard..."
      });

      setTimeout(() => {
        navigate(role === 'restaurant' ? '/restaurant' : '/ngo');
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = loginSchema.parse({
        email: formData.email,
        password: formData.password
      });

      // Login by email (demo). Password not used.
      const profile = await ProfilesAPI.login(validated.email);

      setCurrentUser({
        id: profile.id,
        role: profile.role,
        profile: {
          full_name: profile.full_name,
          email: profile.email,
          location: profile.location,
          phone: profile.phone,
        },
      });

      toast({
        title: "Welcome back!",
        description: "Redirecting to your dashboard..."
      });

      setTimeout(() => {
        navigate(profile.role === 'restaurant' ? '/restaurant' : '/ngo');
      }, 500);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold text-foreground">FoodBridge</span>
          </div>
          <p className="text-muted-foreground">Join the fight against food waste</p>
        </div>

        <Card className="p-8 bg-[var(--gradient-card)] border-border shadow-[var(--shadow-lg)]">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    type="button"
                    variant={role === "restaurant" ? "default" : "outline"}
                    onClick={() => setRole("restaurant")}
                    className={role === "restaurant" ? "bg-primary" : ""}
                  >
                    Restaurant
                  </Button>
                  <Button
                    type="button"
                    variant={role === "ngo" ? "default" : "outline"}
                    onClick={() => setRole("ngo")}
                    className={role === "ngo" ? "bg-primary" : ""}
                  >
                    NGO
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    required
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    maxLength={255}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">City/Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    maxLength={500}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging In...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
