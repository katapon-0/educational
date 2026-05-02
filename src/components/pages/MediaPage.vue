<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMedia } from "../../composables/useMedia";

// подключаем изображения из базы и заглушки
import defaultMedia from "../../data/defaultMedia";
import plugFilm from "../../assets/img/plug-film.png"; // заглушка для фильма
import plugSeries from "../../assets/img/plug-series.png"; // заглушка для сериала

// Список доступных изображений для выбора
const availableImages = [
  { src: plugFilm, label: "Заглушка (фильм)" },
  { src: plugSeries, label: "Заглушка (сериал)" },
  ...defaultMedia.map((item) => ({ src: item.image, label: item.title })),
];

const route = useRoute();
const router = useRouter();

const {
  getMediaById,
  updateMedia,
  deleteMedia,
  increaseProgress,
  updateStatus,
} = useMedia();

// =========================
// ТЕКУЩИЙ ОБЪЕКТ
// =========================
const item = computed(() => getMediaById(Number(route.params.id)));

// =========================
// РЕЖИМ РЕДАКТИРОВАНИЯ
// =========================
const isEditing = ref(false);

// =========================
// СОСТОЯНИЯ UI (ошибки / успех)
// =========================
const errors = ref({});
const successMessage = ref("");
const errorMessage = ref("");

// =========================
// ФОРМА РЕДАКТИРОВАНИЯ
// =========================
const form = ref({
  title: "",
  type: "",
  progress: 0,
  totalEpisodes: 0,
  episodeDuration: 0,
  image: "",
  description: "",
  link: "",
});

// кастомный селект для изображений
const showImageSelect = ref(false);
const imageSelectRef = ref(null);
function toggleImageSelect() {
  showImageSelect.value = !showImageSelect.value;
}
function selectImage(imgSrc) {
  form.value.image = imgSrc;
  showImageSelect.value = false;
}
function closeImageSelect(e) {
  if (imageSelectRef.value && !imageSelectRef.value.contains(e.target)) {
    showImageSelect.value = false;
  }
}

// =========================
// СИНХРОНИЗАЦИЯ ДАННЫХ → ФОРМА
// =========================
watch(
  item,
  (val) => {
    if (!val) return;

    form.value = {
      title: val.title,
      type: val.type,
      progress: val.progress || 0,
      totalEpisodes: val.totalEpisodes || 0,
      episodeDuration: val.episodeDuration || 0,
      image: val.image || "",
      description: val.description || "",
      link: val.link || "",
    };
  },
  { immediate: true },
);

// =========================
// ВАЛИДАЦИЯ ФОРМЫ
// =========================
function validate() {
  errors.value = {};
  successMessage.value = "";
  errorMessage.value = "";

  if (!form.value.title.trim()) {
    errors.value.title = "Название не может быть пустым";
  }

  if (!form.value.type) {
    errors.value.type = "Выберите тип";
  }

  if (form.value.type === "series") {
    if (form.value.totalEpisodes < 1) {
      errors.value.totalEpisodes = "Должно быть хотя бы 1 серия";
    }

    if (form.value.progress < 0) {
      errors.value.progress = "Прогресс не может быть отрицательным";
    }

    if (form.value.progress > form.value.totalEpisodes) {
      errors.value.progress = "Прогресс не может превышать общее количество";
    }
  }

  return Object.keys(errors.value).length === 0;
}

// =========================
// UI ACTIONS
// =========================
function startEdit() {
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
  errors.value = {};
  successMessage.value = "";
  errorMessage.value = "";
}

// =========================
// СОХРАНЕНИЕ
// =========================
function save() {
  if (!item.value) return;

  if (!validate()) {
    errorMessage.value = "Проверьте корректность введённых данных";
    return;
  }

  try {
    updateMedia(item.value.id, {
      title: form.value.title,
      type: form.value.type,
      progress: form.value.progress,
      totalEpisodes: form.value.totalEpisodes,
      episodeDuration: form.value.episodeDuration,
      image: form.value.image,
      description: form.value.description,
      link: form.value.link,
    });

    successMessage.value = "Изменения сохранены";
    isEditing.value = false;
  } catch (e) {
    errorMessage.value = "Ошибка при сохранении";
  }
}

// =========================
// ПРОГРЕСС
// =========================
function handleIncreaseProgress() {
  if (!item.value) return;
  if (item.value.type !== "series") return;

  increaseProgress(item.value.id);

  const updatedItem = getMediaById(item.value.id);

  if (updatedItem?.progress >= updatedItem?.totalEpisodes) {
    router.push("/");
  }
}

function handleDecreaseProgress() {
  if (!item.value) return;
  if (item.value.type !== "series") return;

  let newProgress = (item.value.progress || 0) - 1;
  if (newProgress < 0) newProgress = 0;

  updateMedia(item.value.id, { progress: newProgress });

  if (newProgress === 0) {
    updateStatus(item.value.id, "want");
  }
}

