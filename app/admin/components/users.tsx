// components/users.tsx
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  orders: Array<{
    id: string;
    totalPrice: number;
    status: string;
    createdAt: Date;
  }>;
}

interface UserStatsProps {
  users: User[];
}

export const UserStats = ({ users }: UserStatsProps) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return dateObj.toLocaleDateString();
  };

  const getLatestOrder = (user: User) => {
    return user.orders[0] || null;
  };

  return (
    <div className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="mb-4 text-xl font-bold">User Activity</h2>
      <div className="space-y-4">
        {users.length > 0 ? (
          users.map((user) => {
            const latestOrder = getLatestOrder(user);
            return (
              <div key={user.id} className="flex items-center">
                <div className="mr-3 h-12 w-12 rounded-full border-2 border-black bg-[#4ECDC4] flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm">
                    {latestOrder 
                      ? `Completed $${latestOrder.totalPrice.toFixed(2)} purchase`
                      : `Joined ${formatDate(user.createdAt)}`
                    }
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-gray-500">
            No users found
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <span className="font-bold">Total Users:</span>
        <span className="font-bold">{users.length}</span>
      </div>
    </div>
  );
};