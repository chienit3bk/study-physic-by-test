<template lang="pug">
.login
  Stack(distribution="center")
    .login-form
      Card.mt-5.p-2(sectioned)
        template(#title) Chào mừng bạn đến với Web học Vật Lý lớp 12
        Stack(vertical distribution="center" spacing="base" v-if="isLogin")
          TextField(v-model="userInput.email" type="email")
            template(#label) Email (Tên đăng nhập)
          TextField(v-model="userInput.password", :type="inputType")
            template(#label) Mật khẩu
            template(#suffix)
              Stack.pt-1(alignment="center")
                Button(plain :icon="ViewMajor" @click="isHiddenPassword = !isHiddenPassword")
          Stack(v-if="isLoginError" distribution="center")
            TextStyle(variation="negative") Tên đăng nhập hoặc mật khảu chưa chính xác
          Stack(distribution="center" alignment="center")
            Button(primary @click="handleLogin") Đăng nhập
            Button(secondary @click="isLogin = false") Đăng ký tại đây
        Stack(vertical distribution="center" spacing="base" v-else)
          TextField(v-model="userInput.email")
            template(#label) Email (Tên đăng nhập)
          TextField(v-model="userInput.name")
            template(#label) Tên học sinh
          TextField(v-model="userInput.address")
            template(#label) Địa chỉ
          TextField(v-model="userInput.phone")
            template(#label) SĐT
          //- TextField(v-model="userInput.averatePoint")
          //-   template(#label) Điêm trung bình hiện tại
          TextField(v-model="userInput.password" type="password")
            template(#label) Mật khẩu
          TextField(v-model="userInput.confirmPassword" type="password")
            template(#label) Xác nhận mật khẩu
          Stack(v-if="userInput.password !== userInput.confirmPassword" distribution="center")
            TextStyle(variation="negative") Xác nhận mật khẩu chưa chính xác
          Stack(v-if="isLoginError" distribution="center")
            TextStyle(variation="negative") Email đã được sử dụng
          Stack(distribution="center" inlineAligment="center")
            Button(primary @click="handleRegister") Đăng ký
            Button(secondary @click="isLogin = true") Đăng nhập tại đây

</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import { authStore } from '@/stores';
import ViewMajor from '@icons/ViewMajor.svg?component';
import router from '@/router';
const axios: any = inject('axios');

const { setAuthStore } = authStore();
const userInput = ref({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  address: '',
  phone: '',
  averatePoint: '',
  role: 'user'
});


const isLogin = ref<boolean>(true);
const isLoginError = ref<boolean>(false);
const isHiddenPassword = ref<boolean>(true);

const inputType = computed(() => isHiddenPassword.value ? "password" : "text")
const handleLogin = () => {
  axios.post('auth/login', {
    email: userInput.value.email,
    password: userInput.value.password,
  })
    .then((res: any) => {
      axios.defaults.headers.common.Authorization = `Bearer ${res.token}`;
      localStorage.setItem('session_token', res.token);
      setAuthStore(res.token);
      router.push({ name: 'dashboard'});
    })
    .catch(() => {
      isLoginError.value = true;
      setTimeout(() => isLoginError.value = false, 5000);
    });
}

const handleRegister = () => {
  const { email, password, name, address, phone, role } = userInput.value;
  axios.post('auth/sign-up', {
    email, password, name, address, phone, role
  })
    .then((res: any) => {
      alert(res.message)
    })
    .catch(() => {
      isLogin.value = false;
      isLoginError.value = true;
    });
}

</script>
<style scoped lang="scss">
.login {
  height: 960px;
  background-color: #cccccc;
  background-image: url('https://static.colearn.vn:8413/v1.0/upload/library/19042022/cach-hoc-ly-12-hieu-qua-eUl6fT.jpg');
  .login-form {
    width: 500px;
    height: 500px;
}
}
</style>
