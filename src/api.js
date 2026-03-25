import axios from "axios";

const API = axios.create({
  baseURL: "https://green-cloud-backend.onrender.com", // change after deployment
});

export const runSimulation = async () => {
  const res = await API.post("/run-simulation");
  return res.data;
};