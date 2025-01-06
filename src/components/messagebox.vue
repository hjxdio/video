<template>
    <div class="launch-container">
        <n-card title="消息中心" class="launch-card">
            <template #header-extra>
                <n-button text type="primary" @click="markAllAsRead" :disabled="!hasUnread">
                    全部标为已读
                </n-button>
            </template>

            <n-tabs type="line" animated>
                <n-tab-pane name="unread" tab="未读消息">
                    <div class="message-list">
                        <template v-if="unreadMessages.length">
                            <div v-for="message in unreadMessages" :key="message.id" class="message-item">
                                <n-card size="small" class="unread clickable-card" @click="navigateToVideo(message)">
                                    <div class="message-header">
                                        <div class="user-info">
                                            <n-avatar size="small" v-if="message.type !== 0" :src="message.FromUserInfo.avatar" />
                                            <span v-if="message.type !== 0" class="username">{{ message.FromUserInfo.user }}</span>
                                            <span v-else class="username" style="color: red">系统通知</span>
                                        </div>
                                        <span class="message-time">{{ message.createTime }}</span>
                                        <n-button size="tiny" type="primary" @click.stop="markAsRead(message.id)">
                                            标记已读
                                        </n-button>
                                    </div>
                                    <div class="message-content">
                                        <template v-if="message.type === 0">
                                            <!-- 系统消息 -->
                                            <div class="system-message">
                                                <p class="system-content" v-html="message.content"></p>
                                            </div>
                                        </template>

                                        <template v-else-if="message.type === 1">
                                            <!-- 评论消息 -->
                                            <div class="comment-message">
                                                <p>在视频 《{{ message.VideoInfo.name }}》 回复了你</p>
                                                <p class="comment-content">{{ message.content }}</p>
                                            </div>
                                        </template>
                                        <template v-else-if="message.type === 2">
                                            <!-- 收藏消息 -->
                                            <div class="favorite-message">
                                                <p>收藏了你的视频 《{{ message.VideoInfo.name }}》</p>
                                            </div>
                                        </template>
                                    </div>
                                </n-card>
                            </div>
                        </template>
                        <n-empty v-else description="暂无未读消息" />
                    </div>
                </n-tab-pane>
                <n-tab-pane name="all" tab="全部消息">
                    <div class="message-list">
                        <template v-if="messages.length">
                            <div v-for="message in messages" :key="message.id" class="message-item">
                                <n-card size="small" :class="{ unread: !message.isread }"
                                    @click="navigateToVideo(message)" class="clickable-card">
                                    <div class="message-header">
                                        <div class="user-info">
                                            <n-avatar size="small" v-if="message.type !== 0":src="message.FromUserInfo.avatar" />
                                            <span v-if="message.type !== 0"class="username">{{ message.FromUserInfo.user }}</span>
                                            <span v-else class="username" style="color: red">系统通知</span>
                                        </div>
                                        <span class="message-time">{{ message.createTime }}</span>
                                        <n-button size="tiny" type="error" @click.stop="deleteMessage(message.id)">
                                            删除
                                        </n-button>
                                    </div>
                                    <div class="message-content">
                                        <template v-if="message.type === 0">
                                            <!-- 系统消息 -->
                                            <div class="system-message">
                                                <p class="system-content" v-html="message.content"></p>
                                            </div>
                                        </template>

                                        <template v-else-if="message.type === 1">
                                            <!-- 评论消息 -->
                                            <div class="comment-message">
                                                <p>评论了你的视频 《{{ message.VideoInfo.name }}》</p>
                                                <p class="comment-content">{{ message.content }}</p>
                                            </div>
                                        </template>

                                        <template v-else-if="message.type === 2">
                                            <!-- 收藏消息 -->
                                            <div class="favorite-message">
                                                <p>收藏了你的视频 《{{ message.VideoInfo.name }}》</p>
                                            </div>
                                        </template>
                                    </div>
                                </n-card>
                            </div>
                        </template>
                        <n-empty v-else description="暂无消息" />
                    </div>
                </n-tab-pane>

            </n-tabs>
        </n-card>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllMsg, setRead, setAllRead, deleteMsg } from '@/api/api'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const messages = ref([])
const loading = ref(false)

const unreadMessages = computed(() => {
    return messages.value.filter(msg => !msg.isread)
})

const hasUnread = computed(() => unreadMessages.value.length > 0)

const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
}

const markAllAsRead = async () => {
    try {
        await setAllRead()
        messages.value = messages.value.map(msg => ({ ...msg, isread: 1 }))
        ElMessage.success('已将所有消息标记为已读')
        userStore.resetUnReadMsg()
    } catch (error) {
        ElMessage.error('操作失败，请稍后重试')
    }
}

const deleteMessage = async (messageId) => {
    try {
        await deleteMsg(messageId)
        messages.value = messages.value.filter(msg => msg.id !== messageId)
        ElMessage.success('已删除消息')
    } catch (error) {
        ElMessage.error('操作失败，请稍后重试')
    }
}

const markAsRead = async (messageId) => {
    try {
        await setRead(messageId)
        messages.value = messages.value.map(msg =>
            msg.id === messageId ? { ...msg, isread: 1 } : msg
        )
        ElMessage.success('已标记为已读')
        userStore.reduceUnReadMsg()
    } catch (error) {
        ElMessage.error('操作失败，请稍后重试')
    }
}

const navigateToVideo = async (message) => {
    if (message.videoid) {
        await setRead()
        userStore.reduceUnReadMsg()
        router.push(`/watch/${message.videoid}`)
    }
}

onMounted(async () => {

    loading.value = true
    try {
        const res = await getAllMsg()
        messages.value = res.data
    } catch (error) {
        ElMessage.error('获取消息失败，请稍后重试')
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>



.message-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.message-item .unread {
    border-left: 3px solid var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.message-title {
    font-weight: 500;
    color: var(--el-text-color-primary);
}

.message-time {
    font-size: 12px;
    color: var(--el-text-color-secondary);
}

.message-content {
    color: var(--el-text-color-regular);
    line-height: 1.5;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.username {
    font-weight: 500;
    color: var(--el-text-color-primary);
}

.comment-message {
    margin-top: 8px;
}

.comment-content {
    margin-top: 4px;
    padding: 8px;
    background-color: var(--el-fill-color-lighter);
    border-radius: 4px;
}

.clickable-card {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.clickable-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
    .message-container {
        padding: 0 10px;
    }
}

.favorite-message {
    margin-top: 8px;
}
.system-message {
    margin-top: 8px;
}

.system-content {
    padding: 8px;
    background-color: var(--el-color-info-light-9);
    border-radius: 4px;
    color: var(--el-text-color-primary);
}
</style>