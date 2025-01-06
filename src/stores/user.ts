import { defineStore } from 'pinia';

export const useUserStore = defineStore('userstate', {
  state: () => ({
    islogin: false,
    token: "",
    user: "",
    time: null,
    userId: null,
    avatar: "",
    points: 0,
    unReadMsg:0
  }),
  actions: {
    setPoints(num){
      this.points=num;
    },
    setUnReadMsg(num){
      this.unReadMsg=num;
    },
    resetUnReadMsg(){
      this.unReadMsg=0;
    },
    reduceUnReadMsg(){
      this.unReadMsg--;
    },
    updateUser(data) {
      this.islogin = data.islogin ?? this.islogin;
      this.token = data.token ?? this.token;
      this.user = data.user ?? this.user;
      this.time = data.time ?? this.time;
      this.userId = data.userId ?? this.userId;
      this.avatar = data.avatar ?? this.avatar;
      this.points = data.points ?? this.points;
      this.unReadMsg=data.unReadMsg ?? this.points;
    },
    logout() {
      this.updateUser({
        islogin: false,
        token: '',
        user: '',
        time: '',
        userId: '',
        avatar: '',
        points: 0,
        unReadMsg:0
      });
    }
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }],
  },
});
