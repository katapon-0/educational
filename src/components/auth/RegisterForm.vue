<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useUsers } from "../../composables/useUsers"

const router = useRouter()
const { register, users } = useUsers()

const form = ref({
  login: "",
  name: "",
  password: ""
})

const errors = ref({})


function validate() {
  errors.value = {}

  const login = form.value.login.trim()
  const name = form.value.name.trim()
  const password = form.value.password.trim()

  if (!login) {
    errors.value.login = "Введите логин"
  } else if (login.length < 3) {
    errors.value.login = "Логин должен быть минимум 3 символа"
  } else {
    // проверка уникальности логина
    const exists = users.value.some(
      u => u.login.toLowerCase() === login.toLowerCase()
    )

    if (exists) {
      errors.value.login = "Такой логин уже существует"
    }
  }

  if (!name) {
    errors.value.name = "Введите имя"
  } else if (name.length < 2) {
    errors.value.name = "Имя слишком короткое"
  }

  if (!password) {
    errors.value.password = "Введите пароль"
  } else if (password.length < 6) {
    errors.value.password = "Пароль должен быть минимум 6 символов"
  }

  return Object.keys(errors.value).length === 0
}


function submit() {
  // проверка формы перед отправкой
  if (!validate()) return

  const success = register({
    login: form.value.login.trim(),
    name: form.value.name.trim(),
    password: form.value.password.trim()
  })

  if (!success) {
    errors.value.login = "Ошибка регистрации"
    return
  }

  router.push("/")
}
</script>

<template>
  <div class="form">

    <h2>Регистрация</h2>

    <div class="field">
      <input
        v-model="form.login"
        placeholder="Логин"
      />
      <p v-if="errors.login" class="error">
        {{ errors.login }}
      </p>
    </div>

    <div class="field">
      <input
        v-model="form.name"
        placeholder="Имя"
      />
      <p v-if="errors.name" class="error">
        {{ errors.name }}
      </p>
    </div>

    <div class="field">
      <input
        v-model="form.password"
        type="password"
        placeholder="Пароль"
      />
      <p v-if="errors.password" class="error">
        {{ errors.password }}
      </p>
    </div>

    <button @click="submit">
      Зарегистрироваться
    </button>

  </div>
</template>

<style scoped>

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}


.error {
  color: red;
  font-size: 12px;
}
</style>