import axiosInstance from "../utils/axios";

export const loginAPI = async (credentials) => {
  try {
    // credentials me tera { email, password } object aayega form se
    const response = await axiosInstance.post("/auth/login", credentials);
    
    // Agar backend ne 200 OK bheja, toh data return kar do
    return response.data; 
    
  } catch (error) {
    // 🚨 Backend se aane wale errors ko yahan handle karenge
    if (error.response && error.response.data) {
      // Backend (Node.js) ne jo custom error message bheja hoga, hum wahi throw karenge
      throw new Error(error.response.data.message || "Invalid Credentials");
    }
    
    // Agar server down hai ya internet nahi chal raha
    throw new Error("Network Error! DevTinder server is unreachable.");
  }
};