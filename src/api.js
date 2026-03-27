import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // change after deployment
});

export const runSimulation = async () => {
  const res = await API.post("/run-simulation");
  return res.data;
};