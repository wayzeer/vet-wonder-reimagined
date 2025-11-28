import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { 
  PawPrint, Calendar, Heart, Stethoscope, 
  MessageCircle, LogOut 
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-custom flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">VetWonder</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your Pet's Health,{" "}
              <span className="text-gradient">Our Priority</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Modern veterinary care with intelligent appointment booking, 
              comprehensive medical records, and 24/7 AI-powered pet advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-gradient"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
              >
                Book Appointment
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Pet Care Solutions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to keep your pet healthy and happy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Booking",
                description: "Easy online appointment scheduling with real-time availability"
              },
              {
                icon: Stethoscope,
                title: "Medical Records",
                description: "Complete digital health history for your pets"
              },
              {
                icon: Heart,
                title: "Wellness Plans",
                description: "Customized care programs for every life stage"
              },
              {
                icon: MessageCircle,
                title: "AI Assistant",
                description: "24/7 intelligent support for pet health questions"
              }
            ].map((feature, idx) => (
              <div key={idx} className="card-soft p-6 hover-lift">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of pet parents who trust VetWonder
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
          >
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container-custom text-center text-muted-foreground">
          <p>&copy; 2024 VetWonder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
