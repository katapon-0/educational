<script setup>
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMedia } from "../../composables/useMedia"

const route = useRoute()
const router = useRouter()

const { getMediaById, updateMedia, deleteMedia } = useMedia()

// =========================
// ДАННЫЕ
// =========================

const item = computed(() =>
    getMediaById(Number(route.params.id))
)

// =========================
// РЕЖИМ РЕДАКТИРОВАНИЯ
// =========================

const isEditing = ref(false)

// форма — только то, что реально редактируем
const form = ref({
    title: "",
    type: "",
    progress: 0,
    totalEpisodes: 0,
    episodeDuration: 0
})

// =========================
// СИНХРОНИЗАЦИЯ ФОРМЫ
// =========================

watch(item, (val) => {
    if (!val) return

    form.value = {
        title: val.title,
        type: val.type,
        progress: val.progress,
        totalEpisodes: val.totalEpisodes,
        episodeDuration: val.episodeDuration
    }
}, { immediate: true })

// =========================
// UI ACTIONS
// =========================

function startEdit() {
    isEditing.value = true
}

function cancelEdit() {
    isEditing.value = false
}

// =========================
// СОХРАНЕНИЕ (ВАЖНО: не ломаем объект)
// =========================

function save() {
    if (!item.value) return

    updateMedia(item.value.id, {
        title: form.value.title,
        type: form.value.type,
        progress: form.value.progress,
        totalEpisodes: form.value.totalEpisodes,
        episodeDuration: form.value.episodeDuration
    })

    isEditing.value = false
}

// =========================
// ПРОГРЕСС
// =========================

function increaseProgress() {
    if (!item.value) return

    updateMedia(item.value.id, {
        progress: (item.value.progress || 0) + 1
    })
}

// =========================
// УДАЛЕНИЕ
// =========================

function remove() {
    if (!item.value) return

    deleteMedia(item.value.id)
    router.push("/")
}

// =========================
// BACK
// =========================

function goBack() {
    router.back()
}
</script>

<template>
  <div class="page" v-if="item">

    <button class="btn-back" @click="goBack">← назад</button>

    <!-- VIEW -->
    <div v-if="!isEditing" class="card">

      <h1>{{ item.title }}</h1>

      <p class="meta">Тип: {{ item.type }}</p>

      <p v-if="item.type === 'series'" class="meta">
        {{ item.progress }} / {{ item.totalEpisodes }}
      </p>

      <p v-else class="meta">
        {{ item.episodeDuration }} мин
      </p>

      <div class="buttons">
        <button class="btn-accent" @click="increaseProgress">
          + прогресс
        </button>

        <button class="btn-dark" @click="startEdit">
          редактировать
        </button>

        <button class="btn-danger" @click="remove">
          удалить
        </button>
      </div>

    </div>

    <!-- EDIT -->
    <div v-else class="card">

      <h2>Редактирование</h2>

      <input v-model="form.title" placeholder="Название" />

      <select v-model="form.type">
        <option value="series">Сериал</option>
        <option value="film">Фильм</option>
      </select>

      <div v-if="form.type === 'series'">
        <input v-model="form.progress" type="number" placeholder="Прогресс" />
        <input v-model="form.totalEpisodes" type="number" placeholder="Эпизоды" />
      </div>

      <div v-else>
        <input v-model="form.episodeDuration" type="number" placeholder="Длительность" />
      </div>

      <div class="buttons">
        <button class="btn-accent" @click="save">сохранить</button>
        <button class="btn-dark" @click="cancelEdit">отмена</button>
      </div>

    </div>

  </div>

  <div v-else class="empty">
    <p>Медиа не найдено</p>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 40px auto;
  padding: 0 16px;

  font-family: Arial, sans-serif;
  color: #1a172c;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-back {
  align-self: flex-start;

  background: transparent;
  color: #1a172c;

  border: 1px solid #e5e5e5;
  padding: 6px 12px;
  border-radius: 8px;

  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #fdeabf;
  border-color: #fdb688;
  transform: translateY(-1px);
}

.card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;

  padding: 16px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  transition: all 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.card h1,
.card h2 {
  margin: 0;
  color: #1a172c;
}

.meta {
  opacity: 0.7;
}

input,
select {
  width: 100%;
  padding: 10px 12px;

  border: 1px solid #e5e5e5;
  border-radius: 10px;

  background: #fefefe;
  color: #1a172c;

  transition: all 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #fdb688;
  box-shadow: 0 0 0 3px rgba(253, 184, 136, 0.25);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.btn-accent {
  background: #fdb688;
  color: #1a172c;

  border: none;
  padding: 6px 14px;
  border-radius: 8px;

  cursor: pointer;
  transition: all 0.2s;
}

.btn-accent:hover {
  background: #fdeabf;
  transform: translateY(-1px);
}

.btn-dark {
  background: #1a172c;
  color: #fefefe;

  border: none;
  padding: 6px 14px;
  border-radius: 8px;

  cursor: pointer;
  transition: all 0.2s;
}

.btn-dark:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.btn-danger {
  background: transparent;
  color: #1a172c;

  border: 1px solid #e5e5e5;
  padding: 6px 14px;
  border-radius: 8px;

  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #fdeabf;
  border-color: #fdb688;
  transform: translateY(-1px);
}
 
.empty {
  text-align: center;
  padding: 60px;
  opacity: 0.5;
}
</style>