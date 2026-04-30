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

<style scoped>
.auth {
  width: 100%;
  max-width: 360px;
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(26, 23, 44, 0.06);

  display: flex;
  flex-direction: column;
  gap: 14px;

  color: #1a172c;
  font-family: Arial, sans-serif;
}


.auth h2 {
  margin: 0;
  font-size: 20px;
  color: #1a172c;
}


.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}


.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  background: #fefefe;
  color: #1a172c;
  transition: all 0.2s;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #fdb688;
  box-shadow: 0 0 0 3px rgba(253, 184, 136, 0.25);
}


.error {
  color: #b24a4a;
  font-size: 12px;
  margin: 0;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}


button {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;

  background: #1a172c;
  color: #fefefe;

  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

button:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.error.general {
  margin-top: -4px;
}
</style>