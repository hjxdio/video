<template>
    <div class="launch-container">
        <n-card title="积分中心" class="launch-card">
            <n-tabs type="line" animated>
                <!-- 我的积分面板 -->
                <n-tab-pane name="mypoint" tab="我的积分">
                    <div class="points-info">
                        <n-statistic label="当前积分">
                            <n-number-animation 
                                :from="0" 
                                :to="currentPoints" 
                                :duration="1000"
                            />
                        </n-statistic>
                        
                        <n-divider />
                        
                        <n-table :bordered="false" :single-line="false">
                            <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>类型</th>
                                    <th>积分变动</th>
                                    <th>备注</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="record in pointsHistory" :key="record.id">
                                    <td>{{ record.time }}</td>
                                    <td>{{ record.type }}</td>
                                    <td :class="record.change >= 0 ? 'positive' : 'negative'">
                                        {{ record.change >= 0 ? '+' : '' }}{{ record.change }}
                                    </td>
                                    <td>{{ record.remark }}</td>
                                </tr>
                            </tbody>
                        </n-table>
                    </div>
                </n-tab-pane>

                <!-- 兑换面板 -->
                <n-tab-pane name="add" tab="兑换">
                    <div class="exchange-form">
                        <n-form
                            ref="formRef"
                            :model="exchangeForm"
                            :rules="rules"
                        >
                            <n-form-item label="兑换卡密" path="cardKey">
                                <n-input 
                                    v-model:value="exchangeForm.cardKey" 
                                    placeholder="请输入兑换卡密"
                                />
                            </n-form-item>
                            
                            <n-form-item>
                                <n-button 
                                    type="primary" 
                                    @click="handleExchange"
                                    :loading="exchangeLoading"
                                >
                                    立即兑换
                                </n-button>
                            </n-form-item>
                        </n-form>
                    </div>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();
const currentPoints = ref(0)
const exchangeLoading = ref(false)
const pointsHistory = ref([])

const exchangeForm = ref({
    cardKey: ''
})

const rules = {
    cardKey: {
        required: true,
        message: '请输入兑换卡密',
        trigger: 'blur'
    }
}

// 获取积分信息
const fetchPointsInfo = async () => {
    try {
        // TODO: 调用获取积分的API
        // const res = await api.getPoints()
        // currentPoints.value = res.points
        // pointsHistory.value = res.history
        
        // 模拟数据
        currentPoints.value = userStore.points
        pointsHistory.value = [
            {
                id: 1,
                time: '2023-05-20 12:00:00',
                type: '兑换',
                change: 100,
                remark: '卡密兑换'
            }
        ]
    } catch (error) {
        ElMessage.error('获取积分信息失败')
    }
}

// 处理兑换
const handleExchange = async () => {
    router.push({ name: 'my/addCredit', params: { type: '2', token: exchangeForm.value.cardKey } });
}

onMounted(() => {
    fetchPointsInfo()
})
</script>

<style scoped>
.points-info {
    padding: 20px 0;
}

.exchange-form {
    max-width: 500px;
    margin: 20px auto;
}

.positive {
    color: #18a058;
}

.negative {
    color: #d03050;
}
</style>