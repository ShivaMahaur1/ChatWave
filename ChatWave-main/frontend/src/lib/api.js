import { axiosInstance } from "./axios";

// ================= AUTH =================

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  try {
    const res = await axiosInstance.post("/auth/onboarding", userData, {
      headers: {
        "Content-Type": "application/json", // ✅ IMPORTANT for base64
      },
    });
    return res.data;
  } catch (error) {
    console.log("Onboarding error:", error);
    throw error;
  }
};

export const login = async (loginData) => {
  const res = await axiosInstance.post("/auth/login", loginData);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

// ================= USERS =================

export const getUserFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};

export const getRecommendedUser = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getOutGoingFriendReqs = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
};

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/users/friend-requests");
  return res.data;
};

export const acceptFriendRequest = async (requestId) => {
  const res = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return res.data;
};

// ================= CHAT =================

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/chat/token");
  return res.data;
};
