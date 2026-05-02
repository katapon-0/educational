<script setup>
import { ref, computed } from "vue"
import { useUsers } from "../../composables/useUsers"

const {
  currentUser,
  login,
  logout,
  userMedia,
  addMediaToUser,
  deleteMediaFromUser,
  updateMediaInUser
} = useUsers()



const loginForm = ref({
  login: "",
  password: ""
})



const newItem = ref({
  title: "",
  type: "series",
  link: ""
})



const filterType = ref("all")

const filteredMedia = computed(() => {
  if (filterType.value === "all") return userMedia.value
  return userMedia.value.filter(m => m.type === filterType.value)
})


function handleLogin() {
  if (!loginForm.value.login || !loginForm.value.password) return
  login(loginForm.value.login, loginForm.value.password)
}

function handleLogout() {
  logout()
}



function handleAdd() {
  if (!newItem.value.title) return

  addMediaToUser({
    title: newItem.value.title,
    type: newItem.value.type,
    link: newItem.value.link
  })

  newItem.value.title = ""
  newItem.value.link = ""
}

function remove(id) {
  deleteMediaFromUser(id)
}

function increaseProgress(item) {
  if (item.type !== "series") return

  updateMediaInUser(item.id, {
    progress: (item.progress || 0) + 1
  })
}
</script>

<template>
  <div class="home">

    <h1>Media Test App</h1>


    <div v-if="!currentUser" class="auth">

      <h2>Авторизация</h2>

      <input v-model="loginForm.login" placeholder="Логин" />
      <input v-model="loginForm.password" type="password" placeholder="Пароль" />

      <button @click="handleLogin">
        Войти
      </button>

      <p style="margin-top: 10px; font-size: 12px;">
        тестовый юзер: admin / admin
      </p>

    </div>


    <div v-else>


      <div class="user-bar">
        <p>
          👤 {{ currentUser.name }} ({{ currentUser.login }})
        </p>

        <button @click="handleLogout">
          Выйти
        </button>
      </div>

      <hr />

      <div class="add-block">
        <h2>Добавить медиа</h2>

        <input v-model="newItem.title" placeholder="Название" />

        <select v-model="newItem.type">
          <option value="series">Сериал</option>
          <option value="film">Фильм</option>
        </select>

        <input v-model="newItem.link" placeholder="Ссылка" />

        <button @click="handleAdd">
          Добавить
        </button>
      </div>

      <hr />

      <div class="filter">
        <button @click="filterType = 'all'">Все</button>
        <button @click="filterType = 'series'">Сериалы</button>
        <button @click="filterType = 'film'">Фильмы</button>
      </div>

      <hr />


      <div class="list">

        <div v-for="item in filteredMedia" :key="item.id" class="card">

          <img :src="item.image" width="70" />

          <div>
            <h3>{{ item.title }}</h3>
            <p>Тип: {{ item.type }}</p>

            <p v-if="item.type === 'series'">
              Прогресс: {{ item.progress }} / {{ item.totalEpisodes }}
            </p>

            <p v-else>
              Длительность: {{ item.duration }} мин
            </p>

            <button @click="remove(item.id)">
              удалить
            </button>

            <button @click="increaseProgress(item)" :disabled="item.type !== 'series'">
              + прогресс
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

 
