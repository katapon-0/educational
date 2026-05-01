<script setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useUsers } from "../../composables/useUsers"
import { useMedia } from "../../composables/useMedia"
import MediaList from "../Media/MediaList.vue"

const router = useRouter()
const { currentUser, userMedia, deleteMediaFromUser } = useUsers()
const { getStats, getSuggestion } = useMedia()

const stats = computed(() => getStats(userMedia.value))
const suggestion = ref(null)
const hasSuggestionRequested = ref(false)

function refreshSuggestion() {
  suggestion.value = getSuggestion(userMedia.value)
  hasSuggestionRequested.value = true
}

function handleDelete(id) {
  deleteMediaFromUser(id)
}
</script>

<template>
  <div class="home">
    <div v-if="!currentUser">
      <h2>Вы не авторизованы</h2>
      <p>Пожалуйста, войдите в систему</p>
      <button @click="router.push({ name: 'login' })" class="btn-primary">Перейти к входу</button>
    </div>
    <div v-else>
      <!-- FEATURE: header removed, now in MenuTop.vue -->
      <!-- Статистика -->
      <div class="stats">
        <div class="stat-card">⏳ Хочу: {{ stats.want }}</div>
        <div class="stat-card">▶️ Смотрю: {{ stats.watching }}</div>
        <div class="stat-card">✅ Посмотрено: {{ stats.done }}</div>
        <div class="stat-card">❌ Заброшено: {{ stats.abandoned }}</div>
        <div class="stat-card">📊 Всего: {{ stats.total }}</div>
      </div>

      <!-- Рекомендация -->
      <div class="suggestion">
        <button @click="refreshSuggestion" class="btn-suggestion">🎯 Что посмотреть ?</button>
        <div v-if="suggestion" class="suggestion-card">
          <strong>{{ suggestion.title }}</strong> ({{ suggestion.type === 'series' ? 'Сериал' : 'Фильм' }})
          <span v-if="suggestion.watchDate"> --- 📅 {{ new Date(suggestion.watchDate).toLocaleDateString() }}</span>
          <button @click="router.push('/media/' + suggestion.id)" class="btn-link">Перейти</button>
        </div>
        <p v-if="hasSuggestionRequested && !suggestion" class="empty-suggestion">Нет доступных вариантов</p>
      </div>

      <hr class="divider" />
      <div v-if="!userMedia.length" class="empty-state">
        <p>У вас пока нет медиа 🎬</p>
        <p>Нажмите «+ Добавить» в шапке, чтобы начать</p>
      </div>
      <MediaList v-else :items="userMedia" @delete="handleDelete" />
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

.empty-suggestion {
  margin-top: 10px;
  color: #b24a4a;
}
</style>