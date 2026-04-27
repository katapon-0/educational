<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useUsers } from "../../composables/useUsers"
import MediaList from "../Media/MediaList.vue"
import { useMedia } from "../../composables/useMedia"
import { ref } from "vue"
import AddItemModal from "../Media/AddItemModal.vue"

const router = useRouter()
const { currentUser, logout } = useUsers()
const { getStats, getSuggestion } = useMedia()

const userName = computed(function() {
  return currentUser.value?.name || currentUser.value?.login
})

const userMedia = computed(function() {
  return currentUser.value?.media ?? []
})

const stats = computed(function() {
  return getStats(userMedia.value)
})

const suggestion = ref(null)
const addModalVisible = ref(false)

function refreshSuggestion() {
  suggestion.value = getSuggestion(userMedia.value)
}

function goLogin() {
  router.push({ name: "login" })
}

function handleLogout() {
  logout()
}

function openAddModal() {
  addModalVisible.value = true
}

function closeAddModal() {
  addModalVisible.value = false
}
</script>

<template>
  <div class="home">
    <div v-if="!currentUser">
      <h2>Вы не авторизованы</h2>
      <p>Пожалуйста, войдите в систему</p>
      <button @click="goLogin" class="btn-primary">Перейти к входу</button>
    </div>

    <div v-else>
      <header class="header">
        <h1>My Media List</h1>
        <div class="user-info">
          <span class="username">👤 {{ userName }}</span>
          <button @click="handleLogout" class="btn-logout">Выйти</button>
          <button @click="openAddModal" class="btn-add">+ Добавить</button>
        </div>
      </header>

      <div class="stats">
        <div class="stat-card">⏳ Хочу: {{ stats.want }}</div>
        <div class="stat-card">▶️ Смотрю: {{ stats.watching }}</div>
        <div class="stat-card">✅ Посмотрено: {{ stats.done }}</div>
        <div class="stat-card">❌ Заброшено: {{ stats.abandoned }}</div>
      </div>

      <div class="suggestion">
        <button @click="refreshSuggestion" class="btn-suggestion">Что посмотреть ?</button>
        <div v-if="suggestion" class="suggestion-card">
          <strong>{{ suggestion.title }}</strong> ({{ suggestion.type === "series" ? "Сериал" : "Фильм" }})
          <span v-if="suggestion.watchDate"> — 📅 {{ new Date(suggestion.watchDate).toLocaleDateString() }}</span>
          <button @click="router.push('/media/' + suggestion.id)" class="btn-link">Перейти</button>
        </div>
      </div>

      <hr class="divider" />

      <div v-if="!userMedia.length" class="empty-state">
        <p>У вас пока нет медиа 🎬</p>
        <p>Нажмите «+ Добавить», чтобы начать</p>
      </div>

      <MediaList v-else />

      <AddItemModal v-if="addModalVisible" @close="closeAddModal" />
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  color: #ffffff;
  font-family: Arial, sans-serif;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #2a2a2a;
}

.header h1 {
  margin: 0;
  color: #ffffff;
}

.user-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.username {
  color: #68a61c;
}

.btn-logout {
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #3a3a3a;
  color: #fff;
}

.btn-add {
  background: #68a61c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #4c7a14;
  transform: translateY(-1px);
}

.stats {
  display: flex;
  gap: 16px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.stat-card {
  background: #1a1a1a;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #333;
  color: #ccc;
}

.suggestion {
  background: #0d0d0d;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.btn-suggestion {
  background: #68a61c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.btn-suggestion:hover {
  background: #4c7a14;
}

.suggestion-card {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  padding: 15px;
  background: #1a1a1a;
  border-radius: 8px;
}

.btn-link {
  color: #ccc;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  background: #0d0d0d;
}

.btn-link:hover {
  color: #fff;
  background: #68a61c;
}

.divider {
  border-color: #2a2a2a;
  margin: 15px 0;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #888;
}

.btn-primary {
  background: #68a61c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #4c7a14;
}
</style>