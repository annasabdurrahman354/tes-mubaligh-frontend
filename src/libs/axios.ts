import axios, { isAxiosError } from "axios";
import { getDefaultStore } from "jotai";

import { sessionAtom } from "@/atoms/authAtom";

// Get global store
const store = getDefaultStore();

const api = axios.create({
  baseURL: "https://tes.ppwb.my.id/api/",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(function (config) {
  // Attach Authorization token if available
  const session = store.get(sessionAtom);

  if (session.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

export const handleApiError = (err: unknown): never => {
  if (isAxiosError(err)) {
    if (err.response && err.response.status) {
      const message =
        err.response.data?.message || "Terjadi kesalahan. Coba ulangi lagi!";

      if (err.response.status === 401 && message === "Unauthenticated.") {
        console.error("Unauthorized:", message);
        store.set(sessionAtom, { token: null, user: null, login_at: null });
        removeAuthToken();
        throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
      }
      console.error("API Error:", message);
      throw new Error(message);
    } else if (err.code === "ERR_NETWORK") {
      console.error("Network Error:", err.message);
      throw new Error("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    }
  }
  console.error("Unexpected Error:", err);
  throw new Error("Terjadi kesalahan yang tidak diketahui!");
};

// Function to set the Authorization header
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;
