const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB in bytes
const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff', 'webp'];
const ALLOWED_TEXT_TYPES = ['txt', 'rtf', 'doc', 'docx'];
const ALLOWED_SPREADSHEET_TYPES = ['xls', 'xlsx', 'csv', 'ods'];

const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_TEXT_TYPES, ...ALLOWED_SPREADSHEET_TYPES];


export {MAX_FILE_SIZE, ALLOWED_FILE_TYPES};