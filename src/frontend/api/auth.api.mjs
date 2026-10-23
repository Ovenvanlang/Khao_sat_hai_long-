// API đăng nhập (ứng với routes/auth.routes.js).
import { request, saveSession } from './client.mjs';

export async function login(username, password) {
  const res = await request('/api/auth/login', {
    method: 'POST',
    auth: false,                                  // chưa có token, và sai mật khẩu KHÔNG được chuyển trang
    body: { username, password },
  });
  saveSession({ token: res.data.token, user: res.data.user });
  return res.data;
}

export async function me() {
  const res = await request('/api/auth/me');
  return res.data;
}
