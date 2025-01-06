import request from '@/utils/request';
import { addAuthHeaders, handleAuthFailure } from './utils';

export const checkFavoriteStatus = async (videoId: string | number): Promise<any> => {
  try {
    const res = await request.get(`video/like/check?videoid=${videoId}`, addAuthHeaders({}));
    return handleAuthFailure(res);
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    throw error;
  }
};

export const addFavorite = async (videoId: string | number): Promise<void> => {
  try {
    const res = await request.get(`video/like/add?videoid=${videoId}`, addAuthHeaders({}));
    handleAuthFailure(res);
  } catch (error) {
    console.error('添加收藏失败:', error);
    throw error;
  }
};

export const deleteFavorite = async (videoId: string | number): Promise<void> => {
  try {
    const res = await request.get(`video/like/delete?videoid=${videoId}`, addAuthHeaders({}));
    handleAuthFailure(res);
  } catch (error) {
    console.error('取消收藏失败:', error);
    throw error;
  }
};