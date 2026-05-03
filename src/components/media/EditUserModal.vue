<script setup>
import { ref } from "vue"
import { useUsers } from "../../composables/useUsers"

const emit = defineEmits(["close"])

const { currentUser, users } = useUsers()

const form = ref({
  name: currentUser.value?.name || "",
  login: currentUser.value?.login || "",
  password: currentUser.value?.password || ""
})

const errors = ref({})
const successMessage = ref("")

function validate() {
  errors.value = {}
  successMessage.value = ""

  const name = form.value.name?.trim()
  const login = form.value.login?.trim()
  const password = form.value.password?.trim()

  if (!name) {
    errors.value.name = "Введите имя"
  }

  if (!login) {
    errors.value.login = "Введите логин"
  } else if (login.length < 3) {
    errors.value.login = "Логин слишком короткий"
  }

  if (!password) {
    errors.value.password = "Введите пароль"
  } else if (password.length < 6) {
    errors.value.password = "Пароль слишком короткий"
  }

  // проверка на уникальность логина (если поменяли)
  const exists = users.value.find(
    u => u.login === login && u.id !== currentUser.value.id
  )

  if (exists) {
    errors.value.login = "Такой логин уже занят"
  }

  return Object.keys(errors.value).length === 0
}

function save() {
  if (!validate()) return

  const userIndex = users.value.findIndex(
    u => u.id === currentUser.value.id
  )

  if (userIndex === -1) return

  const updatedUser = {
    ...users.value[userIndex],
    name: form.value.name.trim(),
    login: form.value.login.trim(),
    password: form.value.password.trim()
  }

  users.value[userIndex] = updatedUser
  currentUser.value = updatedUser

  localStorage.setItem("users", JSON.stringify(users.value))
  localStorage.setItem("currentUser", JSON.stringify(currentUser.value))

  successMessage.value = "Данные обновлены"
 
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">

        <h3>Редактирование профиля</h3>

        <input v-model="form.name" placeholder="Имя" />
        <small v-if="errors.name" class="error">{{ errors.name }}</small>

        <input v-model="form.login" placeholder="Логин" />
        <small v-if="errors.login" class="error">{{ errors.login }}</small>

        <input v-model="form.password" type="password" placeholder="Пароль" />
        <small v-if="errors.password" class="error">{{ errors.password }}</small>

        <small v-if="successMessage" class="success">
          {{ successMessage }}
        </small>

        <div class="actions">
          <button @click="save">Сохранить</button>
          <button @click="$emit('close')">Отмена</button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 23, 44, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: #fefefe;
  padding: 24px;
  border-radius: 18px;
  width: 380px;
  max-width: 92%;
  border: 1px solid #e5e5e5;
  box-shadow: 0 10px 30px rgba(26, 23, 44, 0.12);
  color: #1a172c;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal h3 {
  color: #1a172c;
  margin: 0 0 12px 0;
  font-size: 20px;
}

input {
  width: 100%;
  padding: 10px 12px;
  box-sizing: border-box;
  background: #fefefe;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  color: #1a172c;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #fdb688;
  box-shadow: 0 0 0 3px rgba(253, 184, 136, 0.25);
}

input::placeholder {
  color: rgba(26, 23, 44, 0.5);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}

.actions button:first-child {
  background: #fdb688;
  color: #1a172c;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.actions button:first-child:hover {
  background: #fdeabf;
}

.actions button:last-child {
  background: transparent;
  color: #1a172c;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.actions button:last-child:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

.error {
  color: #b24a4a;
  font-size: 12px;
  margin-top: 2px;
}

.success {
  color: #1c9c3c;
  font-size: 13px;
  margin-top: 6px;
}
</style>