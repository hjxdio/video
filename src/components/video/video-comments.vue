<template>
    <div class="comments-section">
      <!-- 评论输入框 -->
      <div class="comment-input" v-if="userStore.islogin">
        <el-input
          v-model="newComment"
          type="textarea"
          :rows="3"
          placeholder="写下你的评论..."
        />
        <el-button type="primary" @click="submitComment" :loading="submitting">
          发表评论
        </el-button>
      </div>
  
      <!-- 骨架屏幕 -->
      <div v-if="loading" class="skeleton-screen">
        <div class="skeleton-item" v-for="n in 3" :key="n">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-content">
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </div>
  
      <!-- 评论列表 -->
      <div v-else class="comments-list">
        <h3 class="comments-title">评论 ({{ comments.length }})</h3>
        
        <div v-if="comments.length === 0" class="no-comments">
          暂无评论，快来抢沙发吧！
        </div>
  
        <div v-else class="comment-items">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <el-avatar :size="32" :src="comment.avatar" />
              <div class="comment-info">
                <span class="username">
                  {{ comment.username }}
                  <n-tag size="small" v-if="comment.userid === props.authorId" type="success">作者</n-tag>
                </span>
                <span class="time">{{ formatDate(comment.createTime) }}</span>
              </div>
            </div>
            <div class="comment-content">
              {{ comment.content }}
            </div>
            
            <!-- 添加回复按钮 -->
            <div class="comment-actions" v-if="userStore.islogin">
              <el-button type="text" @click="showReplyInput(comment.id)">
                回复
              </el-button>
            </div>

            <!-- 回复输入框 -->
            <div class="reply-input" v-if="activeReplyId === comment.id">
              <el-input
                v-model="replyContent"
                type="textarea"
                :rows="2"
                placeholder="写下你的回复..."
              />
              <div class="reply-actions">
                <el-button type="text" @click="cancelReply">取消</el-button>
                <el-button type="primary" size="small" @click="submitReply(comment.id)" :loading="submitting">
                  回复
                </el-button>
              </div>
            </div>

            <!-- 显示回复列表 -->
            <div class="reply-list" v-if="comment.replies && comment.replies.length > 0">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <div class="comment-header">
                  <el-avatar :size="24" :src="reply.avatar" />
                  <div class="comment-info">
                    <span class="username">
                      {{ reply.username }}
                      <n-tag size="small" v-if="reply.userid === props.authorId" type="success">作者</n-tag>
                     
                    </span>
                    <span class="time">{{ formatDate(reply.createTime) }}</span>
                  </div>
                </div>
                <div class="reply-content">
                  <template v-if="reply.replyToUsername">
                    回复 <span class="reply-to">@{{ reply.replyToUsername }}</span>：
                  </template>
                  {{ reply.content }}
                </div>
                <!-- 添加子评论的回复按钮 -->
                <div class="comment-actions" v-if="userStore.islogin">
                  <el-button type="text" @click="showReplyInput(comment.id, reply.userid, reply.username)">
                    回复
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/stores/user'
  import { formatDateTime } from '@/utils/tools'
  import { getComments, addComment, addReply,addMsg } from '@/api/api.js';

