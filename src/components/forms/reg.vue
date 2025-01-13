<template>
    <div class="reg-container">
        <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="left" label-width="90" size="large" @keyup.enter="handleRegister">
            <n-form-item label="用户名" path="user.name">
                <n-input v-model:value="formValue.user.name" placeholder="输入用户名" :autofocus="true">
                    <template #prefix>
                        <el-icon>
                            <Avatar />
                        </el-icon>
                    </template>
                </n-input>
            </n-form-item>

            <n-form-item label="密码" path="user.pass">
                <n-input v-model:value="formValue.user.pass" type="password" placeholder="输入密码">
                    <template #prefix>
                        <el-icon>
                            <Lock />
                        </el-icon>
                    </template>
                </n-input>
            </n-form-item>

            <n-form-item label="确认密码" path="user.confirmPass">
                <n-input v-model:value="formValue.user.confirmPass" type="password" placeholder="再次输入密码">
                    <template #prefix>
                        <el-icon>
                            <Lock />
                        </el-icon>
                    </template>
                </n-input>
            </n-form-item>

            <n-form-item label="验证码" path="captcha">
                <n-space align="center">
                    <n-input v-model:value="formValue.captcha" placeholder="验证码" style="width: 150px" />
                    <div class="captcha-container" @click="getcaptcha">
                        <n-image v-if="captchaurl" :src="captchaurl" preview-disabled
                            :img-props="{ style: 'height: 40px; cursor: pointer' }" />
                    </div>
                </n-space>
            </n-form-item>

            <n-form-item>
                <n-button type="primary" block attr-type="button" :loading="registering" @click="handleRegister">
                    {{ registering ? '注册中...' : '注册' }}
                </n-button>
            </n-form-item>
            <div class="switch-mode">
                已有账号？<a href="#" @click.prevent="emit('switch-mode')">立即登录</a>
            </div>
        </n-form>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted, defineEmits } from 'vue'
import { checkChinese } from '@/utils/tools';
import md5 from 'md5';
import { useUserStore } from '@/stores/user';
import { getCaptcha, registerUser } from '@/api/api'; 

const userStore = useUserStore();

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
            trigger: ['input', 'blur'],
            validator: (rule, value) => {
                if (value.length < 6) return new Error('密码长度至少6位')
                return true
            }
        },
        confirmPass: {
            required: true,
            message: '请确认密码',
            trigger: ['input', 'blur'],
            validator: (rule, value) => {
                if (value !== formValue.user.pass) return new Error('两次输入密码不一致')
                return true
            }
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
        pass: '',
        confirmPass: ''
    },
    captcha: ''
})

const captchaistrue = ref(false)
const captchaurl = ref('')
const md5code = ref('')
const captchatoken = ref('')
const registering = ref(false)

const emit = defineEmits(['callBack', 'switch-mode']);

onMounted(() => {
    getcaptcha();
})

async function getcaptcha() {
    if (!captchaistrue.value) {
        const res = await getCaptcha(); 
        captchaurl.value = res.url;
        md5code.value = res.key;
        captchatoken.value = res.token;
    }
}

async function handleRegister(e) {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            if(await checkChinese(formValue.user.name)){
                ElMessage.error('用户名不能包含中文字符');
                return;
            }
            const hashedCaptcha = md5(md5(formValue.captcha));

            if (hashedCaptcha !== md5code.value) {
                ElMessage.error('验证码错误');
                return;
            }

            registering.value = true;
            const userData = {
                name: formValue.user.name,
                pass: formValue.user.pass,
                captcha: formValue.captcha.toLowerCase(),
                token: captchatoken.value,
            };

            try {
                const res = await registerUser(userData); 
                if (res.code == 1) {
                    ElMessage.success('注册成功');
                    userStore.updateUser({
                        islogin: true,
                        token: res.data.token,
                        user: formValue.user.name,
                        userId: res.data.id,
                        time: Date.now(),
                        avatar: res.data.avatar,
                        points: res.data.points
                    });
                    emit('callBack', 1);
                }
                else if (res.code == -1) {
                    ElMessage.error('请求过于频繁，请' + res.msg + '秒后重试');
                    setTimeout(() => {
                        registering.value = false
                    }, res.msg * 1000);
                }
                else {
                    ElMessage.error(res.msg);
                }
            } catch (error) {
                ElMessage.error('注册失败，请稍后重试');
            } finally {
                registering.value = false;
            }
        } else {
            ElMessage.error('请完善注册信息');
        }
    });
}
</script>

<style scoped>
.reg-container {
    width: 400px;
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