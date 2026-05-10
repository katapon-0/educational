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
    <div v-if="!currentUser" class="guest">
      <div class="guest-card">
        <img src="../../assets/icons/name.png" class="guest-illustration" />

        <h1 class="guest-title">Ваш личный список просмотра</h1>

        <p class="guest-subtitle">
          Сохраняйте фильмы и сериалы, отслеживайте прогресс и не забывайте, что
          хотели посмотреть
        </p>

        <div class="guest-actions">
          <button @click="router.push({ name: 'login' })" class="guest-btn">
            Авторизоваться
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- Рекомендация -->
      <div class="suggestion">
        <img src="../../assets/icons/suggetion.png" class="suggestion-icon" alt="icon" />
        <button @click="refreshSuggestion" class="btn-suggestion">
          Что посмотреть ?
        </button>

        <!-- Карточка рекомендации (справа от кнопки) -->
        <div v-if="suggestion" class="suggestion-card">
          <img :src="suggestion.image" class="suggestion-poster" />
          <div class="suggestion-info">
            <strong>{{ suggestion.title }}</strong>
            <span>({{ suggestion.type === "series" ? "Сериал" : "Фильм" }})</span>
            <span v-if="suggestion.watchDate">
              {{ new Date(suggestion.watchDate).toLocaleDateString() }}
            </span>
            <button @click="router.push('/media/' + suggestion.id)" class="btn-link">
              Перейти
            </button>
          </div>
        </div>

        <!-- Сообщение об отсутствии вариантов -->
        <p v-else-if="hasSuggestionRequested && !suggestion" class="empty-suggestion">
          Нет доступных вариантов
        </p>
      </div>

      <div v-if="!userMedia.length" class="empty-state">
        <p>У вас пока нет медиа 🎬</p>
        <p>Нажмите «+ Добавить» в шапке, чтобы начать</p>
      </div>
      <MediaList v-else :items="userMedia" @delete="handleDelete">
        <!-- статистика перенесена под фильтры -->
        <template #stats>
          <div class="stats">
            <div class="stat-card">
              <img :src="iconWant" class="icon-emoji" alt="want" /> Хочу:
              {{ stats.want }}
            </div>
            <div class="stat-card">
              <img :src="iconWatching" class="icon-emoji" alt="watching" />
              Смотрю:
              {{ stats.watching }}
            </div>
            <div class="stat-card">
              <img :src="iconDone" class="icon-emoji" alt="done" /> Посмотрено:
              {{ stats.done }}
            </div>
            <div class="stat-card">
              <img :src="iconAbandoned" class="icon-emoji" alt="abandoned" />
              Заброшено:
              {{ stats.abandoned }}
            </div>
            <div class="stat-card">
              <img :src="iconTotal" class="icon-emoji" alt="total" /> Всего:
              {{ stats.total }}
            </div>
          </div>
        </template>
      </MediaList>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  color: #1a172c;
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
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  color: #1a172c;
}

.suggestion {
  background: linear-gradient(135deg, #fdeabf 0%, #fdb688 100%);
  border-radius: 20px;
  padding: 16px;
  margin: 25px 0 40px;
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
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-suggestion:hover {
  opacity: 0.92;
  transform: translateY(-2px);
}

.suggestion-card {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 16px;
  align-items: stretch;

  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 18px;
  padding: 16px;

  box-shadow:
    0 8px 24px rgba(26, 23, 44, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);

  flex: 1;
  min-width: 280px;
  margin-left: 40px;
  margin-right: 80px;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.suggestion-card:hover {
  box-shadow:
    0 12px 28px rgba(26, 23, 44, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.suggestion-poster {
  width: 90px;
  height: 116px;
  object-fit: cover;
  border-radius: 12px;
  background: #fdeabf;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.suggestion-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  color: #1a172c;
  line-height: 1.35;
}

.suggestion-info strong {
  font-size: 23px;
  font-weight: 700;
  margin-bottom: 2px;
}

.suggestion-info span {
  font-size: 17px;
  opacity: 0.65;
}

.btn-link {
  margin-top: auto;

  align-self: center;

  background: #1a172c;
  color: #fefefe;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;

  cursor: pointer;
  font-size: 17px;
  font-weight: 600;

  transition: all 0.2s ease;
}

.btn-link:hover {
  opacity: 0.92;
  transform: translateY(-1px);
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

.guest {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.guest-card {
  max-width: 520px;
  width: 100%;
  text-align: center;

  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 24px;
  padding: 32px;

  box-shadow: 0 10px 30px rgba(26, 23, 44, 0.08);
}

.guest-illustration {
  width: 350px;
  height: 350px;
  margin-bottom: 10px;
  opacity: 0.9;
}

.guest-title {
  font-size: 28px;
  margin-bottom: 10px;
  color: #1a172c;
}

.guest-subtitle {
  font-size: 17px;
  opacity: 0.7;
  margin-bottom: 20px;
  line-height: 1.5;
}

.guest-actions {
  display: flex;
  justify-content: center;
}

.guest-btn {
  width: 100%;
  max-width: 220px;
  padding: 12px 16px;

  border: none;
  border-radius: 12px;

  background: #1a172c;
  color: #fefefe;

  font-size: 15px;
  font-weight: 500;

  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 4px 12px rgba(26, 23, 44, 0.2);
}

.guest-btn:hover {
  background: #2d2a44;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(26, 23, 44, 0.3);
}

@media (max-width: 768px) {
  .home {
    padding: 12px;
  }

  .stats {
    gap: 10px;
    justify-content: center;
  }

  .stat-card {
    font-size: 14px;
    padding: 6px 10px;
  }

  .suggestion {
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
    gap: 10px;
  }

  .suggestion-icon {
    width: 92px;
    height: 92px;
    align-self: center;
    border-radius: 14px;
  }

  .suggestion-card {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-left: 0;
    margin-right: 0;
    min-width: unset;
    padding: 12px;
    border-radius: 16px;
  }

  .suggestion-poster {
    width: 100%;
    height: 220px;
    border-radius: 12px;
  }

  .suggestion-info {
    gap: 4px;
    text-align: center;
  }

  .suggestion-info strong {
    font-size: 17px;
  }

  .suggestion-info span {
    font-size: 13px;
  }

  .btn-link {
    width: 100%;
    font-size: 14px;
    padding: 10px;
    margin-top: 6px;
  }
}
</style>
