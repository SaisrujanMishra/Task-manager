
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { TaskActions } from "@/components/TaskActions";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  aiSuggestions: string[];
}

interface TaskTableProps {
  tasks: Task[];
  onComplete?: (taskId: string) => void;
  onEdit?: (taskId: string, task: Task) => void;
}

export function TaskTable({ tasks, onComplete, onEdit }: TaskTableProps) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>AI Suggestions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="animate-fade-up">
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  {task.dueDate}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    task.priority === "high"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : "bg-green-100 text-green-800 border-green-200"
                  }
                >
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    task.status === "completed"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {task.aiSuggestions.map((suggestion, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <TaskActions
                      isEditing
                      taskId={task.id}
                      initialTitle={task.title}
                      initialDueDate={new Date(task.dueDate)}
                      onSubmit={({ title, dueDate }) => onEdit(task.id, { ...task, title, dueDate: dueDate.toISOString() })}
                    />
                  )}
                  {onComplete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onComplete(task.id)}
                      disabled={task.status === "completed"}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
