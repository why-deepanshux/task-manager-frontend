"use client";
import { useState, useEffect } from "react";

interface Stats {
  totalTasks: number;
  completedPercent: string;
  pendingPercent: string;
  pendingStats: {
    [priority: number]: {
      lapsedTime: number;
      balanceTime: number;
      count: number;
    };
  };
  avgCompletionTime: string;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("Authorization token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://task-manager-backend-dun-two.vercel.app/api/tasks/stats",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include JWT token
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch data`);
        }

        const data: Stats = await response.json();
        setStats(data);
        console.log(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Compute summary fields for pending tasks
  const computePendingSummary = () => {
    if (!stats)
      return { totalPendingCount: 0, totalLapsedTime: 0, totalBalanceTime: 0 };

    const totalPendingCount = Object.values(stats.pendingStats).reduce(
      (sum, task) => sum + task.count,
      0
    );
    const totalLapsedTime = Object.values(stats.pendingStats).reduce(
      (sum, task) => sum + task.lapsedTime,
      0
    );
    const totalBalanceTime = Object.values(stats.pendingStats).reduce(
      (sum, task) => sum + task.balanceTime,
      0
    );

    return { totalPendingCount, totalLapsedTime, totalBalanceTime };
  };

  const { totalPendingCount, totalLapsedTime, totalBalanceTime } =
    computePendingSummary();

  return (
    <div className="w-full relative flex items-center justify-center h-[100vh] mt-4">
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="w-full p-2 flex flex-col gap-8 h-full">
          <div className="text-3xl font-[600]">Summary</div>
          <div className="w-full flex flex-row flex-wrap justify-evenly">
            <div className="card items-center">
              <div className="w-full text-center text-[2rem] text-[#3FA2F6] font-[700]">
                {stats?.totalTasks}
              </div>
              <div className="w-full text-center">Number of Tasks</div>
            </div>
            <div className="card">
              <div className="w-full text-center text-[2rem] text-[#3FA2F6] font-[700]">
                {stats?.completedPercent}%
              </div>
              <div className="w-full text-center">Task Completed</div>
            </div>
            <div className="card items-center">
              <div className="w-full text-center text-[2rem] text-[#3FA2F6] font-[700]">
                {stats?.pendingPercent}%
              </div>
              <div className="w-full text-center">Tasks Pending</div>
            </div>
            <div className="card">
              <div className="w-full text-center text-[2rem] text-[#3FA2F6] font-[700]">
                {stats?.avgCompletionTime} hours
              </div>
              <div className="w-full text-center">
                Avg Time per Completed Task
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col mt-4">
            <div className="w-full text-2xl font-[600]">
              Pending Tasks Summary:
            </div>
            <div className="w-full flex flex-row justify-evenly mt-4">
              <div className="card">
                <div className="w-full text-center text-[2rem] text-[#3FA2F6] font-[700]">
                  {totalPendingCount}
                </div>
                <div>Total Pending Tasks</div>
              </div>
              <div className="card">
                <div className="w-full text-center text-[2rem] text-[#3FA2F6] font-[700]">
                  {totalLapsedTime.toFixed(2)} hours
                </div>
                <div>Total Lapsed Time</div>
              </div>
              <div className="card">
                <div className="w-full text-center text-[2rem] text-[#3FA2F6] font-[700]">
                  {totalBalanceTime.toFixed(2)} hours
                </div>
                <div>Total Balance Time</div>
              </div>
            </div>
          </div>
          <div>
            <div className="w-full text-2xl font-[600]">Pending Tasks by Priority:</div>
            <div className="overflow-x-auto mt-4 mb-8">
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">
                      Priority
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Lapsed Time (hours)
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Balance Time (hours)
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats?.pendingStats || {}).map(
                    ([priority, data]) => (
                      <tr key={priority} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">
                          {priority}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {data.lapsedTime.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {data.balanceTime.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {data.count}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;
