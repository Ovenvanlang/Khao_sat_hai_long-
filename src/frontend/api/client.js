// src/frontend/api/client.js
const API_BASE_URL = '/api'; // Gọi tương đối vì Express phục vụ cùng cổng

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Giả lập vai trò để test (thay bằng logic login thật nếu có)
        'X-Role': 'quan_ly', 
        'X-Center-Id': '1',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
}

export default apiCall;