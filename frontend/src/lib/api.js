const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://127.0.0.1:8000/api"; // Local fallback

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
    const headers = isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        };

    // **Only add Authorization header if a token exists AND it's not for signup**
    const token = localStorage.getItem("accessToken");
    if (token && !isFormData && endpoint !== "signup") {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
      body: isFormData ? data : JSON.stringify(data),
    };

    console.log("Sending API Request to:", url);
    console.log("API Request Options:", options);

    const response = await fetch(url, options);

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

