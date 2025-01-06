import request from '@/utils/request';
import { addAuthHeaders, handleAuthFailure } from './utils';

interface CommentResponse {
  data?: any[]; 
}

interface CommentPayload {
  videoId: string | number;
  content: string;
  userId: string | number;
}

interface ReplyPayload extends CommentPayload {
  parentId: string | number;
  reply_to_user_id: string | number;
}

export const getComments = async (videoId: string | number): Promise<any[]> => {
  try {
    const res: CommentResponse = await request.get(
      `video/comment/get?videoid=${videoId}`,
      addAuthHeaders({})
    );
    return handleAuthFailure(res).data || [];
  } catch (error) {
    console.error('获取评论失败:', error);
    throw error;
  }
};

export const addComment = async (
  videoId: string | number,
  content: string,
  userId: string | number
): Promise<any> => {
  try {
    const payload: CommentPayload = {
      videoId,
      content,
      userId
    };
    const res = await request.post(
      'video/comment/add',
      payload,
      addAuthHeaders({})
    );
    return handleAuthFailure(res);
  } catch (error) {
    console.error('评论失败:', error);
    throw error;
  }
};

export const addReply = async (
  videoId: string | number,
  parentId: string | number,
  content: string,
  userId: string | number,
  replyToUserId: string | number
): Promise<any> => {
  try {
    const payload: ReplyPayload = {
      videoId,
      parentId,
      content,
      userId,
      reply_to_user_id: replyToUserId
    };
    const res = await request.post(
      'video/comment/reply',
      payload,
      addAuthHeaders({})
    );
    return handleAuthFailure(res);
  } catch (error) {
    console.error('回复失败:', error);
    throw error;
  }
}; 