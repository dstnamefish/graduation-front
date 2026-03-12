/**
 * 公共服务类型定义
 */

/**
 * 文件信息
 * @description 上传文件后返回的文件信息
 * @property {number} id - 文件ID，用于业务模块关联
 * @property {string} fileUrl - 文件访问URL，前端可直接用于展示或下载
 * @property {string} fileName - 原始文件名
 * @property {number} fileSize - 文件大小（字节）
 * @property {number} fileType - 文件类型：1-图片，2-语音，3-文档，4-视频，5-其他
 */
export interface FileInfo {
  id: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: number;
}

/**
 * 文件上传响应
 * @description 文件上传接口的响应数据
 * @property {FileInfo} data - 文件信息
 */
export interface FileUploadResponse {
  data: FileInfo;
}
