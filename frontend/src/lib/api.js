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
    const options = {
      method: method,
      headers: isFormData
        ? { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
      body: isFormData ? data : JSON.stringify(data),
    };

    const response = await fetch(`${API_BASE_URL}/${endpoint}/`, options);
    if (!response.ok) throw new Error("Failed to post data");

    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
