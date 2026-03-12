/**
 * 公共服务API调用
 */

import request from '@/shared/lib/utils/http';
import { FileInfo } from './types';

/**
 * 上传文件
 * @param file 要上传的文件
 * @param fileType 文件类型编码：1-图片，2-文档，3-音视频，4-压缩包，5-通用文件（默认）
 * @returns 文件信息
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
