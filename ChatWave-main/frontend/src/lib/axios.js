import axios from 'axios'

const BASE_URL=import.meta.MODE === "developement" ? "http://localhost:5000/api" : "/api"

export const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    withCredentials:true
})


