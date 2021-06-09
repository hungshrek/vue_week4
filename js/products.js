import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'hungmarty-api';


let productModal = null;
let delProductModal = null;
 
const app= createApp({
  data() {
    return {
      products: [],
      tempProduct: {   // 暫存資料
        imagesUrl: [],
      },
      pagination: {}, //頁數
      isNew: false,  // 新增還是update
   //   apiUrl: 'https://vue3-course-api.hexschool.io/api',  //api 網址
   //   apiPath: 'hungmarty-api',
    }
  },
  //生命週期
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    if (token === '') {
      alert('您尚未登入請重新登入。');
      window.location = 'index.html';
    }
    //將 token 放進 header(每次發出請求設定預設值)
    axios.defaults.headers.common.Authorization = token;
    //取資料 (資料列表)
    this.getData();
  },
  //方法
  methods: {
     //取得資料
    getData(page = 1) {
      const url = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            const { products, pagination } = res.data;
            this.products = products;
            this.pagination = pagination;
          } else {
            alert(res.data.message);
            window.location = 'index.html';
          }
        })
        .catch( (error)=>{
          alert('資料錯誤');
        })
    },
      //Bootstrap Modal.show()方法
    openModal(isNew, item) {
      if(isNew === 'new') {   // 新增
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if(isNew === 'edit') {       //修改
        this.tempProduct = { ...item };  // 淺copy
        this.isNew = false;
        productModal.show();
      } else if(isNew === 'delete') {   //刪除
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
  },
})
  // 分頁元件
app.component('pagination', {
    template: '#pagination', //x-template
    props: {
      pages:{    //內 :pages="pagination 父傳子"
        type: Object,
        default() {
          return { 
          }
        }
      }
    },
    methods: {
      emitPages(item) {
        this.$emit('emit-pages', item); //emit-pages="getData" 子呼叫父事件(方法)
      },
    },
  })
  // 產品新增/編輯元件
app.component('productModal', {
    template: '#productModal',  //x-template
    props: {
      product: {   //內 :product="tempProuuct 父傳子"
        type: Object,
        default() {
          return { 
            imagesUrl: [],
          }
        }
      },
      isNew: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        modal: null,
      };
    },
    mounted() {
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false,
        backdrop: 'static'
      });
    },
    methods: {
      updateProduct() {
        // 新增商品
        let api = `${apiUrl}/api/${apiPath}/admin/product`;
        let httpMethod = 'post';
        // 判斷新增或修改商品時 用不同方法 call API
        if (!this.isNew) {
          api = `${apiUrl}/api/${apiPath}/admin/product/${this.product.id}`;
          httpMethod = 'put';
        }

        axios[httpMethod](api, { data: this.product }).then((res) => {
          if(res.data.success){
            alert(res.data.message);
            this.hideModal();
            this.$emit('update');
          } else {
            alert(res.data.message);
          }
        }).catch((error) => {
          console.log(error)
        });
      },
      createImages() {
        this.product.imagesUrl = [];
        this.product.imagesUrl.push('');
      },
      openModal() {
        productModal.show();
      },
      hideModal() {
        productModal.hide();
      },
    },
  })
  // 產品刪除元件
app.component('delProductModal', {
    template: '#delProductModal',  //x-template
    props: {
      item: {      //內 :item="tempProuuct 父傳子"
        type: Object,
        default() {
          return { 
          }
        }
      }
    },
    data() {
      return {
        modal: null,
      };
    },
    mounted() {
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false,
        backdrop: 'static',
      });
    },
    methods: {
      delProduct() {
        axios.delete(`${apiUrl}/api/${apiPath}/admin/product/${this.item.id}`).then((res) => {
          if(res.data.success){
            alert(res.data.message);
            this.hideModal();
            this.$emit('update');
          } else {
            alert(res.data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      openModal() {
        delProductModal.show();
      },
      hideModal() {
        delProductModal.hide();
      },
    },
  })

app.mount('#app')