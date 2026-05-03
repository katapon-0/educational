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

  router.push({ name: "home" });
}
</script>

<template>
  <div class="form">
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
.form {
  width: 100%;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: #1a172c;
  box-sizing: border-box;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  background: #fefefe;
  color: #1a172c;
  font-size: 14px;
  transition: all 0.2s;
  outline: none;
}

input:focus {
  border-color: #fdb688;
  box-shadow: 0 0 0 3px rgba(253, 184, 136, 0.25);
}

input::placeholder {
  color: rgba(26, 23, 44, 0.4);
}

.error {
  color: #b24a4a;
  font-size: 12px;
  margin: 0;
  padding-left: 4px;
}

.error.general {
  text-align: center;
  margin-top: -8px;
}

.buttons {
  display: flex;
  justify-content: stretch;
}

button {
  width: 100%;
  max-width: 200px;

  border: none;
  background: #1a172c;
  color: #fefefe;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(26, 23, 44, 0.2);
}

button:hover {
  background: #2d2a44;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(26, 23, 44, 0.3);
}
</style>