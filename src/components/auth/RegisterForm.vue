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
    errors.value.login = "Логин минимум 3 символа"
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
    errors.value.password = "Пароль минимум 6 символов"
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

  router.push({ name: "home" });
}
</script>

<template>
  <div class="form">
    <h2>Регистрация</h2>

    <form class="form" @submit.prevent="submit">

      <div class="field">
        <input v-model="form.login" placeholder="Логин" />
        <p v-if="errors.login" class="error">{{ errors.login }}</p>
      </div>

      <div class="field">
        <input v-model="form.name" placeholder="Имя" />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div class="field">
        <input v-model="form.password" type="password" placeholder="Пароль" />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <p v-if="errors.general" class="error">
        {{ errors.general }}
      </p>

      <div class="buttons">
        <button type="submit">
          Зарегистрироваться
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
  align-items: stretch;
}

.form h2 {
  margin: 0;

  text-align: center;
  color: #1a172c;
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