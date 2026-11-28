import axios from "axios";

const api=axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true
})
export default api;

// "https://ecommerce-project-wl3e.onrender.com"
