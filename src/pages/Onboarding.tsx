import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [futureAspiration, setFutureAspiration] = useState("");
  const [averageFreeTime, setAverageFreeTime] = useState("");
  const [futureGoals, setFutureGoals] = useState("");
  const [currentActions, setCurrentActions] = useState("");
  const [address, setAddress] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1 && (!futureAspiration || !averageFreeTime)) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields before continuing.",
      });
      return;
    }
    if (step === 2 && (!futureGoals || !currentActions)) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields before continuing.",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!address) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter your address.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update profile with address
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ address })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Save goals
      const { error: goalsError } = await supabase.from("user_goals").insert({
        user_id: user.id,
        future_aspiration: futureAspiration,
        average_free_time_hours: parseFloat(averageFreeTime),
        future_goals: futureGoals,
        current_actions: currentActions,
      });

      if (goalsError) throw goalsError;

      // Generate initial tasks
      await generateInitialTasks(user.id);

      toast({
        title: "Profile completed!",
        description: "Let's start your transformation journey.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInitialTasks = async (userId: string) => {
    const initialTasks = [
      {
        user_id: userId,
        task_title: "Morning Reflection",
        task_description: "Spend 5 minutes reflecting on your goals and what you want to achieve today",
        task_category: "Mindset",
      },
      {
        user_id: userId,
        task_title: "Read for 15 minutes",
        task_description: "Read something educational related to your future aspirations",
        task_category: "Learning",
      },
      {
        user_id: userId,
        task_title: "Take a small action",
        task_description: "Do one small thing today that brings you closer to your goals",
        task_category: "Action",
      },
    ];

    const { error } = await supabase.from("daily_tasks").insert(initialTasks);
    if (error) throw error;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-2xl shadow-card">
        <CardHeader>
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {step} of {totalSteps}
            </p>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "Your Future Vision"}
            {step === 2 && "Your Goals & Actions"}
            {step === 3 && "Final Details"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Tell us about your dreams and available time"}
            {step === 2 && "Share your goals and current efforts"}
            {step === 3 && "Just one more thing to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="aspiration">What do you want to become in the future?</Label>
                <Textarea
                  id="aspiration"
                  placeholder="e.g., A successful entrepreneur, a professional athlete, a skilled developer..."
                  value={futureAspiration}
                  onChange={(e) => setFutureAspiration(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeTime">
                  How much free time do you have on average per day? (in hours)
                </Label>
                <Input
                  id="freeTime"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="e.g., 3.5"
                  value={averageFreeTime}
                  onChange={(e) => setAverageFreeTime(e.target.value)}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="goals">What are your future goals?</Label>
                <Textarea
                  id="goals"
                  placeholder="List your short-term and long-term goals..."
                  value={futureGoals}
                  onChange={(e) => setFutureGoals(e.target.value)}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actions">What are you currently doing to achieve these goals?</Label>
                <Textarea
                  id="actions"
                  placeholder="Describe your current efforts and actions..."
                  value={currentActions}
                  onChange={(e) => setCurrentActions(e.target.value)}
                  rows={5}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <Label htmlFor="address">Your Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your full address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                className="ml-auto bg-gradient-primary hover:opacity-90"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto bg-gradient-primary hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
