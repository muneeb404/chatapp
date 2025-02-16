import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Star, Globe, Search, Menu, X } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    favoriteUsers,
    toggleFavoriteUser,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("favorites");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = (activeTab === "favorites" ? favoriteUsers : users)
    .filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true))
    .filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (isUsersLoading) return <SidebarSkeleton />;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderUserList = () => (
    <div className="overflow-y-auto flex-grow px-2">
      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 p-4">
          {activeTab === "favorites"
            ? "No favorite users yet"
            : "No users available"}
        </p>
      ) : (
        filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-all duration-200 ${
              selectedUser?._id === user._id ? "bg-base-200 shadow-md" : ""
            }`}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-10 h-10 rounded-full border-2 border-base-300"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  onlineUsers.includes(user._id)
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{user.fullName}</div>
              <div className="text-xs text-gray-500">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteUser(user);
              }}
              className={`text-xl transition-all duration-200 ${
                favoriteUsers.some((u) => u._id === user._id)
                  ? "text-yellow-500 hover:text-yellow-600"
                  : "text-gray-400 hover:text-yellow-500"
              }`}
            >
              {favoriteUsers.some((u) => u._id === user._id) ? "★" : "☆"}
            </button>
          </button>
        ))
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-24 right-6 z-50 p-2 bg-primary text-white rounded-full shadow-lg"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Slide-out Menu */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="border-b border-neutral p-4 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">Contacts</span>
            </div>
          </div>

          {/* Tabs for Global and Favorite Users */}
          <div className="p-4">
            <div className="flex rounded-lg bg-base-200 p-1">
              <button
                onClick={() => setActiveTab("global")}
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200 ${
                  activeTab === "global"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:bg-base-300"
                }`}
              >
                <Globe size={18} />
                <span>Global</span>
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200 ${
                  activeTab === "favorites"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:bg-base-300"
                }`}
              >
                <Star size={18} />
                <span>Favorites</span>
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Show Online Only Toggle */}
            <label className="flex items-center gap-2 px-4 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={() => setShowOnlineOnly((prev) => !prev)}
                className="toggle toggle-primary toggle-sm"
              />
              <span className="text-sm text-gray-600">Show online only</span>
            </label>

            {/* Search Button (Mobile) */}
            <button
              className=" mb-4 py-2 px-4 bg-base-200 rounded-full flex items-center justify-center gap-2"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search size={18} />
              {/* <span>Search users</span> */}
            </button>
          </div>
          {renderUserList()}
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-full w-80 border-r border-base-300 flex-col bg-base-100">
        <div className="border-b p-4 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Users className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">Contacts</span>
          </div>
        </div>

        {/* Search Input (Desktop) */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Tabs for Global and Favorite Users */}
        <div className="px-4 mb-4">
          <div className="flex rounded-lg bg-base-200 p-1">
            <button
              onClick={() => setActiveTab("global")}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === "global"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-base-300"
              }`}
            >
              <Globe size={18} />
              <span>Global</span>
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === "favorites"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-base-300"
              }`}
            >
              <Star size={18} />
              <span>Favorites</span>
            </button>
          </div>
        </div>

        {/* Show Online Only Toggle */}
        <label className="flex items-center gap-2 px-4 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={() => setShowOnlineOnly((prev) => !prev)}
            className="toggle toggle-primary toggle-sm"
          />
          <span className="text-sm text-gray-600">Show online only</span>
        </label>

        {renderUserList()}
      </aside>

      {/* Search Modal (Mobile) */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Search Users</h3>
              <button onClick={() => setIsSearchModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
