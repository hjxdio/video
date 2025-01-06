import request from '@/utils/request';
import { addAuthHeaders, handleAuthFailure } from './utils';
import { AxiosResponse } from 'axios';

interface VideoData {
  id?: number | string;
  title?: string;
  description?: string;
  url?: string;
  cover?: string;
  [key: string]: any;
}

interface ApiResponse<T = any> {
  data?: T;
  streams?: T;
  code: number;
  message?: string;
}

export const getVideoList = async (): Promise<ApiResponse> => {
  try {
    const res = await request.get('video/livelist/getInfo');
    return res.data;
  } catch (error) {
    console.error('获取视频列表失败:', error);
    throw error;
  }
};
export const getVideoListR = async (): Promise<ApiResponse> => {
  try {
    const res = await request.get('video/livelist/getInfor');
    return res.data;
  } catch (error) {
    console.error('获取视频列表失败:', error);
    throw error;
  }
};

export const getUserVideoList = async (userId: string | number): Promise<ApiResponse> => {
  try {
    const res = await request.get(`video/livelist/getUserInfo?userid=${userId}`);
    return res.data;
  } catch (error) {
    console.error('获取视频列表失败:', error);
    throw error;
  }
};

export const searchVideoList = async (searchName: string): Promise<ApiResponse> => {
  try {
    const res = await request.get(`video/livelist/getsearch?search=${searchName}`);
    return res.data;
  } catch (error) {
    console.error('搜索视频列表失败:', error);
    throw error;
  }
};

export const getLikedVideos = async (): Promise<ApiResponse> => {
  try {
    const res = await request.get(`video/like/list`, addAuthHeaders({}));
    return res.data;
  } catch (error) {
    console.error('获取收藏视频列表失败:', error);
    throw error;
  }
};


export const getSwiperList = async (): Promise<ApiResponse> => {
  try {
    const res = await request.get('video/livelist/getswiper');
    return res.data;
  } catch (error) {
    console.error('获取轮播图列表失败:', error);
    throw error;
  }
};

export const getVideoInfo = async (videoId: string | number): Promise<ApiResponse> => {
  try {
    const res = await request.get(`video/livelist/getvideo?id=${videoId}`);
    return res.data;
  } catch (error) {
    console.error('获取视频信息失败:', error);
    throw error;
  }
};

export const getOriList = async (): Promise<ApiResponse> => {
  try {
    const res = await request.get(`video/livelist/getorivideo`);
    return res.data;
  } catch (error) {
    console.error('获取信息失败:', error);
    throw error;
  }
};

export const addViews = async (videoId: string | number): Promise<ApiResponse> => {
  try {
    const res = await request.get(`video/livelist/addview?videoid=${videoId}`);
    return res.data;
  } catch (error) {
    console.error('增加浏览量失败:', error);
    throw error;
  }
};

export const deleteMyVideo = async (videoId: string | number, userId: string | number): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.get(`video/livelist/delete?videoid=${videoId}&userid=${userId}`, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('删除视频失败:', error);
    throw error;
  }
};

export const updateVideo = async (videoData: VideoData): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.post('video/livelist/update', videoData, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('更新视频失败:', error);
    throw error;
  }
};