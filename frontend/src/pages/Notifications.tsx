import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const Notifications = () => {
  const { user } = useAuth();

  // Real-time polling every 5s
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/notify/user/${user.id}`
      );
      return res.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) return <p>Loading notifications...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n._id} className="p-4 border rounded-lg bg-white">
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-sm text-gray-600">{n.message}</p>
              <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
