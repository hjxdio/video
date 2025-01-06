import { useUserStore } from '@/stores/user';

interface Config {
  headers?: Record<string, string>;
  [key: string]: any;
}

interface ApiResponse {
  code: number;
  data: any;
  msg?: string;
}

export const addAuthHeaders = (config: Config): Config => {
  const userStore = useUserStore();
  const token = userStore.token;
  const id = userStore.userId;
  return {
    ...config,
    headers: {
      ...config.headers,
      token,
      id
    }
  };
};

export const handleAuthFailure = (res): ApiResponse => {
  if (res.code === 0) {
    throw new Error('鉴权失败');
  }
  return res;
};