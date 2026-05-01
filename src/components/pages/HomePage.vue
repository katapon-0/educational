<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUsers } from "../../composables/useUsers";
import { useMedia } from "../../composables/useMedia";
import MediaList from "../Media/MediaList.vue";

import iconWant from "../../assets/icons/want.png";
import iconWatching from "../../assets/icons/watching.png";
import iconDone from "../../assets/icons/done.png";
import iconAbandoned from "../../assets/icons/abandoned.png";
import iconTotal from "../../assets/icons/total.png";

const router = useRouter();
const { currentUser, userMedia, deleteMediaFromUser } = useUsers();
const { getStats, getSuggestion } = useMedia();

const stats = computed(() => getStats(userMedia.value));
const suggestion = ref(null);
const hasSuggestionRequested = ref(false);

function refreshSuggestion() {
  suggestion.value = getSuggestion(userMedia.value);
  hasSuggestionRequested.value = true;
}

function handleDelete(id) {
  deleteMediaFromUser(id);
}
</script>

<template>
  <div class="home">
    <div v-if="!currentUser">
      <h2>Вы не авторизованы</h2>
      <p>Пожалуйста, войдите в систему</p>
      <button @click="router.push({ name: 'login' })" class="btn-primary">
        Перейти к входу
      </button>
    </div>



    <div v-else>
      <!-- Статистика -->
      <div class="stats">
        <div class="stat-card">
          <img :src="iconWant" class="icon-emoji" alt="want" /> Хочу:
          {{ stats.want }}
        </div>

        <div class="stat-card">
          <img :src="iconWatching" class="icon-emoji" alt="watching" /> Смотрю:
          {{ stats.watching }}
        </div>

        <div class="stat-card">
          <img :src="iconDone" class="icon-emoji" alt="watching" /> Посмотрено: 
          {{ stats.done }}
        </div>

        <div class="stat-card">
          <img :src="iconAbandoned" class="icon-emoji" alt="watching" /> Заброшено: 
          {{ stats.abandoned }}
        </div>

        <div class="stat-card">
          <img :src="iconTotal" class="icon-emoji" alt="watching" /> Всего: 
          {{ stats.total }}
        </div>

      </div>

      <!-- Рекомендация -->
      <div class="suggestion">
        <img
          src="../../assets/icons/suggetion.png"
          class="suggestion-icon"
          alt="icon"
        />
        <button @click="refreshSuggestion" class="btn-suggestion">
          Что посмотреть ?
        </button>

        <!-- Карточка рекомендации (справа от кнопки) -->
        <div v-if="suggestion" class="suggestion-card">
          <img :src="suggestion.image" class="suggestion-poster" />
          <div class="suggestion-info">
            <strong>{{ suggestion.title }}</strong>
            <span
              >({{ suggestion.type === "series" ? "Сериал" : "Фильм" }})</span
            >
            <span v-if="suggestion.watchDate">
              📅 {{ new Date(suggestion.watchDate).toLocaleDateString() }}
            </span>
            <button
              @click="router.push('/media/' + suggestion.id)"
              class="btn-link"
            >
              Перейти
            </button>
          </div>
        </div>

        <!-- Сообщение об отсутствии вариантов -->
        <p
          v-else-if="hasSuggestionRequested && !suggestion"
          class="empty-suggestion"
        >
          Нет доступных вариантов
        </p>
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
  background: linear-gradient(135deg, #fdeabf 0%, #fdb688 100%);
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 6px 20px rgba(26, 23, 44, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-left: 40px;
}

.suggestion-icon {
  width: 150px;
  height: 150px;
  border-radius: 16px;
  object-fit: cover;
}

.btn-suggestion {
  background: #1a172c;
  color: #fefefe;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-suggestion:hover {
  opacity: 0.92;
  transform: translateY(-2px);
}

.suggestion-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  padding: 16px;
  margin-top: 0px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-width: 0;
  margin-right: 100px;
  margin-left: 40px;
}

.suggestion-poster {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 10px;
  background: #fdeabf;
}

.suggestion-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #1a172c;
}

.btn-link {
  background: #1a172c;
  color: #fefefe;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  align-self: flex-start;
}

.btn-link:hover {
  opacity: 0.9;
  transform: scale(1.02);
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
