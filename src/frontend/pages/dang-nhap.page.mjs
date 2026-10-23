// Trang đăng nhập. Mọi lệnh gọi máy chủ đi qua lớp api/ (trang này KHÔNG dùng fetch).
import * as authApi from '../api/auth.api.mjs';
import { getToken } from '../api/client.mjs';
import { createDataState } from '../components/DataState.mjs';

const ds = createDataState(document.getElementById('trang-thai'));
const form = document.getElementById('form-dang-nhap');
const nut = form.querySelector('[data-submit]');

// Bị đẩy về đây do token hết hạn/không hợp lệ (client.mjs thêm ?ly_do=het_phien)
if (new URLSearchParams(location.search).get('ly_do') === 'het_phien') {
  ds.error({ message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', code: 'TOKEN_KHONG_HOP_LE' });
} else if (getToken()) {
  ds.empty('Bạn đang đăng nhập. Gửi biểu mẫu dưới đây để đổi tài khoản.');
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const username = form.username.value.trim();
  const password = form.password.value;
  if (!username || !password) {
    ds.error({ message: 'Nhập đủ tên đăng nhập và mật khẩu', code: 'DU_LIEU_KHONG_HOP_LE' });
    return;
  }

  ds.loading('Đang kiểm tra tài khoản…');
  nut.disabled = true;
  try {
    const { user } = await authApi.login(username, password);
    ds.content(`<div class="alert alert-success mb-0">Xin chào ${user.full_name}. Đang mở báo cáo…</div>`);
    location.assign('bao-cao-csat.html');
  } catch (err) {
    // Sai mật khẩu: hiện lỗi tại chỗ, nút "Thử lại" gửi lại chính biểu mẫu
    ds.error(err, () => form.requestSubmit());
  } finally {
    nut.disabled = false;
  }
});
