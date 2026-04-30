<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useUsers } from "../../composables/useUsers"
import { useMedia } from "../../composables/useMedia"
import { ref } from "vue"
import MediaList from "../Media/MediaList.vue"
import AddItemModal from "../Media/AddItemModal.vue"

const router = useRouter()
const { currentUser, logout, userMedia, deleteMediaFromUser } = useUsers()
const { getStats, getSuggestion } = useMedia()

const userName = computed(function() {
  return currentUser.value?.name || currentUser.value?.login
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

// функция удаления
function handleDelete(id) {
  deleteMediaFromUser(id)
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
        <h1>🎬 WatchList</h1>
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
        <button @click="refreshSuggestion" class="btn-suggestion">🎯 Что посмотреть ?</button>
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

      <!-- ПЕРЕДАЁМ СПИСОК И ОБРАБОТЧИК УДАЛЕНИЯ -->
      <MediaList :items="userMedia" @delete="handleDelete" v-else />

      <AddItemModal v-if="addModalVisible" @close="closeAddModal" />
    </div>
  </div>
</template>

<style scoped>
  .home {
  padding: 20px;
  color: #1a172c;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background: #fefefe;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 16px 18px;
  background: #1a172c;
  border-radius: 18px;
  border: 1px solid #1a172c;
}

.header h1 {
  margin: 0;
  color: #fefefe;
}

.user-info {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.username {
  color: #fefefe;
  opacity: 0.9;
}

.btn-logout {
  background: transparent;
  color: #fefefe;
  border: 1px solid rgba(254, 254, 254, 0.28);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: rgba(253, 234, 191, 0.16);
  border-color: #fdeabf;
}

.btn-add {
  background: #fdb688;
  color: #1a172c;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #fdeabf;
  transform: translateY(-1px);
}

.stats {
  display: flex;
  gap: 16px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.stat-card {
  background: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e5e5e5;
  color: #1a172c;
}

.suggestion {
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #e5e5e5;
}

.btn-suggestion {
  background: #fdb688;
  color: #1a172c;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s;
}

.btn-suggestion:hover {
  opacity: 0.92;
}

.suggestion-card {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px;
  background: #fdeabf;
  border-radius: 10px;
}

.btn-link {
  color: #1a172c;
  border: 1px solid #ddd;
  padding: 6px 12px;
  cursor: pointer;
  background: transparent;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-link:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

.divider {
  border: none;
  border-top: 1px solid #e5e5e5;
  margin: 20px 0;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #1a172c;
  opacity: 0.5;
}

.btn-primary {
  background: #1a172c;
  color: #fefefe;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.92;
}
</style>