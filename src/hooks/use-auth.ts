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

  /**
   * Updates the authenticated user's username.
   * @param current_username - The user's current username for verification.
   * @param new_username - The desired new username.
   * @returns The API response data containing message and updated user, or undefined on error.
   */
  const updateUsername = async (
    current_username: string, // This might not be needed if backend identifies user by token
    new_username: string,
  ) => {
    try {
      // Ensure the backend returns the *full updated user object* consistent with the User type
      const response = await api.post<{ message: string; user: User }>(
        "update-username",
        {
          current_username, // Only send if backend requires it for verification
          new_username,
        },
      );

      // *** Updated Section ***
      // Update the session atom with the new user data from the response
      setSession((prevSession) => {
        // If there's no previous session or user, something is wrong.
        // Returning RESET or null might be options, but ideally, this state shouldn't be reachable.
        // Safest might be to return the previous state if null checks fail unexpectedly.
        if (!prevSession?.user) return prevSession ?? null; // Handle null edge case

        return {
          ...prevSession,
          user: response.data.user, // Replace the old user object with the updated one
        };
      });
      // *** End Updated Section ***

      return response.data; // Return { message, user }
    } catch (err) {
      handleApiError(err);
      return undefined;
    }
  };

  /**
   * Updates the authenticated user's password.
   * @param current_password - The user's current password for verification.
   * @param new_password - The desired new password.
   * @param new_password_confirmation - Confirmation of the new password.
   * @returns The API response data containing the success message, or undefined on error.
   */
  const updatePassword = async (
    current_password: string,
    new_password: string,
    new_password_confirmation: string,
  ) => {
    try {
      // Password updates usually only return a success message, not user data.
      const response = await api.post<{ message: string }>("update-password", {
        current_password,
        new_password,
        new_password_confirmation, // Ensure backend field name matches
      });

      // No session update needed here as user data isn't typically returned/changed
      // unless tracking 'password_last_changed_at'.

      return response.data; // Return { message }
    } catch (err) {
      handleApiError(err);
      return undefined;
    }
  };

  /**
   * Updates the authenticated user's profile photo.
   * @param photo - The File object representing the new photo.
   * @returns The API response data containing message and new photo url, or undefined on error.
   */
  const updatePhoto = async (photo: File) => {
    const formData = new FormData();
    formData.append("photo", photo); // Key must match backend API requirement

    try {
      // Expecting the backend to return the *new URL* for the photo
      // Adjust the expected response type based on your actual API structure
      const response = await api.post<{ message: string; avatar_url: string }>( // Assuming backend returns 'foto_url'
        "update-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // *** Updated Section ***
      // Update the session atom with the new photo URL
      setSession((prevSession) => {
        if (!prevSession?.user) return prevSession ?? null; // Handle null edge case

        return {
          ...prevSession,
          user: {
            ...prevSession.user,
            foto: response.data.avatar_url, // Update the 'foto' field in the user object
          },
        };
      });
      // *** End Updated Section ***

      return response.data; // Return { message, foto_url }
    } catch (err) {
      handleApiError(err);
      return undefined;
    }
  };

  /**
   * Updates the authenticated user's RFID.
   * @param new_rfid - The desired new RFID value.
   * @returns The API response data containing message and potentially the updated user/RFID, or undefined on error.
   */
  const updateRfid = async (new_rfid: string | null) => { // Allow null if applicable
    try {
      // Assuming the backend requires 'new_rfid' and returns the updated RFID value,
      // potentially within the full user object or partially. Adjust response type as needed.
      // Here we assume it returns the *new rfid value* directly or within a partial user object.
      const response = await api.post<{ message: string; user: { rfid: string | null } }>(
        "update-rfid",
        {
          new_rfid,
        },
      );

      // *** Updated Section ***
      // Update the session atom with the new RFID
      setSession((prevSession) => {
        if (!prevSession?.user) return prevSession ?? null; // Handle null edge case

        return {
          ...prevSession,
          user: {
            ...prevSession.user,
            // Update RFID using the value from the response
            rfid: response.data.user.rfid,
          },
        };
      });
      // *** End Updated Section ***

      return response.data; // Return { message, user: { rfid } } or similar
    } catch (err) {
      handleApiError(err);
      return undefined;
    }
  };


  return {
    loginCredential,
    loginRFID,
    logout,
    hasRole,

    // Profile update methods
    updateUsername,
    updatePassword,
    updatePhoto,
    updateRfid,

    user,
    token,
    setSession,
  };
}
