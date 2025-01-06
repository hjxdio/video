<template>
  <div class="settings-container">
    <n-card class="settings-card">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="100"
        size="medium"
      >
        <n-form-item label="封面" class="cover-item">
          <div class="cover-container">
            <n-image
              v-if="coverUrl"
              :src="coverUrl"
              :width="200"
              :height="112"
              object-fit="cover"
            />
            <div v-else class="cover-placeholder">
              暂无封面图片
            </div>
            <n-upload
              :show-file-list="false"
              accept="image/*"
              action="https://api.tmzjy.cn/video/upload/uploadava"
              response-type="json"
              :max="1"
              @finish="handleCoverChange"
            >
              <n-button size="small" class="upload-btn">
                上传封面
              </n-button>
            </n-upload>
          </div>
        </n-form-item>

        <n-form-item label="直播间名称" path="title">
          <n-input
            v-model:value="formValue.title"
            placeholder="请输入直播间名称"
          />
        </n-form-item>

        <n-form-item label="直播描述" path="description">
          <n-input
            v-model:value="formValue.description"
            type="textarea"
            placeholder="请输入直播描述"
            :rows="4"
          />
        </n-form-item>

        <n-form-item>
          <n-button
            type="primary"
            @click="handleSubmit"
            :loading="submitting"
            block
          >
            创建直播间
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const submitting = ref(false)
const coverUrl = ref('')

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

const handleSubmit = (e) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      submitting.value = true
      try {
        const liveData = {
          title: formValue.title,
          description: formValue.description,
          cover: coverUrl.value
        }
        
        // TODO: 调用创建直播间的 API
        console.log('创建直播间数据:', liveData)
        ElMessage.success('创建成功')
        
      } catch (error) {
        ElMessage.error('创建失败，请稍后重试')
      } finally {
        submitting.value = false
      }
    } else {
      ElMessage.error('请检查输入信息')
    }
  })
}
</script>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 0 20px;
}

.settings-card {
  background: #fff;
  border: none;
}

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
</style>