// =========================
// УДАЛЕНИЕ
// =========================
function remove() {
  if (!item.value) return;
  deleteMedia(item.value.id);
  router.push("/");
}

// =========================
// НАВИГАЦИЯ
// =========================
function goBack() {
  router.back();
}

function markAsWatched() {
  if (!item.value) return;
  updateMedia(item.value.id, { status: "done" });
  router.push("/");
}
</script>

<template>
  <div class="page" v-if="item">
    <button class="btn-back" @click="goBack">← назад</button>

    <div v-if="!isEditing" class="card view-card">
      <div class="header">
        <h1 class="title">{{ item.title }}</h1>

        <span class="type">
          {{ item.type === "series" ? "Сериал" : "Фильм" }}
        </span>
      </div>

      <div class="content">
        <img v-if="item.image" :src="item.image" class="cover" />

        <div class="info">
          <p class="description">
            {{ item.description || "Описание отсутствует" }}
          </p>

          <div class="meta">
            <span v-if="item.type === 'series'">
              {{ item.progress || 0 }} / {{ item.totalEpisodes ?? "?" }} серий
            </span>

            <span v-else>
              {{ item.episodeDuration || item.duration || "?" }} мин
            </span>
          </div>
          <!-- кнопка "Смотреть онлайн" -->
          <a
            v-if="item.link"
            :href="item.link"
            target="_blank"
            class="btn accent watch-btn"
            >Смотреть онлайн</a
          >
        </div>
      </div>
      <div class="actions">
        <div v-if="item.type === 'series'" class="progress-actions">
          <button class="btn round" @click="handleDecreaseProgress">−</button>
          <button class="btn round accent" @click="handleIncreaseProgress">
            +
          </button>
        </div>

        <button v-else class="btn accent" @click="markAsWatched">
          ✔ Просмотрено
        </button>

        <button class="btn dark" @click="startEdit">Редактировать</button>

        <button class="btn danger" @click="remove">Удалить</button>
      </div>
    </div>
    <div v-else class="card edit-card">
      <h2 class="title">Редактирование</h2>
      <p v-if="errorMessage" class="error-global">
        {{ errorMessage }}
      </p>

      <p v-if="successMessage" class="success">
        {{ successMessage }}
      </p>

      <div class="form">
        <div class="field">
          <label>Название</label>
          <input v-model="form.title" placeholder="Введите название" />
          <small v-if="errors.title" class="error">{{ errors.title }}</small>
        </div>
        <div class="field">
          <label>Тип</label>
          <select v-model="form.type">
            <option value="series">Сериал</option>
            <option value="film">Фильм</option>
          </select>
          <small v-if="errors.type" class="error">{{ errors.type }}</small>
        </div>

        <!-- выбор изображения из списка -->
        <div class="field">
          <label>Обложка</label>
          <div
            class="custom-select"
            @click="toggleImageSelect"
            ref="imageSelectRef"
          >
            <div class="custom-select__trigger">
              <span>{{ form.image ? "Выбрано" : "Выберите изображение" }}</span>
              <span class="custom-select__arrow">▼</span>
            </div>
            <div v-if="showImageSelect" class="custom-select__options">
              <div
                v-for="img in availableImages"
                :key="img.src"
                class="custom-select__option"
                @click.stop="selectImage(img.src)"
              >
                <img :src="img.src" class="option-img" />
                <span>{{ img.label }}</span>
              </div>
            </div>
          </div>
          <img v-if="form.image" :src="form.image" class="image-preview" />
        </div>

        <!-- описание -->
        <div class="field">
          <label>Описание</label>
          <textarea
            v-model="form.description"
            placeholder="Описание фильма/сериала"
            rows="3"
          ></textarea>
        </div>

        <!-- ссылка для просмотра -->
        <div class="field">
          <label>Ссылка для просмотра</label>
          <input v-model="form.link" placeholder="https://..." />
        </div>

        <template v-if="form.type === 'series'">
          <div class="field">
            <label>Прогресс</label>
            <input
              v-model.number="form.progress"
              type="number"
              :max="form.totalEpisodes"
            />
            <small v-if="errors.progress" class="error">{{
              errors.progress
            }}</small>
          </div>
          <div class="field">
            <label>Всего серий</label>
            <input v-model.number="form.totalEpisodes" type="number" />
            <small v-if="errors.totalEpisodes" class="error">{{
              errors.totalEpisodes
            }}</small>
          </div>
        </template>
        <template v-else>
          <div class="field">
            <label>Длительность (мин)</label>
            <input v-model.number="form.episodeDuration" type="number" />
          </div>
        </template>
      </div>

      <div class="actions">
        <button class="btn accent" @click="save">Сохранить</button>
        <button class="btn dark" @click="cancelEdit">Отмена</button>
      </div>
    </div>
  </div>
  <div v-else class="empty"><p>Медиа не найдено</p></div>
