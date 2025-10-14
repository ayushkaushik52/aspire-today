import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Target, Sparkles, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  task_title: string;
  task_description: string;
  task_category: string;
  is_completed: boolean;
}

interface Profile {
  full_name: string;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await loadData(session.user.id);
  };

  const loadData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from("daily_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("daily_tasks")
        .update({ is_completed: !currentStatus })
        .eq("id", taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, is_completed: !currentStatus } : task
      ));

      toast({
        title: !currentStatus ? "Task completed!" : "Task reopened",
        description: !currentStatus ? "Great progress!" : "Keep going!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.is_completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Your Journey</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold">
            Welcome back, {profile?.full_name}! 👋
          </h2>
          <p className="text-xl text-muted-foreground">
            Let's make today count
          </p>
        </div>

        {/* Progress Card */}
        <Card className="shadow-card border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Today's Progress
            </CardTitle>
            <CardDescription>
              {completedTasks} of {totalTasks} tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-4">
              <div
                className="bg-gradient-primary h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 20 && (
                  <span className="text-xs font-bold text-primary-foreground">
                    {Math.round(progressPercentage)}%
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            Your Daily Tasks
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={`shadow-card transition-all duration-300 hover:shadow-glow ${
                  task.is_completed ? "opacity-75 bg-muted/50" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{task.task_title}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-wider mt-1">
                        {task.task_category}
                      </CardDescription>
                    </div>
                    <Checkbox
                      checked={task.is_completed}
                      onCheckedChange={() =>
                        toggleTaskCompletion(task.id, task.is_completed)
                      }
                      className="mt-1"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {task.task_description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Motivational Section */}
        {completedTasks === totalTasks && totalTasks > 0 && (
          <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
            <CardHeader>
              <CardTitle className="text-2xl">🎉 Amazing Work!</CardTitle>
              <CardDescription className="text-primary-foreground/90">
                You've completed all your tasks for today. Keep up the momentum!
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
