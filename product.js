import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = {};
let deleteModal={};

createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io',
            apiPath: 'jamestsai',
            products: [],
            tempProduct: {},
            isNew:false,
        }
    },
    methods: {
        getData(page = 1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
            axios.get(url).then(res => {
                if (res.data.success) {
                    this.products = res.data.products;
                }
                else {
                    alert('讀取失敗');
                    window.location = 'login.html';
                }
            }).catch(error=>{
                consolo.log(error)
            });
        },
        openModal(isNew, item) {
            this.isNew = isNew;
            if(this.isNew){
                this.tempProduct = {};
                productModal.show();
            }else{
                this.tempProduct  = {...item};
                productModal.show();
            }
        },
        delModal(item){
            this.tempProduct = item;
            deleteModal.show();
        },
        createImages() {
            this.tempProduct.imagesUrl = ['']
        },
        updateProduct(){
            let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';
            if(!this.isNew){
                 api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](api,{data:this.tempProduct}).then(res=>{
                 if(res.data.success){
                    productModal.hide();
                    this.getData();
                 }
                 else{
                    alert(res.data.message)
                 }
            }).catch(error=>{
                consolo.log(error)
            })
            this.getData();
        },
        deleteProduct(){
            const api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(api).then(res=>{
                if(res.data.success){
                    this.getData();
                    deleteModal.hide();
                }
            }).catch(error=>{
                consolo.log(error)
            })
        }
    },
    //mounted是連dom元素都取得了
    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (token === '') {
            alert('請重新登入');
            window.location = 'login.html';
        }
        axios.defaults.headers.common.Authorization = token;
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        deleteModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        this.getData();
    }
}).mount('#app');