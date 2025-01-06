<template>

    <div class="launch-container">
        <n-card class="launch-card">
            <n-tabs type="line" animated v-model:value="activeTab">
                <n-tab-pane name="mylive" tab="我的直播">
                    <n-empty v-if="!isRoom" description="暂无直播,请先创建直播" />
                    <div v-else class="live-info">
                        <n-card>
                            <div class="live-header">
                                <n-image
                                    :src="liveRoom.post"
                                    :width="200"
                                    :height="112"
                                    object-fit="cover"
                                />
                                <div class="live-status">
                                    <n-tag type="success" size="small" v-if="liveRoom.islive === 1">直播中</n-tag>
                                    <n-tag type="warning" size="small" v-else>未开播</n-tag>
                                </div>
                            </div>
                            <div class="live-content">
                                <div class="live-title">
                                    <h3>{{ liveRoom.roomname }}</h3>
                                    <n-tag type="success" size="small" >ID:{{ liveRoom.id }}</n-tag>
                                </div>
                                <p class="description">{{ liveRoom.roomdes }}</p>
                                <div v-if="liveRoom.islive === 1">
                                    <p>推流地址：rtmp://39.107.142.61/live/{{ liveRoom.url }}</p>
                                </div>
                            </div>
                            <div class="live-actions">
                                <n-button type="primary" @click="activeTab = 'createLive'">
                                    编辑直播
                                </n-button>
                                <n-button type="info" @click="handleEnterLive" v-if="liveRoom.islive === 1">
                                    进入直播间
                                </n-button>
                                <n-button type="info" @click="handleStopLive" v-if="liveRoom.islive === 1">
                                    停止直播
                                </n-button>
                                <n-button type="info" @click="handleStartLive" v-else>
                                    开始直播
                                </n-button>
                            </div>
                        </n-card>
                    </div>
                </n-tab-pane>

                <n-tab-pane name="createLive" :tab="isRoom ? '直播设置' : '创建直播'">
                    <div class="settings-container">
                        <n-card class="settings-card">
                            <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="left"
                                label-width="100" size="medium">
                                <n-form-item label="封面" class="cover-item">
                                    <div class="cover-container">
                                        <n-image v-if="coverUrl" :src="coverUrl" :width="200" :height="112"
                                            object-fit="cover" />
                                        <div v-else class="cover-placeholder">
                                            暂无封面图片
                                        </div>
                                        <n-upload :show-file-list="false" accept="image/*"
                                            action="https://api.tmzjy.cn/video/upload/uploadava" response-type="json"
                                            :max="1" @finish="handleCoverChange">
                                            <n-button size="small" class="upload-btn">
                                                上传封面
                                            </n-button>
                                        </n-upload>
                                    </div>
                                </n-form-item>

                                <n-form-item label="直播间名称" path="title">
                                    <n-input v-model:value="formValue.title" placeholder="请输入直播间名称" />
                                </n-form-item>

                                <n-form-item label="直播描述" path="description">
                                    <n-input v-model:value="formValue.description" type="textarea" placeholder="请输入直播描述"
                                        :rows="4" />
                                </n-form-item>

                                <n-form-item>
                                    <n-button type="primary" @click="handleSubmit" :loading="submitting" block>
                                        {{ isRoom ? '更新直播间' : '创建直播间' }}
                                    </n-button>
                                </n-form-item>
                            </n-form>
                        </n-card>
                    </div>

                </n-tab-pane>
            </n-tabs>
        </n-card>
    </div>

</template>
<script setup>
import { getLiveRoom, createLiveRoom, updateLiveRoom,startLiveRoom,stopLiveRoom } from '@/api/live';
import { useUserStore } from '@/stores/user';
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore();
const liveRoom = ref(null);

const formRef = ref(null)
const submitting = ref(false)
const coverUrl = ref('')

const isRoom = ref(false);
const activeTab = ref('mylive');
const formValue = reactive({
    title: '',
    description: '',
})

const rules = {
    title: {
        required: true,
        message: '请输入直播间名称',
        trigger: ['blur', 'input']
    },
    description: {
        required: true,
        message: '请输入直播描述',
        trigger: ['blur', 'input']
    }
}

const handleCoverChange = async ({ file, event }) => {
    const postdata = event.currentTarget.response
    try {
        if (postdata.code === 200) {
            coverUrl.value = 'https://' + postdata.url
        } else {
            ElMessage.error(postdata.msg || '封面上传失败')
        }
    } catch (error) {
        ElMessage.error('封面上传失败，请稍后重试')
    }
}
const handleStartLive = async () => {
    try {
       const res= await startLiveRoom({ id: liveRoom.value.id })
        ElMessage.success('直播已开始')
        liveRoom.value.url = res.data
        liveRoom.value.islive = 1
    } catch (error) {
        console.log(error);
        ElMessage.error('操作失败，请稍后重试')
    }
}
const handleStopLive = async () => {
    try {
        const res = await stopLiveRoom({ id: liveRoom.value.id })
        ElMessage.success('直播已停止')
        liveRoom.value.islive = 0
        liveRoom.value.url = ''
    } catch (error) {
        console.log(error);
        ElMessage.error('操作失败，请稍后重试')
    }
}
const handleEnterLive = () => {
    router.push(`/watch/live${liveRoom.value.id}`)
}
const handleSubmit = (e) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            submitting.value = true
            try {
                const liveData = {
                    title: formValue.title,
                    description: formValue.description,
                    cover: coverUrl.value,
                    userid: userStore.userId,
                    id:null,
                }
                if (isRoom.value) {
                    liveData.id = liveRoom.value.id;
                    const res = await updateLiveRoom(liveData);
                    if (res.code === 200) {
                        ElMessage.success('更新成功')
                        liveRoom.value = res.data; 
                        activeTab.value = 'mylive';
                    }
                } else {
                    const res = await createLiveRoom(liveData);
                    if (res.code === 200) {
                        ElMessage.success('创建成功')
                        isRoom.value = true;
                        liveRoom.value = res.data;
                        activeTab.value = 'mylive';
                    }
                }

            } catch (error) {
                console.log(error);
                ElMessage.error('操作失败，请稍后重试')
            } finally {
                submitting.value = false
            }
        } else {
            ElMessage.error('请检查输入信息')
        }
    })
}


onMounted(async () => {
    liveRoom.value = await getLiveRoom(userStore.userId);
    if (liveRoom.value.data) {
        isRoom.value = true;
        liveRoom.value = liveRoom.value.data;
        coverUrl.value = liveRoom.value.post;
        formValue.title = liveRoom.value.roomname;
        formValue.description = liveRoom.value.roomdes;
    }
});
</script>
<style scoped>

.cover-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.cover-placeholder {
    width: 200px;
    height: 112px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    border-radius: 4px;
}

.upload-btn {
    margin-top: 8px;
}

@media (max-width: 768px) {
    .settings-container {
        padding: 0 10px;
    }
}

.live-info {
    max-width: 800px;
    margin: 20px auto;
    padding: 0 20px;
    
}

.live-header {
    position: relative;
    margin-bottom: 16px;
}

.live-status {
    position: absolute;
    top: 8px;
    right: 8px;
}

.live-content {
    margin-bottom: 16px;
}

.live-content h3 {
    margin: 0 0 8px 0;
}

.description {
    color: #666;
    margin: 0;
}

.live-actions {
    display: flex;
    gap: 12px;
}

.live-title {
    display: flex;
    align-items: center;
    gap: 12px;
}
</style>
