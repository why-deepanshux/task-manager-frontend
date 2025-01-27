"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TaskCard from "./TaskCard";

interface Task {
  taskID: number;
  title: string;
  priority: number;
  status: string;
  startTime: Date;
  endTime: Date;
}

const Tasklist = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: 1,
    status: "pending",
    startTime: "",
    endTime: "",
  });
  const [filter, setFilter] = useState({ priority: "", status: "" });
  const [isLoading, setIsLoading] = useState(false); // For fetching tasks
  const [isAdding, setIsAdding] = useState(false); // For adding a task

  const API_URL = "https://task-manager-backend-dun-two.vercel.app/api/tasks";

  // Fetch tasks from API
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        alert("You are not logged In")
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      setTasks(data.tasks);
      setFilteredTasks(data.tasks); // Initialize filtered tasks
    } catch (e) {
      console.error("Error fetching tasks:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new task
  const addTask = async () => {
    setIsAdding(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const addedTask = await response.json();

      // Ensure the new task has a unique ID, or generate one if missing
      addedTask.taskID = addedTask.taskID || Date.now(); // Generate a unique ID if not present

      // After adding the task, fetch all tasks again to get the updated list
      fetchTasks();

      // Reset the new task input fields
      setNewTask({
        title: "",
        priority: 1,
        status: "pending",
        startTime: "",
        endTime: "",
      });
    } catch (e) {
      console.error("Error adding task:", e);
    } finally {
      setIsAdding(false);
    }
  };

  
  // Filter tasks
  const filterTasks = () => {
    setFilteredTasks(
      tasks.filter(
        (task) =>
          (filter.priority
            ? task.priority.toString() === filter.priority
            : true) && (filter.status ? task.status === filter.status : true)
      )
    );
  };

  // Sort tasks by priority
  const sortTasksByPriority = () => {
    setFilteredTasks((prev) =>
      [...prev].sort((a, b) => a.priority - b.priority)
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [filter, tasks]);

  return (
    <div className="mt-4 w-full flex flex-row">
      {/* Sidebar */}
      <div className="w-[20%] flex flex-col gap-4 p-4 border-r">
        {/* Add Task Popover */}
        <Popover>
          <PopoverTrigger className="w-full flex flex-row gap-1 justify-center px-4 py-2 bg-blue-500 text-white rounded-xl">
            <div>Add Task</div>
            <span>
              <Image
                src={"/assets/Icons/plus.svg"}
                height={25}
                width={25}
                alt="plus icon"
              />
            </span>
          </PopoverTrigger>
          <PopoverContent className="p-4 border rounded-lg bg-white shadow-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTask();
              }}
              className="flex flex-col gap-3"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      priority: Number(e.target.value),
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  {[1, 2, 3, 4, 5].map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="finished">Finished</option>
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium">Start Time</label>
                <input
                  type="datetime-local"
                  value={newTask.startTime}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium">End Time</label>
                <input
                  type="datetime-local"
                  value={newTask.endTime}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, endTime: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-xl"
              >
                Add Task
              </button>
            </form>
          </PopoverContent>
        </Popover>
        {/* Sorting & Filtering */}
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={sortTasksByPriority}
        >
          Sort by Priority
        </button>
        <div>
          <label className="block">Filter by Priority:</label>
          <select
            value={filter.priority}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {[1, 2, 3, 4, 5].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Filter by Status:</label>
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, status: e.target.value }))
            }
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks Display */}
      <div className="w-[80%] flex flex-wrap gap-4 p-4">
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.taskID}
              task={task}
              onUpdate={(updatedTask) => {
                // Log the updated task to check its structure
                console.log("Updated Task:", updatedTask);
                // handleUpdate(updatedTask);
                setTasks((prevTasks) =>
                  prevTasks.map((task) =>
                    task.taskID === updatedTask.taskID ? updatedTask : task
                  )
                );
              }}
              onDelete={(taskID) => {
                setTasks((prevTasks) =>
                  prevTasks.filter((task) => task.taskID !== taskID)
                );
              }}
            />
          ))
        )}
        {isAdding && <div className="loader"></div>}
      </div>
    </div>
  );
};

export default Tasklist;
