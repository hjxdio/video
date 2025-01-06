<template>
    <div class="login-container">
        <n-form ref="formRef" 
                :model="formValue" 
                :rules="rules"
                label-placement="left" 
                label-width="80"
                size="large">
            <n-form-item label="用户名" path="user.name">
                <n-input v-model:value="formValue.user.name" 
                         placeholder="输入用户名"
                         :autofocus="true">
                    <template #prefix>
                        <el-icon><Avatar /></el-icon>
                    </template>
                </n-input>
            </n-form-item>
            
            <n-form-item label="密码" path="user.pass">
                <n-input v-model:value="formValue.user.pass" 
                         type="password" 
                         placeholder="输入密码"
                         @keyup.enter="checkUser">
                    <template #prefix>
                        <el-icon><Lock /></el-icon>
                    </template>
                </n-input>
            </n-form-item>

            <n-form-item label="验证码" path="captcha">
                <n-space align="center">
                    <n-input v-model:value="formValue.captcha" 
                            placeholder="验证码"
                            style="width: 150px" />
                    <div class="captcha-container" @click="getcaptcha">
                        <n-image v-if="captchaurl" 
                                :src="captchaurl"
                                preview-disabled
                                :img-props="{ style: 'height: 40px; cursor: pointer' }" />
                    </div>
                </n-space>
            </n-form-item>

            <n-form-item>
                <n-button type="primary"
                          block
                          attr-type="button"
                          :loading="logining"
                          @click="checkUser">
                    {{ logining ? '登录中...' : '登录' }}
                </n-button>
            </n-form-item>
            <div class="switch-mode">
                还没有账号？<a href="#" @click.prevent="emit('switch-mode')">立即注册</a>
            </div>
        </n-form>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted ,defineEmits} from 'vue'
import { getCaptcha, checkUserInfo,getUnreadCount } from '@/api/api';
import md5 from 'md5';
const rules = reactive({
    user: {
        name: {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
        },
        pass: {
            required: true,
            message: '请输入密码',
            trigger: ['input', 'blur']
        }
    },
    captcha: {
        required: true,
        message: '请输入验证码',
        trigger: ['input']
    }
})
const formRef = ref(null)
const formValue = reactive({
    user: {
        name: '',
        pass: ''
    },
    captcha: ''
})
const captchaistrue = ref(false)
const captchaurl = ref('')
const md5code = ref('')
const captchatoken = ref('')
const logining = ref(false)
const userStore = useUserStore();
const emit = defineEmits(['callBack', 'switch-mode']);
onMounted(() => {
    getcaptcha();
})
async function getcaptcha() {
  if (!captchaistrue.value) {
    try {
      const data = await getCaptcha();
      captchaurl.value = data.url;
      md5code.value = data.key;
      captchatoken.value = data.token;
    } catch (error) {
      ElMessage.error('获取验证码失败，请稍后重试');
    }
  }
}
async function checkUser(e) {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const hashedCaptcha = md5(md5(formValue.captcha));
      if (hashedCaptcha !== md5code.value) {
        ElMessage.error('验证码错误');
        return;
      }
      logining.value = true;
      const userData = {
        name: formValue.user.name,
        pass: formValue.user.pass,
        captcha: formValue.captcha.toLowerCase(),
        token: captchatoken.value,
      };
      try {
        const res = await checkUserInfo(userData);
        if (res.code == 1) {
          if(res.data.status==1){
            ElMessage.error('账号已锁定，请联系管理员');
            return;
          }
          userStore.updateUser({
            islogin: true,
            token: res.data.token,
            user: formValue.user.name,
            userId: res.data.id,
            time: Date.now(),
            avatar: res.data.avatar,
            points: res.data.points,
            unReadMsg:0
          });
          const unread=await getUnreadCount(res.data.id)
          userStore.setUnReadMsg(unread.data)
          ElMessage.success('登录成功');
          emit('callBack', 1);
        } else if (res.code == -1) {
          ElMessage.error('请求过于频繁，请' + res.msg + '秒后重试');
          setTimeout(() => {
            logining.value = false;
          }, res.msg * 1000);
        } else {
          ElMessage.error(res.msg);
        }
      } catch (error) {
        ElMessage.error('登录失败，请稍后重试');
      } finally {
        logining.value = false;
      }
    } else {
      ElMessage.error('请输入信息');
    }
  });
}
</script>

<style scoped>
.login-container {
    width: 350px;
    margin: 20px auto;
    padding: 20px;
}

.captcha-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
}

.captcha-container:hover {
    border-color: #18a058;
}

:deep(.n-form-item-label) {
    font-weight: 500;
}

:deep(.n-input) {
    border-radius: 4px;
}

:deep(.n-button) {
    font-weight: 500;
}

.switch-mode {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
}

.switch-mode a {
    color: #18a058;
    text-decoration: none;
}

.switch-mode a:hover {
    text-decoration: underline;
}
</style>