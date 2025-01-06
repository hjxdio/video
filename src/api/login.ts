import { useUserStore } from '@/stores/user';
import request from '@/utils/request';

interface UserData {
  id: number;
  token: string;
}

export async function checklogin(): Promise<number> {
  const store = useUserStore();
  
  if (Date.now() - store.time > 3600000) {
    console.log(Date.now(), store.time);
    
    const userData: UserData = {
      id: store.userId,
      token: store.token,
    };

    const res = await request.post("/userInfo/index", null, {
      headers: {
        'id': userData.id,
        'token': userData.token,
      }
    });

    return res.code === 0 ? 1 : 0;
  }
  return 0;
}