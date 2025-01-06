<template>
    <n-modal v-model:show="showEditModal" preset="card" title="编辑视频" style="width: 600px">
        <n-form ref="editFormRef" :model="editForm" label-placement="left" label-width="80" :rules="rules">
            <n-form-item label="视频名称" path="name">
                <n-input v-model:value="editForm.name" placeholder="请输入视频名称" />
            </n-form-item>

            <n-form-item label="视频描述" path="description">
                <n-input v-model:value="editForm.description" type="textarea" placeholder="请输入视频描述" :rows="4" />
            </n-form-item>
        </n-form>

        <template #footer>
            <n-space justify="end">
                <n-button @click="showEditModal = false">取消</n-button>
                <n-button type="primary" @click="handleEditSubmit" :loading="submitting">
                    保存
                </n-button>
            </n-space>
        </template>
    </n-modal>

    <div class="manage-videos">
        <div class="video-filters">
            <n-space align="center">
                <n-input v-model:value="searchQuery" placeholder="搜索视频..." style="width: 200px">
                    <template #prefix>
                        <n-icon>
                            <Search />
                        </n-icon>
                    </template>
                </n-input>
                <n-select v-model:value="filterType" :options="filterOptions" placeholder="筛选类型" style="width: 150px" />
            </n-space>
        </div>

        <div class="video-list" v-if="videos.length">
            <n-card v-for="video in filteredVideos" :key="video.id" class="video-item">
                <div class="video-container">
                    <div class="video-content">
                        <n-image :src="video.post" :preview-disabled="true" class="video-thumbnail" object-fit="cover"
                            width="120" height="68" />
                        <div class="video-info">
                            <h3 class="video-title">{{ video.name }}</h3>
                            <n-space size="small" style="margin-top: 8px">
                                <n-tag size="small">
                                    <template #icon>
                                        <n-icon>
                                            <View />
                                        </n-icon>
                                    </template>
                                    {{ video.view }} 
                                </n-tag>

                                <n-tag size="small">
                                    <template #icon>
                                        <n-icon>
                                            <Comment />
                                        </n-icon>
                                    </template>
                                    {{ video.comments }} 
                                </n-tag>

                                <n-tag size="small">
                                    <template #icon>
                                        <n-icon>
                                            <Star />
                                        </n-icon>
                                    </template>
                                    {{ video.stars }} 
                                </n-tag>
                                
                                <n-tag size="small" type="success" v-if="video.isori">原创</n-tag>
                            </n-space>
                        </div>
                    </div>
                    <div class="video-actions">
                        <n-space>
                            <n-button size="small" @click="editVideo(video)">编辑</n-button>
                            <n-button size="small" type="error" @click="deleteVideo(video.id)">删除</n-button>
                        </n-space>
                    </div>
                </div>
            </n-card>
        </div>

        <n-empty v-else description="暂无投稿视频" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage} from 'element-plus'
import { Search, View } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getUserVideoList, deleteMyVideo, updateVideo } from '@/api/api'

const userStore = useUserStore()
const videos = ref([])
const searchQuery = ref('')
const filterType = ref(null)

const showEditModal = ref(false)
const editForm = ref({
    id: null,
    name: '',
    description: '',
    userid: userStore.userId
})
const editFormRef = ref(null)
const submitting = ref(false)

const rules = {
    name: {
        required: true,
        message: '请输入视频名称',
        trigger: ['blur', 'input']
    },
    description: {
        required: true,
        message: '请输入视频描述',
        trigger: ['blur', 'input']
    }
}

const filterOptions = [
    { label: '全部视频', value: 'all' },
    { label: '原创视频', value: 'original' },
    { label: '非原创视频', value: 'non-original' }
]

const filteredVideos = computed(() => {
    let result = videos.value.filter(video =>
        video.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

    if (filterType.value === 'original') {
        result = result.filter(video => video.isori)
    } else if (filterType.value === 'non-original') {
        result = result.filter(video => !video.isori)
    }

    return result
})

const fetchVideos = async () => {
    try {
        const data = await getUserVideoList(userStore.userId)
        videos.value = data.filter(video => video.userid === userStore.userId)
    } catch (error) {
        ElMessage.error('获取视频列表失败')
    }
}

const deleteVideo = async (videoId) => {
    try {
        await ElMessageBox.confirm('确定要删除这个视频吗？', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })

        const res = await deleteMyVideo(videoId, userStore.userId)

        if (res.code === 200) {
            ElMessage.success('删除成功')
            await fetchVideos()
        } else {
            ElMessage.error(res.msg || '删除失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败，请稍后重试')
        }
    }
}

const editVideo = (video) => {
    editForm.value = {
        id: video.id,
        name: video.name,
        description: video.description || '',
        userid: video.userid
    }
    showEditModal.value = true
}

const handleEditSubmit = () => {
    editFormRef.value?.validate(async (errors) => {
        if (errors) {
            return ElMessage.error('请填写完整信息')
        }

        submitting.value = true
        try {
            console.log(editForm.value)
            const res = await updateVideo(editForm.value)
            if (res.code === 200) {
                ElMessage.success('更新成功')
            } else {
                ElMessage.error(res.msg || '更新失败')
            }

            const index = videos.value.findIndex(v => v.id === editForm.value.id)
            if (index !== -1) {
                videos.value[index] = {
                    ...videos.value[index],
                    name: editForm.value.name,
                    description: editForm.value.description
                }
            }
            showEditModal.value = false
        } catch (error) {
            ElMessage.error('更新失败，请稍后重试')
        } finally {
            submitting.value = false
        }
    })
}

onMounted(() => {
    fetchVideos()
})
</script>

<style scoped>
.manage-videos {
    padding: 20px 0;
}

.video-filters {
    margin-bottom: 20px;
}

.video-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.video-item {
    transition: all 0.3s ease;
}

.video-item:hover {
    transform: translateX(4px);
}

.video-thumbnail {
    border-radius: 4px;
    overflow: hidden;
}

.video-info {
    flex: 1;
}

.video-info h3 {
    margin: 0;
    font-size: 16px;
    color: #303133;
}

.video-actions {
    display: flex;
    justify-content: flex-end;
    min-width: 120px;
    margin-left: auto;
    flex-shrink: 0;
}

.video-container {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.video-content {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    margin-right: 120px; /* 为按钮预留空间 */
}

.video-info {
    flex: 1;
    min-width: 0;
    margin-left: 12px;
}

.video-title {
    margin: 0;
    font-size: 16px;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.video-actions {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}
</style>