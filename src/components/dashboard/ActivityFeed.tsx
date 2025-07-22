import React from 'react';

interface Activity {
  id: number | string;
  message: string;
  timestamp: string;
}

const ActivityFeed: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <div className="bg-white rounded shadow p-4 mb-8">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      {activities.length === 0 ? (
        <div>No recent activity.</div>
      ) : (
        <ul>
          {activities.map(activity => (
            <li key={activity.id} className="mb-2 flex justify-between items-center">
              <span>{activity.message}</span>
              <span className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed; 