const formatDate = formatDateTime

  const props = defineProps({
    videoId: {
      type: [String, Number],
      required: true
    },
    authorId: {
      type: [String, Number],
      required: true
    }
  })
  
  const userStore = useUserStore()
  const comments = ref([])
  const newComment = ref('')
  const submitting = ref(false)
  
  // 新增的响应式变量
  const activeReplyId = ref(null)
  const replyContent = ref('')
  const replyToUserId = ref(null)
  const replyToUsername = ref(null)
  
  const loading = ref(true)
  
  // 获取评论列表
  const fetchComments = async () => {
    loading.value = true;
    try {
      const rawComments = await getComments(props.videoId);
      
      // 将评论分为作者评论和普通评论
      const authorComments = rawComments.filter(comment => comment.userid === props.authorId);
      const normalComments = rawComments.filter(comment => comment.userid !== props.authorId);
      comments.value = [...authorComments, ...normalComments];
    } catch (error) {
      ElMessage.error('获取评论失败:', error);
    } finally {
      loading.value = false;
    }
  };
  
  // 提交评论
  const submitComment = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容');
    return;
  }

  submitting.value = true;
  try {
    const res = await addComment(props.videoId, newComment.value, userStore.userId);
    if (res.code === 200) {
      ElMessage.success('评论成功');
      await addMsg({
        rawdata:res.data,
        videoId:props.videoId,
        type:1,
        userid:userStore.userId,
        username:userStore.user
      });
      newComment.value = '';
      await fetchComments(); // 重新获取评论列表
    } else {
      ElMessage.error(res.msg || '评论失败');
    }
  } catch (error) {
    ElMessage.error('评论失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

  
  // 显示回复输入框
  const showReplyInput = (commentId, toUserId = null, toUsername = null) => {
    activeReplyId.value = commentId
    replyContent.value = ''
    replyToUserId.value = toUserId
    replyToUsername.value = toUsername
  }
  
  // 取消回复
  const cancelReply = () => {
    activeReplyId.value = null
    replyContent.value = ''
    replyToUserId.value = null
    replyToUsername.value = null
  }
  
  // 提交回复
  const submitReply = async (commentId) => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容');
    return;
  }

  submitting.value = true;
  try {
    const res = await addReply(
      props.videoId,
      commentId,
      replyContent.value,
      userStore.userId,
      replyToUserId.value || comments.value.find(comment => comment.id === commentId).userid
    );
    if (res.code === 200) {
      ElMessage.success('回复成功');
      cancelReply();
      
      const parentComment = comments.value.find(comment => comment.id === commentId);
      let parentContent;
      
      if (replyToUserId.value && parentComment.replies) {
        // 如果是回复子评论，parentContent 应该是子评论的内容
        const reply = parentComment.replies.find(reply => reply.userid === replyToUserId.value);
        parentContent = reply.content;
      } else {
        // 如果是回复主评论，parentContent 是主评论的内容
        parentContent = parentComment.content;
      }
      await addMsg({
        rawdata:res.data,
        videoId:props.videoId,
        type:1,
        userid:userStore.userId,
        username:userStore.user,
        parentcontent:parentContent
      });
      await fetchComments();
    } else {
      ElMessage.error(res.msg || '回复失败');
    }
  } catch (error) {
    ElMessage.error('回复失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};
  
  // 组件挂载时获取评论列表
  onMounted(() => {
    fetchComments();
  })
  </script>
  
  <style scoped>
  .comments-section {
    margin-top: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .comment-input {
    margin-bottom: 20px;
  }
  
  .comment-input .el-button {
    margin-top: 10px;
    float: right;
  }
  
  .comments-title {
    margin: 0 0 20px 0;
    color: #303133;
  }
  
  .no-comments {
    text-align: center;
    color: #909399;
    padding: 20px 0;
  }
  
  .comment-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .comment-item {
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .comment-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  
  .comment-info {
    display: flex;
    flex-direction: column;
  }
  
  .username {
    font-weight: 500;
    color: #303133;
  }
  
  .time {
    font-size: 12px;
    color: #909399;
  }
  
  .comment-content {
    color: #606266;
    line-height: 1.6;
    margin-left: 44px;
  }
  
  .comment-actions {
    margin-left: 44px;
    margin-top: 8px;
  }
  
  .reply-input {
    margin-left: 44px;
    margin-top: 8px;
  }
  
  .reply-actions {
    margin-top: 8px;
    text-align: right;
  }
  
  .reply-list {
    margin-left: 44px;
    margin-top: 16px;
  }
  
  .reply-item {
    margin-top: 12px;
    padding: 8px;
    background: #f5f7fa;
    border-radius: 4px;
  }
  
  .reply-content {
    margin-left: 36px;
    font-size: 14px;
  }
  
  .reply-to {
    color: #409EFF;
    font-weight: 500;
  }
  
  .skeleton-screen {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .skeleton-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .skeleton-avatar {
    width: 32px;
    height: 32px;
    background: #e0e0e0;
    border-radius: 50%;
  }
  
  .skeleton-content {
    flex: 1;
  }
  
  .skeleton-line {
    height: 12px;
    background: #e0e0e0;
    margin-bottom: 8px;
    border-radius: 4px;
  }
  
  .skeleton-line.short {
    width: 60%;
  }
  </style>