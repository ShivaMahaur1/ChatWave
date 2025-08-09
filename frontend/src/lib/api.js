import axios from "axios"
import { axiosInstance } from "./axios"
import { useId } from "react"

export const getAuthUser=async()=>{
      try {
        const res = await axiosInstance.get("/auth/me")
      return res.data
      } catch (error) {
        console.log("Eror in getAuthUSerApi",error)
        return null
      }
    }

export const completeOnboarding=async(userdata) =>{
    const response=await axiosInstance.post("/auth/onboarding",userdata)
    return response.data
}   

export const login =async (loginData)=>{
    const response=await axiosInstance.post("/auth/login",loginData)
    return response.data
}

export const logout =async ()=>{
    const response=await axiosInstance.post("/auth/logout",)
    return response.data
}

export const getUserFriends=async()=>{
  const response=await axiosInstance.get('/users/friends')
  return response.data
}

export const getRecommendedUser=async()=>{
  const response=await axiosInstance.get('/users')
  return response.data
}

export const getOutGoingFriendReqs = async () => {
  const response = await axiosInstance.get('/users/outgoing-friend-requests');
  return response.data;
}
export const sendFriendRequest=async(userId)=>{
  const response=await axiosInstance.post(`/users/friend-request/${userId}`)
  return response.data
}

export const getFriendRequests=async()=>{
  const response=await axiosInstance.get('/users/friend-requests')
  return response.data
} 

export const acceptFriendRequest=async(requesId)=>{
  const response=await axiosInstance.put(`/users/friend-request/${requesId}/accept`)
  return response.data
}

export const getStreamToken=async()=>{
  const response=await axiosInstance.get('/chat/token')
  return response.data
} 


