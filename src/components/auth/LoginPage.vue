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