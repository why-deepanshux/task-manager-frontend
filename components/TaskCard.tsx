import { useState } from "react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Task {
  taskID: number;
  title: string;
  priority: number;
  status: string;
  startTime: Date;
  endTime: Date;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void; // Callback to update the task in the parent component
  onDelete: (taskID: number) => void; // Callback to remove the task in the parent component
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [updatedStatus, setUpdatedStatus] = useState(task.status);
  const [isUpdating, setIsUpdating] = useState(false); // Loading state for update
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete

  // Determine colors based on priority and status
  let priorityColor = "#F3C623";
  if (task.priority === 3 || task.priority === 4) priorityColor = "#FFC7ED";
  if (task.priority === 5) priorityColor = "#3FA2F6";

  const statusColor = task.status === "pending" ? "#FF748B" : "#79D7BE";
  const statusBackground = task.status === "finished" ? "#79D7BE" : "";

  const API_URL = "https://task-manager-backend-dun-two.vercel.app/api/tasks";

  // Handle updating the task's status
  const updateTaskStatus = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      const requestBody = {
        taskID: task.taskID,
        status: updatedStatus,
      };

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const result = await response.json();
      const updatedTask = result.task;
      onUpdate(updatedTask); // Update the parent state with the updated task
    } catch (e) {
      console.error("Error updating task:", e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle deleting the task
  const deleteTask = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      const response = await fetch(`${API_URL}/${task.taskID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      const result = await response.json();
      console.log(result.message);
      onDelete(task.taskID); // Notify parent component to remove the task
    } catch (e) {
      console.error("Error deleting task:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format dates for display
  const formatDate = (date: Date) => new Date(date).toLocaleString();

  return (
    <div
      className="w-[250px] border-2 border-[#161617] p-2 rounded-lg flex flex-col gap-1"
      style={{ backgroundColor: statusBackground }}
    >
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger className="cursor-pointer">
            <Image
              src="/assets/Icons/edit.svg"
              height={25}
              width={25}
              alt="edit icon"
            />
          </PopoverTrigger>
          <PopoverContent className="p-4 border rounded-lg bg-white shadow-md">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Update Status</label>
              <select
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="finished">Finished</option>
              </select>
              <button
                onClick={updateTaskStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full flex flex-row items-center gap-2 font-semibold">
        <div>{task.taskID}.</div>
        <div>{task.title}</div>
      </div>
      <div className="my-2 flex flex-row gap-1">
        <span
          className="px-4 py-1 rounded-xl text-sm font-normal"
          style={{ backgroundColor: priorityColor }}
        >
          Priority: {task.priority}
        </span>
        <span
          className="px-4 py-1 rounded-xl text-sm font-normal"
          style={{ backgroundColor: statusColor }}
        >
          {task.status}
        </span>
      </div>
      <div className="w-full text-sm font-medium flex justify-between">
        Start:
        <span className="text-xs rounded-xl border-2 border-[#161617] px-2 py-1">
          {formatDate(task.startTime)}
        </span>
      </div>
      <div className="w-full flex justify-between text-sm font-medium content-center">
        End:
        <span className="text-xs rounded-xl border-2 border-[#161617] px-2 py-1">
          {formatDate(task.endTime)}
        </span>
      </div>
      <div className="w-full flex justify-start">
        <button onClick={deleteTask} className="p-1" disabled={isDeleting}>
          {isDeleting ? (
            <div className="loader"></div> // Replace this with your loader
          ) : (
            <Image
              src={"/assets/Icons/delete.svg"}
              height={20}
              width={20}
              alt="Delete Icon"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