</template>

<style scoped>
.page {
  max-width: 980px;
  margin: 0 auto;
  padding: 110px 18px 60px;

  display: flex;
  flex-direction: column;
  gap: 18px;

  color: #1a172c;
}

.btn-back {
  align-self: flex-start;

  background: transparent;
  border: 1px solid #e5e5e5;
  border-radius: 999px;

  padding: 8px 16px;
  cursor: pointer;

  transition: all 0.2s ease;
  color: #1a172c;
  font-size: 14px;
}

.btn-back:hover {
  background: #fdeabf;
  border-color: #fdb688;
  transform: translateY(-1px);
}

.card {
  background: #fefefe;
  border: 1px solid #e5e5e5;
  border-radius: 18px;

  padding: 22px;

  display: flex;
  flex-direction: column;
  gap: 18px;

  transition: all 0.2s ease;
}

.card:hover {
  border-color: #1a172c;
  box-shadow: 0 10px 24px rgba(26, 23, 44, 0.08);
  transform: translateY(-2px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 28px;
  margin: 0;
  color: #1a172c;
  line-height: 1.2;
  font-weight: 700;
}

.type {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  background: #fdeabf;
  color: #1a172c;
  white-space: nowrap;
}

.content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.cover {
  width: 240px;
  height: 340px;

  object-fit: cover;
  border-radius: 14px;
  border: 1px solid #e5e5e5;

  flex-shrink: 0;

  box-shadow: 0 6px 16px rgba(26, 23, 44, 0.08);
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.description {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(26, 23, 44, 0.78);
}

.meta {
  font-size: 15px;
  color: rgba(26, 23, 44, 0.65);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  padding-top: 12px;
  border-top: 1px solid #eee;
}

.progress-actions {
  display: flex;
  gap: 8px;
}

.btn {
  border-radius: 999px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  font-weight: 500;
}

.dark {
  background: #1a172c;
  color: #fefefe;
  border: 1px solid #1a172c;
}

.dark:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.accent {
  background: #fdb688;
  color: #1a172c;
  border: none;
}

.accent:hover {
  background: #fdeabf;
  transform: translateY(-1px);
}

.danger {
  background: #fefefe;
  color: #1a172c;
  border: 1px solid #e5e5e5;
}

.danger:hover {
  background: #c36b65;
  border-color: #8b2424;
  color: #fff;
  transform: translateY(-1px);
}

.round {
  width: 38px;
  height: 38px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
}

.edit-card {
  background: #fefefe;
  border: 1px solid #e5e5e5;
  border-radius: 18px;

  box-shadow: 0 10px 30px rgba(26, 23, 44, 0.12);

  padding: 26px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  overflow: hidden;
}

.edit-card .title {
  font-size: 22px;
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  width: 100%;
  max-width: 100%;
}

label {
  font-size: 14px;
  color: rgba(26, 23, 44, 0.75);
}

input,
select {
  width: 100%;
  box-sizing: border-box;

  padding: 12px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;

  background: #fefefe;
  color: #1a172c;

  font-size: 15px;

  transition: all 0.2s ease;

  min-width: 0;
}

input:focus,
select:focus {
  outline: none;
  border-color: #fdb688;
  box-shadow: 0 0 0 3px rgba(253, 184, 136, 0.25);
}

input::placeholder {
  color: rgba(26, 23, 44, 0.45);
}

.error {
  font-size: 12px;
  color: #c36b65;
}

.error-global,
.success {
  font-size: 14px;
  padding: 10px 12px;
  border-radius: 10px;
}

.edit-card .actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  padding-top: 12px;
  border-top: 1px solid #eee;
}

.edit-card .btn {
  font-size: 14px;
  padding: 10px 16px;
}

.field,
input,
select {
  max-width: 100%;
}

.custom-select {
  position: relative;
  width: 100%;
  background: #fefefe;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
}

.custom-select__trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  font-size: 14px;
}

.custom-select__arrow {
  font-size: 10px;
  color: #999;
}

.custom-select__options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  z-index: 10;
  margin-top: 4px;
}

.custom-select__option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  transition: 0.2s;
}

.custom-select__option:hover {
  background: #fdeabf;
}

.option-img {
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 4px;
}

.image-preview {
  margin-top: 8px;
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
}

.watch-btn {
  display: inline-block;
  text-decoration: none;
  color: white;
  background: #1a172c;
  padding: 8px 18px;
  border-radius: 40px;
  margin-top: 12px;
  width: 150px;
}

.watch-btn:hover {
  background: #2d2a44;
}

</style>