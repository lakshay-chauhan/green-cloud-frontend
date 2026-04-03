import axios from "axios";

const API = axios.create({
  baseURL: "https://green-cloud-backend.onrender.com",
});

export const runSimulation = async (payload) => {
  const res = await API.post("/run-simulation", payload);
  return res.data;
};