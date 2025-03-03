import { useAtomValue, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";

import { Session } from "@/types/auth";
import api, {
  handleApiError,
  removeAuthToken,
  setAuthToken,
} from "@/libs/axios";
import { sessionAtom } from "@/atoms/authAtom";

export function useAuth() {
  const setSession = useSetAtom(sessionAtom);
  const user = useAtomValue(sessionAtom)?.user;
  const token = useAtomValue(sessionAtom)?.token;
  const roles = useAtomValue(sessionAtom)?.user?.roles;

  const loginCredential = async (username: string, password: string) => {
    try {
      const response = await api.post("login-credential", {
        username,
        password,
      });
      const sessionData: Session = {
        token: response.data.token,
        user: response.data.user,
        login_at: new Date(),
      };

      setTimeout(() => {
        setAuthToken(response.data.token);
        setSession(sessionData);
      }, 2000);

      return sessionData;
    } catch (err) {
      handleApiError(err);
    }
  };

  const loginRFID = async (rfid: string) => {
    try {
      const response = await api.post("login-rfid", {
        rfid,
      });
      const sessionData: Session = {
        token: response.data.token,
        user: response.data.user,
        login_at: new Date(),
      };

      setTimeout(() => {
        setAuthToken(response.data.token);
        setSession(sessionData);
      }, 2000);

      return sessionData;
    } catch (err) {
      handleApiError(err);
    }
  };

  const logout = async () => {
    try {
      const response = await api.post("logout");

      setSession(RESET);
      removeAuthToken();

      return response.data.message;
    } catch (err) {
      handleApiError(err);
    }
    finally {
      setSession(RESET);
      removeAuthToken();
    }
  };

  const hasRole = (role: string) => {
    return roles?.includes(role);
  };

  return {
    loginCredential,
    loginRFID,
    logout,
    hasRole,
    user,
    token,
    setSession,
  };
}
