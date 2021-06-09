import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';


const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      user: {
        username: '',
        password: '',
      },
      page: 'products',
     // isLoading: false,
    };
  },
  methods: {
    login() {
      const api = `${this.apiUrl}/admin/signin`;
      if(!this.page) {
        return alert('請選擇你要登入的頁面。');
      }
     
     // this.isLoading = true //正在執行 ajax 時 isLoading = true 觸發效果

      axios.post(api, this.user).then((response) => {
        if(response.data.success) {

        // this.isLoading = false //ajax結束時，isLoading = false 結束效果 

          const { token, expired } = response.data;
          // 寫入 cookie token
          // expires 設置有效時間
          document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;

          window.location = `${this.page}.html`;
        } else {
          alert(response.data.message);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
  //  addLoading() {
  //    let loader = this.$loading.show();
      // setTimeout(() => {
      //   loader.hide()
      // }, 3000);
  //  }



  },
})

// app.use(VueLoading);
// app.component('loading', VueLoading)

app.mount('#app');
