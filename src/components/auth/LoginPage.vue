<script setup>
import { ref } from "vue"
import LoginForm from "./LoginForm.vue"
import RegisterForm from "./RegisterForm.vue"

const mode = ref("login")
</script>

<template>
    <div class="auth-page">

        <div class="tabs">
            <button :class="{ active: mode === 'login' }" @click="mode = 'login'">
                Вход
            </button>

            <button :class="{ active: mode === 'register' }" @click="mode = 'register'">
                Регистрация
            </button>
        </div>

        <LoginForm v-if="mode === 'login'" />
        <RegisterForm v-else />

    </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #fefefe;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #1a172c;
}


.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  padding: 6px;
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

.auth-page :deep(input),
.auth-page :deep(button) {
  font-family: inherit;
}
</style>