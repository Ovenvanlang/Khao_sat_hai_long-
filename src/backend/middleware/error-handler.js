// Gom mọi lỗi về một định dạng: { "error": "<MA_LOI>", "message": "..." }.
const { AppError } = require('../errors');

function notFound(req, res) {
  res.status(404).json({ error: 'KHONG_TIM_THAY', message: `Không có đường dẫn ${req.method} ${req.path}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) return res.status(err.status).json({ error: err.code, message: err.message });
  if (err.status === 501) return res.status(501).json({ error: err.code, message: err.message });
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError)
    return res.status(400).json({ error: 'DU_LIEU_KHONG_HOP_LE', message: 'Nội dung gửi lên không phải JSON hợp lệ' });
  console.error(err);
  res.status(500).json({ error: 'LOI_HE_THONG', message: 'Có lỗi hệ thống, vui lòng thử lại' });
}

module.exports = { notFound, errorHandler };
