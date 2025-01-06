<template>
    <div class="video-info">
        <div class="video-meta" v-if="views">
            <div class="stats">
                <span class="views">
                    <el-icon>
                        <View />
                    </el-icon>
                    {{ views || 0 }} 次观看
                </span>
                <span class="date">
                    <el-icon>
                        <Calendar />
                    </el-icon>
                    {{ createTime }}
                </span>
            </div>
            <div class="video-actions" v-if="userId">
                <el-button type="primary" :icon="isFavorited ? StarFilled : Star" @click="handleFavorite" circle />
                <el-button type="primary" :icon="Share" @click="handleShare" circle />
            </div>
        </div>

        <div class="video-description" v-if="description">
            <p>{{ description }}</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { checkFavoriteStatus, addFavorite, deleteFavorite } from '@/api/api';
import { Calendar, View, Star, Share, StarFilled } from '@element-plus/icons-vue'
const isFavorited = ref(false)
const props = defineProps({
    views: {
        type: Number,
        default: 0
    },
    createTime: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    videoId: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        required: true
    }
})

function handleFavorite() {
    if (isFavorited.value) {
        deleteFavorite(props.videoId)
            .then(() => {
                isFavorited.value = false;
            })
            .catch(error => {
                ElMessage.error('取消收藏失败:', error);
            });
    } else {
        addFavorite(props.videoId)
            .then(() => {
                isFavorited.value = true;
            })
            .catch(error => {
                ElMessage.error('添加收藏失败:', error);
            });
    }
}

async function handleShare() {
    const currentUrl = window.location.href;

    try {
        await navigator.clipboard.writeText(currentUrl)
        ElMessage({
          type: 'success',
          message: '地址已复制到剪贴板'
        });
    } catch (err) {
        ElMessage.error('复制失败，请手动复制', err);
    }
}

onMounted(() => {
    if(props.videoId){
        checkFavoriteStatus(props.videoId)
            .then(res => {
                console.log(res);
            isFavorited.value = res;
        })
        .catch(error => {
            ElMessage.error('检查收藏状态失败:', error);
        });
    }
})
</script>
<style scoped>
.video-info {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.video-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
}

.stats {
    display: flex;
    gap: 16px;
    color: #909399;
}

.stats span {
    display: flex;
    align-items: center;
    gap: 4px;
}

.video-actions {
    display: flex;
    gap: 12px;
}

.video-description {
    color: #606266;
    line-height: 1.6;
    white-space: pre-wrap;
}

@media (max-width: 768px) {
    .video-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
}
</style>