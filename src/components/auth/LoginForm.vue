<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useUsers } from "../../composables/useUsers"

const router = useRouter()
const { login } = useUsers()
 
const form = ref({
    login: "",
    password: ""
})
 

const errors = ref({})
 
function validate() {
    errors.value = {}

    const loginVal = form.value.login.trim()
    const passwordVal = form.value.password.trim()

    if (!loginVal) {
        errors.value.login = "Введите логин"
    }

    if (!passwordVal) {
        errors.value.password = "Введите пароль"
    }

    return Object.keys(errors.value).length === 0
}
 
function submit() {
    if (!validate()) return

    const success = login(form.value.login.trim(), form.value.password.trim())

    if (!success) {
        errors.value.general = "Неверный логин или пароль"
        return
    }

    router.push("/")
}
</script>

<template>
    <div class="auth">

        <h2>Вход</h2>

        <form @submit.prevent="submit" class="form">

            <div class="field">
                <input v-model="form.login" placeholder="Логин" />
                <p v-if="errors.login" class="error">
                    {{ errors.login }}
                </p>
            </div>

            <div class="field">
                <input v-model="form.password" type="password" placeholder="Пароль" />
                <p v-if="errors.password" class="error">
                    {{ errors.password }}
                </p>
            </div>

            <p v-if="errors.general" class="error">
                {{ errors.general }}
            </p>

            <div class="buttons">
                <button type="submit">
                    Войти
                </button>
            </div>

        </form>

    </div>
</template>