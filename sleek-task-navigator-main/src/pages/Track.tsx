
import { useEffect, useState } from "react";
import { TaskTable } from "@/components/TaskTable";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskActions } from "@/components/TaskActions";

interface Task {
  id: string;
  title: string;
  due_date: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  ai_suggestions: string[];
}

const Track = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your tasks",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate, toast]);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      return data as Task[];
    },
  });

  // Complete task mutation
  const completeMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('user_tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task completed",
        description: "The task has been marked as completed.",
      });
    },
    onError: (error) => {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Edit task mutation
  const editMutation = useMutation({
    mutationFn: async ({ taskId, title, dueDate }: { taskId: string; title: string; dueDate: Date }) => {
      const { error } = await supabase
        .from('user_tasks')
        .update({
          title,
          due_date: dueDate.toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: async ({ title, dueDate }: { title: string; dueDate: Date }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('user_tasks')
        .insert({
          title,
          due_date: dueDate.toISOString(),
          user_id: user.id,
          priority: "medium",
          status: "pending",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task created",
        description: "The task has been created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Track Tasks</h1>
          <p className="text-muted-foreground">Monitor and manage your tasks progress</p>
        </div>
        <TaskActions 
          onSubmit={({ title, dueDate }) => createMutation.mutate({ title, dueDate })}
        />
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search tasks..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading tasks...</div>
      ) : (
        <div className="rounded-lg border bg-card">
          <TaskTable 
            tasks={filteredTasks.map(task => ({
              ...task,
              dueDate: task.due_date,
              aiSuggestions: task.ai_suggestions || []
            }))} 
            onComplete={(taskId) => completeMutation.mutate(taskId)}
            onEdit={(taskId, task) => {
              editMutation.mutate({
                taskId,
                title: task.title,
                dueDate: new Date(task.dueDate)
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Track;
