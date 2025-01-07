import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { Users } from 'lucide-react';

const Sidebar = () => {
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    isUsersLoading, 
    newMessageNotifications,
    getUnreadMessageCount,
    setOnline
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    setOnline(); // Call this when the component mounts (user comes online)
  }, [getUsers, setOnline]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100">
      <div className="border-b border-base-300 w-full p-4 lg:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg hidden lg:block text-base-content">Contacts</span>
          </div>
          <div className="lg:hidden">
            <label className="btn btn-circle btn-ghost btn-xs">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-xs"
              />
            </label>
          </div>
        </div>
        
        <div className="mt-3 hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm text-base-content/70">Show online only</span>
          </label>
          <span className="text-xs text-base-content/50">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto flex-grow w-full">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-200 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-200 ring-1 ring-base-300" : ""}
              relative
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-12 h-12 object-cover rounded-full border-2 border-base-300"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-success 
                  rounded-full ring-2 ring-base-100"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-grow">
              <div className="font-medium truncate text-base-content">{user.fullName}</div>
              <div className="text-sm text-base-content/70">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>

            {(newMessageNotifications[user._id] || getUnreadMessageCount(user._id) > 0) && (
              <div className="absolute top-2 right-2 lg:static">
                <span className="flex h-5 w-5">
                  {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span> */}
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center text-xs text-white font-bold">
                    {getUnreadMessageCount(user._id)}
                  </span>
                </span>
              </div>
            )}
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/50 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

