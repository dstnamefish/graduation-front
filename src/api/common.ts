/**
 * 公共服务API调用
 * @module api/common
 * @description 提供公共服务相关的API接口，包括文件上传等功能
 */

import request from '@/utils/http';
import { FileInfo } from '@/types/api/common';

/**
 * 上传文件
 * @description 用于上传文件到服务器，支持多种文件类型，上传成功后返回文件访问URL
 * @param file 要上传的文件对象
 * @param fileType 文件类型编码：1-图片，2-文档，3-音视频，4-压缩包，5-通用文件（默认）
 * @returns 返回文件信息，包含文件ID、访问URL、文件名、文件大小等
 */
export function uploadFile(file: File, fileType: number = 5) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', fileType.toString());

  return request.post<FileInfo>({
    data: formData,
    url: '/files/upload',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
