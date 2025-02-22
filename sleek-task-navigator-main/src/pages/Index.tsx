
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col min-h-screen items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Track Your Tasks with AI
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg sm:text-xl">
              Get personalized suggestions and stay organized with our AI-powered task management system.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">AI Suggestions</h3>
              <p className="text-muted-foreground">
                Receive smart suggestions to help you manage and prioritize your tasks effectively.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Simple Organization</h3>
              <p className="text-muted-foreground">
                Keep your tasks organized with an intuitive and clean interface.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your progress and stay on top of your goals with detailed insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
