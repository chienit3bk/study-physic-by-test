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
          TextField(v-model="userInput.username")
            template(#label) Tên học sinh
          TextField(v-model="userInput.address")
            template(#label) Địa chỉ
          TextField(v-model="userInput.phoneNumber")
            template(#label) SĐT
          //- TextField(v-model="userInput.averatePoint")
          //-   template(#label) Điêm trung bình hiện tại
          TextField(v-model="userInput.password" type="password")
            template(#label) Mật khẩu
          TextField(v-model="userInput.confirmPassword" type="password")
            template(#label) Xác nhận mật khẩu
          Stack(v-if="userInput.password !== userInput.confirmPassword" distribution="center")
            TextStyle(variation="negative") Xác nhận mật khẩu chưa chính xác
          Stack(distribution="center" inlineAligment="center")
            Button(primary @click="handleRegister") Đăng ký
            Button(secondary @click="isLogin = true") Đăng nhập tại đây

</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import ViewMajor from '@icons/ViewMajor.svg?component'

const axios: any = inject('axios');

const userInput = ref({
  email: '',
  password: '',
  fakePassword: '',
  confirmPassword: '',
  username: '',
  address: '',
  phoneNumber: '',
  averatePoint: '',
});

const isLogin = ref<boolean>(true);
const isLoginError = ref<boolean>(false);
const isHiddenPassword = ref<boolean>(true);

const inputType = computed(() => isHiddenPassword.value ? "password" : "text")
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
  background-image: url('https://static.colearn.vn:8413/v1.0/upload/library/19042022/cach-hoc-ly-12-hieu-qua-eUl6fT.jpg');
  .login-form {
    width: 500px;
    height: 500px;
}
}
</style>
