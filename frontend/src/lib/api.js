const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://127.0.0.1:8000/api"; // Local fallback

export async function loginUser(username, password) {
  try {
    const url = `${API_BASE_URL}/token/`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log("Login successful, saving tokens:", data);

    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("role", data.role || "user");

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token found.");
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    return data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export async function fetchData(endpoint, options = {}) {
  try {
    console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);
    const response = await fetch(`${API_BASE_URL}/${endpoint}/`, options);
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function postData(endpoint, data, method = "POST", isFormData = false) {
  try {
    const url = `${API_BASE_URL}/${endpoint}/`;
    let token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("No access token, trying to refresh...");
      token = await refreshToken();
      if (!token) throw new Error("Authentication required.");
    }

    const headers = isFormData
      ? {} // No headers for FormData
      : { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

    const options = {
      method,
      headers,
      body: isFormData ? data : JSON.stringify(data),
    };

    console.log(`Sending ${method} request to: ${url}`);

    let response = await fetch(url, options);

    if (response.status === 401) {
      console.log("Token expired, refreshing...");
      token = await refreshToken();
      if (!token) throw new Error("Authentication required.");

      localStorage.setItem("accessToken", token);
      headers["Authorization"] = `Bearer ${token}`;

      // Retry request with new token
      response = await fetch(url, options);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to post data: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
