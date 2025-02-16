import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      users: [],
      favoriteUsers: [],
      selectedUser: null,
      selectedBot: false,
      isUsersLoading: false,
      isMessagesLoading: false,
      newMessageNotifications: {},
      unreadMessages: {},
      lastOnlineTimestamp: Date.now(),

      setSelectedBot: (value) => set({ selectedBot: value }),

      getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response?.data?.message || "Error fetching users");
        } finally {
          set({ isUsersLoading: false });
        }
      },

      getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data });
          set((state) => ({
            newMessageNotifications: {
              ...state.newMessageNotifications,
              [userId]: false,
            },
            unreadMessages: {
              ...state.unreadMessages,
              [userId]: [],
            },
          }));
        } catch (error) {
          toast.error(error.response?.data?.message || "Error fetching messages");
        } finally {
          set({ isMessagesLoading: false });
        }
      },

      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            messageData
          );
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },

      subscribeToMessages: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
          const isMessageSentFromSelectedUser =
            newMessage.senderId === selectedUser?._id;
          
          if (isMessageSentFromSelectedUser) {
            set({
              messages: [...get().messages, newMessage],
            });
          } else {
            // Set notification and store unread message
            set(state => ({
              newMessageNotifications: {
                ...state.newMessageNotifications,
                [newMessage.senderId]: true
              },
              unreadMessages: {
                ...state.unreadMessages,
                [newMessage.senderId]: [
                  ...(state.unreadMessages[newMessage.senderId] || []),
                  newMessage
                ]
              }
            }));
          }
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
      },

      setSelectedUser: (selectedUser) =>
        set((state) => ({
          selectedUser,
          newMessageNotifications: {
            ...state.newMessageNotifications,
            [selectedUser?._id]: false,
          },
          unreadMessages: {
            ...state.unreadMessages,
            [selectedUser?._id]: [],
          },
        })),

      clearAllNotifications: () => set({ 
        newMessageNotifications: {},
        unreadMessages: {}
      }),

      getUnreadMessageCount: (userId) => {
        const { unreadMessages } = get();
        return unreadMessages[userId]?.length || 0;
      },

      toggleFavoriteUser: (user) => {
        set((state) => {
          const isFavorite = state.favoriteUsers.some((u) => u._id === user._id);
          return {
            favoriteUsers: isFavorite
              ? state.favoriteUsers.filter((u) => u._id !== user._id)
              : [...state.favoriteUsers, user],
          };
        });
      },

      setOnline: async () => {
        const { lastOnlineTimestamp } = get();
        try {
          const res = await axiosInstance.get(`/messages/since/${lastOnlineTimestamp}`);
          const newMessages = res.data;
          
          set(state => {
            const updatedUnreadMessages = { ...state.unreadMessages };
            const updatedNotifications = { ...state.newMessageNotifications };
            
            newMessages.forEach(msg => {
              if (!updatedUnreadMessages[msg.senderId]) {
                updatedUnreadMessages[msg.senderId] = [];
              }
              updatedUnreadMessages[msg.senderId].push(msg);
              updatedNotifications[msg.senderId] = true;
            });

            return {
              unreadMessages: updatedUnreadMessages,
              newMessageNotifications: updatedNotifications,
              lastOnlineTimestamp: Date.now()
            };
          });
        } catch (error) {
          console.error("Failed to fetch messages since last online:", error);
        }
      },
    }),
    {
      name: "chat-storage",
      getStorage: () => localStorage,
    }
  )
);

