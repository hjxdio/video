import request from '@/utils/request';
import { addAuthHeaders, handleAuthFailure } from './utils';

export const getLiveRoom = async (userId: string | number): Promise<any> => {
  try {
    const res = await request.get(`video/liveroom/getliveinfo?userid=${userId}`, addAuthHeaders({}));
    return handleAuthFailure(res);
  } catch (error) {
    console.error('获取直播失败:', error);
    throw error;
  }
};
export const getRoomInfo = async (roomId: string | number): Promise<any> => {
  try {
    const res = await request.get(`video/liveroom/getroominfo?id=${roomId}`, addAuthHeaders({}));
    return handleAuthFailure(res.data);
  } catch (error) {
    console.error('获取直播失败:', error);
    throw error;
  }
};
export const createLiveRoom = async (data: any): Promise<any> => {
  const res = await request.post(`video/liveroom/create`,  data,addAuthHeaders({}),);
  return handleAuthFailure(res);
};

export const updateLiveRoom = async (data: any): Promise<any> => {
  const res = await request.post(`video/liveroom/update`,  data,addAuthHeaders({}));
  return handleAuthFailure(res);
};

export const stopLiveRoom = async (data: any): Promise<any> => {
  const res = await request.post(`video/liveroom/stop`,data,addAuthHeaders({}));
  return handleAuthFailure(res);
};

export const startLiveRoom = async (data: any): Promise<any> => {
  const res = await request.post(`video/liveroom/start`,data,addAuthHeaders({}));
  return handleAuthFailure(res);
};

export const getLiveList = async (): Promise<any> => {
  try {
    const res = await request.get('video/liveroom/list/');
    return res.data;
  } catch (error) {
    console.error('获取直播列表失败:', error);
    throw error;
  }
};

export const getWeb = async (): Promise<any> => {
  try {
    const res = await request.get('video/baseinformation/index/');
    return res.data;
  } catch (error) {
    console.error('获取失败:', error);
    throw error;
  }
};
