/**
 * 公共服务类型定义
 * @module types/api/common
 * @description 提供公共服务相关的类型定义，包括文件信息等
 */

/**
 * 文件信息
 * @description 上传文件后返回的文件信息
 */
export interface FileInfo {
  /** 文件ID，用于业务模块关联 */
  id: number;
  /** 文件访问URL，前端可直接用于展示或下载 */
  fileUrl: string;
  /** 原始文件名 */
  fileName: string;
  /** 文件大小（字节） */
  fileSize: number;
  /** 文件类型：1-图片，2-语音，3-文档，4-视频，5-其他 */
  fileType: number;
}

/**
 * 文件上传响应
 * @description 文件上传接口的响应数据
 */
export interface FileUploadResponse {
  data: FileInfo;
}
