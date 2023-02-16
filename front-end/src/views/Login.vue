<template lang="pug">
.login
  Stack(distribution="center")
    .login-form
      Card.mt-5.p-2(sectioned)
        template(#title) Chào mừng bạn đến với Web học Vật Lý lớp 12
        Stack(vertical distribution="center" spacing="base" v-if="isLogin")
          TextField(v-model="userInput.email")
            template(#label) Email (Tên đăng nhập)
          TextField(v-model="userInput.password")
            template(#label) Mật khẩu
          Stack(distribution="center" alignment="center")
            Button(primary) Đăng nhập
            Button(plain @click="isLogin = false") Đăng ký tại đây
            Button(plain)
              TextStyle(variation="negative") Quên mật khẩu
        Stack(vertical distribution="center" spacing="base" v-else)
          TextField(v-model="userInput.email")
            template(#label) Email (Tên đăng nhập)
          TextField(v-model="userInput.username")
            template(#label) Tên học sinh
          TextField(v-model="userInput.address")
            template(#label) Địa chỉ
          TextField(v-model="userInput.phoneNumber")
            template(#label) SĐT
          TextField(v-model="userInput.averatePoint")
            template(#label) Điêm trung bình hiện tại
          TextField(v-model="userInput.password")
            template(#label) Mật khẩu
          TextField(v-model="userInput.password")
            template(#label) Xác nhận mật khẩu
          Stack(distribution="center")
            Button(primary) Đăng ký

</template>

<script setup lang="ts">
import { ref, inject } from 'vue';

const axios: any = inject('axios');

const userInput = ref({
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  address: '',
  phoneNumber: '',
  averatePoint: '',
});

const isLogin = ref<boolean>(true);

const handleLogin = () => {
  axios.get()
}

const handleRegister = () => {
  axios.post()
}
</script>
<style scoped lang="scss">
.login {
  height: 960px;
  background-color: #cccccc;
  background-image: url('https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bG9naW58ZW58MHx8MHx8&w=1000&q=80');
  .login-form {
    width: 500px;
    height: 500px;
}
}
</style>
