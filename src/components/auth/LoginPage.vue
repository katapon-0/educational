<script setup>
import { ref } from "vue"
import LoginForm from "./LoginForm.vue"
import RegisterForm from "./RegisterForm.vue"

const mode = ref("login")
</script>

<template>
  <div class="auth-page">

    <div class="auth-container">

      <div class="tabs">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Вход</button>
        <button :class="{ active: mode === 'register' }" @click="mode = 'register'">Регистрация</button>
      </div>

      <div class="auth-box">
        <LoginForm v-if="mode === 'login'" />
        <RegisterForm v-else />
      </div>

    </div>

  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #fefefe;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;
}

.auth-container {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  padding: 16px;
}

.auth-box {
  width: 100%;
}

.tabs {
  display: flex;
  gap: 6px;

  padding: 6px;
  margin-bottom: 16px;

  border: 1px solid #e5e5e5;
  border-radius: 14px;

  background: #ffffff;
}

.tabs button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #1a172c;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
  font-size: 14px;
}

.tabs button:hover {
  background: #fdeabf;
}

.tabs button.active {
  background: #1a172c;
  color: #fefefe;
}
</style>