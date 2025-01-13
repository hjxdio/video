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
          <n-form-item label="头像" class="avatar-item">
            <div class="avatar-container">
              <n-avatar
                :size="80"
                :src="avatarUrl"
                :fallback-src="defaultAvatarUrl"
              />
              <n-upload
                :show-file-list="false"
                accept="image/*"
                :action="uploadUrl"
                response-type="json"
                :max="1"
                @finish="handleAvatarChange"
              >
                <n-button size="small" class="upload-btn">
                  更换头像
                </n-button>
              </n-upload>
            </div>
          </n-form-item>
  
          <n-form-item label="用户ID">
            <n-input
              v-model:value="formValue.userId"
              disabled
              placeholder="用户ID"
            />
          </n-form-item>
  
          <n-form-item label="用户名" path="username">
            <n-input
              v-model:value="formValue.username"
              placeholder="输入新用户名"
            />
          </n-form-item>
  
          <n-form-item label="旧密码" path="oldPassword">
            <n-input
              v-model:value="formValue.oldPassword"
              type="password"
              placeholder="输入旧密码"
              @keydown.enter.prevent
            />
          </n-form-item>
  
          <n-form-item label="新密码" path="newPassword">
            <n-input
              v-model:value="formValue.newPassword"
              type="password"
              placeholder="输入新密码（可选）"
              @keydown.enter.prevent
            />
          </n-form-item>
  
          <n-form-item label="确认新密码" path="confirmPassword">
            <n-input
              v-model:value="formValue.confirmPassword"
              type="password"
              placeholder="再次输入新密码"
              @keydown.enter.prevent
            />
          </n-form-item>
  
          <n-form-item>
            <n-button
              type="primary"
              @click="handleSubmit"
              :loading="submitting"
              block
            >
              保存修改
            </n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/stores/user'
  import { updateUserInfo} from '@/api/api'
  import { checkChinese } from '@/utils/tools';
  const userStore = useUserStore()
  const formRef = ref(null)
  const submitting = ref(false)
  const avatarUrl = ref(userStore.avatar || '')
  const defaultAvatarUrl = 'path/to/default/avatar.png'
  const uploadUrl = import.meta.env.VITE_API_URL + '/video/upload/uploadava';
  const formValue = reactive({
    userId: String(userStore.userId),
    username: userStore.user,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const rules = {
    username: {
      required: true,
      message: '请输入用户名',
      trigger: ['blur', 'input']
    },
    oldPassword: {
      required: true,
      message: '请输入旧密码',
      trigger: ['blur', 'input']
    },
    newPassword: {
      validator: (rule, value) => {
        if (value && value.length < 6) {
          return new Error('密码长度至少6位')
        }
        return true
      },
      trigger: ['blur', 'input']
    },
    confirmPassword: {
      validator: (rule, value) => {
        if (formValue.newPassword && value !== formValue.newPassword) {
          return new Error('两次输入的密码不一致')
        }
        return true
      },
      trigger: ['blur', 'input']
    }
  }
  
  const handleAvatarChange = async ({
  file,
  event
}) => {
    const postdata = event.currentTarget.response
    console.log(postdata)
  try{
    if(postdata.code === 200){
      avatarUrl.value = 'https://'+postdata.url
    }else{
      ElMessage.error(postdata.msg || '头像上传失败')
    }
  }catch(error){
    ElMessage.error('头像上传失败，请稍后重试')
  }
}

  
  const handleSubmit = (e) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        if(await checkChinese(formValue.username)){
          ElMessage.error('用户名不能包含中文字符')
          return;
        }
        submitting.value = true
        try {
          const userData = {
            name: formValue.username,
            oldpass: formValue.oldPassword,
            newpass: formValue.newPassword || undefined,
            avatar: avatarUrl.value,
            id: userStore.userId
          }
          
          const res = await updateUserInfo(userData)
          if (res.code === 200) {
            if (formValue.newPassword) {
              ElMessage.success('修改成功，请重新登录')
              userStore.logout()
            } else {
              ElMessage.success('修改成功')
              userStore.updateUser({ user: formValue.username,avatar: avatarUrl.value })
            }
          } else {
            ElMessage.error(res.msg || '修改失败')
          }
        } catch (error) {
          ElMessage.error('修改失败，请稍后重试')
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
  
  .avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
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
  
