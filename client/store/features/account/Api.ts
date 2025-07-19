import { appInfo } from "@/config/app-details";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSession = createAsyncThunk(
    "get/session",
    async (args: undefined, thunkApi) => {
        try {
            const res = await axios.get(appInfo.apiUrl + "/auth/session", { withCredentials: true });
            return res.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message || "fetch error",
            });
        }
    },
);

export const handleLogOut = async () => {
    await fetch(appInfo.apiUrl + "/auth/logout", {
        method: "POST",
        credentials: "include",
    });
    location.href = "/";
  }