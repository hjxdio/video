<template>
  <div class="chat-room">
    <div class="chat-header">
      <h3>{{name}}的直播间</h3>
      <span class="online-count">{{ onlineCount }}人正在看</span>
    </div>
    <div class="messages" ref="messagesContainer">
      <div v-for="msg in messages" :key="msg.id" class="message">
        <span class="username" :style="{ color: msg.userColor }">{{ msg.username }}:</span>
        <span class="content">{{ msg.content }}</span>
      </div>
    </div>

    <div class="input-area">
      <el-input
        v-model="newMessage"
        placeholder="发送消息..."
        @keyup.enter="sendMessage"
        :maxlength="100"
      >
        <template #append>
          <el-button @click="sendMessage">发送</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  roomId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  isLiveView: {
    type: Boolean,
    default: false
  }
});

const userStore = useUserStore();
const messages = ref([]);
const newMessage = ref('');
const onlineCount = ref(0);
const messagesContainer = ref(null);
const ws = ref(null);
const router = useRouter();

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const connectWebSocket = () => {
  ws.value = new WebSocket(`ws://140.143.186.184:2346`);
  ws.value.onerror = (error) => {
    ElMessage.error('错误:', error);
  };
  
  ws.value.onopen = () => {
    // 连接成功后发送加入房间消息
    ws.value.send(JSON.stringify({
      type: 'join',
      roomId: props.roomId,
      userId: props.userId,
      username: userStore.user
    }));
  };
  
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'force_disconnect':
        ElMessage.warning(data.message);
        ws.value?.close();
        if (props.isLiveView) {
          router.push('/');
        }
        break;
      case 'message':
        messages.value.push(data);
        scrollToBottom();
        break;
      case 'online_count':
        onlineCount.value = data.count;
        break;
      case 'system':
        messages.value.push({
          id: Date.now(),
          content: data.content,
          isSystem: true
        });
        scrollToBottom();
        break;
    }
  };
  
  ws.value.onclose = () => {
    ElMessage.error('连接已关闭');
    reconnect();
  };
};

const reconnect = () => {
  if (reconnectAttempts.value >= maxReconnectAttempts) {
    ElMessage.error('达到最大重连次数');
    return;
  }
  
  setTimeout(() => {
    ElMessage.log('尝试重新连接...');
    connectWebSocket();
    reconnectAttempts.value++;
  }, 3000); // 3秒后重试
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
    ElMessage.error('未连接');
    return;
  }
  
  const messageData = {
    type: 'message',
    content: newMessage.value,
    userId: props.userId,
    username: userStore.user,
  };
  ws.value.send(JSON.stringify(messageData));
  
  newMessage.value = '';
};

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  ws.value?.close();
});
</script>

<style scoped>
.chat-room {
  height: 600px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.chat-header {
  padding: 10px 15px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.online-count {
  color: #909399;
  font-size: 14px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.message {
  margin-bottom: 8px;
  line-height: 1.4;
}

.username {
  font-weight: bold;
  margin-right: 6px;
}

.input-area {
  padding: 15px;
  border-top: 1px solid #dcdfe6;
}
</style> 