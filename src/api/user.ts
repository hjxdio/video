import request from '@/utils/request';
import { addAuthHeaders, handleAuthFailure } from './utils';
import { AxiosResponse } from 'axios';

interface UserData {
  username?: string;
  password?: string;
  email?: string;
  avatar?: string;
  [key: string]: any;
}

interface MessageData {
  userid: string | number;
  content: string;
  type?: string;
  [key: string]: any;
}

interface ApiResponse<T = any> {
  data: T;
  code: number;
  message: string;
}

export const checkUserInfo = async (userData: UserData): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.post('User/check', userData);
    return res;
  } catch (error) {
    console.error('用户验证失败:', error);
    throw error;
  }
};

export const registerUser = async (userData: UserData): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.post('User/register', userData);
    return res;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

export const updateUserInfo = async (userData: UserData): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.post('User/update', userData, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

export const getUserAva = async (userId: string | number): Promise<any> => {
  try {
    const res = await request.get(`video/livelist/oriuseravatar?userid=${userId}`);
    return res.data;
  } catch (error) {
    console.error('获取信息失败:', error);
    throw error;
  }
};

export const getCaptcha = async (): Promise<any> => {
  try {
    const res = await request.get('getCaptcha');
    return res.data;
  } catch (error) {
    console.error('获取验证码失败:', error);
    throw error;
  }
};

export const getUnreadCount = async (): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.get(`video/message/getunreadcount`, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('查询未读消息失败:', error);
    throw error;
  }
};

export const getUnreadMsg = async (): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.get(`video/message/getunreadmsg`, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('查询未读消息失败:', error);
    throw error;
  }
};

export const getAllMsg = async (): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.get(`video/message/getallmsg`, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('查询消息失败:', error);
    throw error;
  }
};

export const setRead = async (msgid: string | number): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.get(`video/message/setread?msgid=${msgid}`, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('设置已读失败:', error);
    throw error;
  }
};

export const setAllRead = async (): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.get(`video/message/setallread`, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('设置已读失败:', error);
    throw error;
  }
};

export const addMsg = async (data: MessageData): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.post('video/message/addmsg', data, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('添加消息失败:', error);
    throw error;
  }
};

export const deleteMsg = async (msgid: string | number): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.get(`video/message/deletemsg?msgid=${msgid}`, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('删除消息失败:', error);
    throw error;
  }
};
export const addCreditByToken = async (token: string | number): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.get(`video/credits/add?token=${token}`, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('添加积分失败:', error);
    throw error;
  }
};

export const addCreditByCard = async (token: string | number): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const res = await request.get(`video/credits/addbycard?card=${token}`, addAuthHeaders({}));
    return res;
  } catch (error) {
    console.error('添加积分失败:', error);
    throw error;
  }
};