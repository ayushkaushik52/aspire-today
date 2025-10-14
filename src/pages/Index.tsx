import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HeroButton, SecondaryButton } from "@/components/ui/button-variants";
import { Target, Clock, TrendingUp, Sparkles } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) {
        navigate("/dashboard");
      } else {
        setIsLoading(false);
      }
    });
  }, [navigate]);
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Sparkles className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block animate-fade-in">
              <Sparkles className="h-16 w-16 text-primary mx-auto mb-6" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in">
              Stop Wasting Time.
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Start Living.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Transform your free time into purposeful action. Set goals, track progress, and
              become who you've always wanted to be.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in">
              <HeroButton onClick={() => navigate("/auth")}>
                Start Your Journey
              </HeroButton>
              <SecondaryButton onClick={() => navigate("/auth")} className="text-yellow-50 bg-yellow-500 hover:bg-yellow-400">
                Learn More
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Your Path to Success
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-6 rounded-xl hover:shadow-card transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Define Your Goals</h3>
              <p className="text-muted-foreground">
                Share your aspirations and we'll help you create a clear path forward
              </p>
            </div>
            <div className="text-center space-y-4 p-6 rounded-xl hover:shadow-card transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Use Your Time Wisely</h3>
              <p className="text-muted-foreground">
                Get personalized daily tasks that fit your schedule and push you forward
              </p>
            </div>
            <div className="text-center space-y-4 p-6 rounded-xl hover:shadow-card transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Watch yourself grow day by day with actionable, achievable tasks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Transform Your Life?
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of young people who are turning their dreams into reality, one small
            step at a time.
          </p>
          <div className="pt-8">
            <HeroButton onClick={() => navigate("/auth")} className="bg-card text-primary hover:scale-110">
              Get Started Now
            </HeroButton>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;