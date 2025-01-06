import request from '@/utils/request';
import { addAuthHeaders } from './utils';
import { AxiosProgressEvent, AxiosResponse } from 'axios';

export const uploadVideo = async (
  data: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<AxiosResponse> => {
  try {
    const res = await request.post('video/upload/upload', data, addAuthHeaders({
      timeout: 0,
      onUploadProgress,
    }));
    return res;
  } catch (error) {
    console.error('视频上传失败:', error);
    throw error;
  }
};

export const uploadFile = async (
  file: File,
  url: string
): Promise<AxiosResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await request.post(url, formData, addAuthHeaders({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));
    return res;
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
};