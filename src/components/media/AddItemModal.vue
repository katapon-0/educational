<script setup>
import { ref } from "vue"
import { useUsers } from "../../composables/useUsers"
import defaultMedia from "../../data/defaultMedia"
import plugFilm from "../../assets/img/plug-film.png"
import plugSeries from "../../assets/img/plug-series.png"

const MIN_WATCH_DATE = "2026-01-01"
const MAX_WATCH_DATE = "2100-01-01"

const availableImages = [
  { src: plugFilm, label: "Заглушка (фильм)" },
  { src: plugSeries, label: "Заглушка (сериал)" },
  ...defaultMedia.map(item => ({ src: item.image, label: item.title }))
]

const emit = defineEmits(["close"])
const { addMediaToUser } = useUsers()

// =========================
// СОСТОЯНИЕ
// =========================
const mode = ref("select")
const selectedId = ref(null)

const manualForm = ref({
  title: "",
  type: "film",
  watchDate: "",
  link: "",
  duration: null,
  totalEpisodes: null,
  image: plugFilm,
  description: ""
})

const showImageSelect = ref(false)
const imageSelectRef = ref(null)
const selectedImage = ref(null)

function toggleImageSelect() {
  showImageSelect.value = !showImageSelect.value
}

function selectImage(img) {
  manualForm.value.image = img.src
  selectedImage.value = img
  showImageSelect.value = false
}

// =========================
// КАЛЕНДАРЬ
// =========================
const dateInput = ref(null)

function openDatePicker() {
  const input = dateInput.value
  if (!input) return

  if (input.showPicker) {
    input.showPicker()
  } else {
    input.focus()
    input.click()
  }
}

function validateWatchDate() {
  const date = manualForm.value.watchDate
  if (!date) return

  if (date < MIN_WATCH_DATE) {
    errors.value.watchDate = "Дата не может быть раньше 01.01.2026"
  } else if (date > MAX_WATCH_DATE) {
    errors.value.watchDate = "Дата не может быть позже 01.01.2100"
  } else {
    delete errors.value.watchDate
  }
}

// =========================
// ДОБАВЛЕНИЕ ИЗ БАЗЫ
// =========================
function addSelected() {
  if (!validateSelect()) return

  const selected = defaultMedia.find(item => item.id === selectedId.value)
  if (!selected) return

  const newItem = {
    title: selected.title,
    type: selected.type,
    description: selected.description || "",
    watchDate: selected.watchDate || null,
    link: selected.link || null,
    image: selected.image || ""
  }

  if (selected.type === "series") {
    newItem.totalEpisodes = selected.totalEpisodes
  } else {
    newItem.duration = selected.duration
  }

  addMediaToUser(newItem)
  successMessage.value = "Добавлено успешно"
  emit("close")
}

// =========================
// РУЧНОЕ ДОБАВЛЕНИЕ
// =========================
function addManual() {
  if (!validateManual()) return

  const newItem = {
    title: manualForm.value.title,
    type: manualForm.value.type,
    watchDate: manualForm.value.watchDate || null,
    link: manualForm.value.link || null,
    description: manualForm.value.description || "",
    image: manualForm.value.image || ""
  }

  if (manualForm.value.type === "series") {
    newItem.totalEpisodes = manualForm.value.totalEpisodes || 0
  } else {
    newItem.duration = manualForm.value.duration || 0
  }

  addMediaToUser(newItem)
  successMessage.value = "Добавлено успешно"
  emit("close")
}

// =========================
// ВАЛИДАЦИЯ
// =========================
const errors = ref({})
const successMessage = ref("")

function validateSelect() {
  errors.value = {}
  successMessage.value = ""

  if (!selectedId.value) {
    errors.value.selectedId = "Выберите фильм или сериал"
  }

  return Object.keys(errors.value).length === 0
}

function validateManual() {
  errors.value = {}
  successMessage.value = ""

  if (!manualForm.value.title?.trim()) {
    errors.value.title = "Введите название"
  }

  if (!manualForm.value.type) {
    errors.value.type = "Выберите тип"
  }

  // дата
  if (manualForm.value.watchDate) {
    if (manualForm.value.watchDate < MIN_WATCH_DATE) {
      errors.value.watchDate = "Дата не может быть раньше 01.01.2026"
    } else if (manualForm.value.watchDate > MAX_WATCH_DATE) {
      errors.value.watchDate = "Дата не может быть позже 01.01.2100"
    }
  }

  if (manualForm.value.type === "series") {
    if (
      manualForm.value.totalEpisodes === null ||
      manualForm.value.totalEpisodes <= 0
    ) {
      errors.value.totalEpisodes = "Введите количество серий"
    }
  }

  if (manualForm.value.type === "film") {
    if (
      manualForm.value.duration === null ||
      manualForm.value.duration <= 0
    ) {
      errors.value.duration = "Введите длительность"
    }
  }

  return Object.keys(errors.value).length === 0
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">
        <h3>Добавить фильм или сериал</h3>

        <div class="tabs">
          <button @click="mode = 'select'" :class="{ active: mode === 'select' }">
            Выбрать из базы
          </button>
          <button @click="mode = 'manual'" :class="{ active: mode === 'manual' }">
            Добавить вручную
          </button>
        </div>

        <!-- SELECT -->
        <div v-if="mode === 'select'">
          <select v-model="selectedId">
            <option disabled value="">Выберите...</option>
            <option v-for="item in defaultMedia" :key="item.id" :value="item.id">
              {{ item.title }} ({{ item.type === "series" ? "Сериал" : "Фильм" }})
            </option>
          </select>

          <small v-if="errors.selectedId" class="error">{{ errors.selectedId }}</small>

          <div class="actions">
            <button @click="addSelected" :disabled="!selectedId">Добавить</button>
            <button @click="$emit('close')">Отмена</button>
          </div>
        </div>

        <!-- MANUAL -->
        <div v-else>
          <input v-model="manualForm.title" placeholder="Название *" />
          <small v-if="errors.title" class="error">{{ errors.title }}</small>

          <select v-model="manualForm.type">
            <option value="film">Фильм</option>
            <option value="series">Сериал</option>
          </select>

          <small v-if="errors.type" class="error">{{ errors.type }}</small>

          <!-- КАЛЕНДАРЬ -->
          <div class="date-picker" @click="openDatePicker">
            <div class="custom-date-select">
              <input ref="dateInput" type="date" v-model="manualForm.watchDate" :min="MIN_WATCH_DATE"
                :max="MAX_WATCH_DATE" class="hidden-date-input" @change="validateWatchDate" />
            </div>
          </div>

          <small v-if="errors.watchDate" class="error">{{ errors.watchDate }}</small>

          <input v-model="manualForm.link" placeholder="Ссылка" />
          <input v-model="manualForm.description" placeholder="Описание" />

          <!-- IMAGE -->
          <div class="custom-select" @click="toggleImageSelect">
            <div class="custom-select__trigger">
              <span>
                {{ selectedImage ? selectedImage.label : 'Выберите обложку' }}
              </span>
              <span class="custom-select__arrow">▼</span>
            </div>

            <div v-if="showImageSelect" class="custom-select__options">
              <div v-for="img in availableImages" :key="img.src" class="custom-select__option"
                @click.stop="selectImage(img)">
                <img :src="img.src" class="option-img" />
                <span>{{ img.label }}</span>
              </div>
            </div>
          </div>

          <img v-if="manualForm.image" :src="manualForm.image" class="image-preview" />

          <!-- DURATION / EPISODES -->
          <div v-if="manualForm.type === 'film'">
            <input type="number" v-model="manualForm.duration" placeholder="Длительность (мин)" />
            <small v-if="errors.duration" class="error">{{ errors.duration }}</small>
          </div>

          <div v-else>
            <input type="number" v-model="manualForm.totalEpisodes" placeholder="Количество серий" />
            <small v-if="errors.totalEpisodes" class="error">{{ errors.totalEpisodes }}</small>
          </div>

          <small v-if="successMessage" class="success">{{ successMessage }}</small>

          <div class="actions">
            <button @click="addManual" :disabled="!manualForm.title">Добавить</button>
            <button @click="$emit('close')">Отмена</button>
          </div>
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
  width: 420px;
  max-width: 92%;
  border: 1px solid #e5e5e5;
  box-shadow: 0 10px 30px rgba(26, 23, 44, 0.12);
  color: #1a172c;
}

.modal h3 {
  color: #1a172c;
  margin: 0 0 12px 0;
  font-size: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin: 16px 0;
}

.tabs button {
  flex: 1;
  padding: 9px;
  border: 1px solid #e5e5e5;
  background: transparent;
  color: #1a172c;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
}

.tabs button:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

.tabs button.active {
  background: #1a172c;
  color: #fefefe;
  border-color: #1a172c;
}

select,
input {
  width: 100%;
  margin: 8px 0;
  padding: 10px 12px;
  box-sizing: border-box;
  background: #fefefe;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  color: #1a172c;
  transition: all 0.2s;
}

select:focus,
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
  margin-top: 18px;
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

.actions button:first-child:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  margin-top: 4px;
}

.success {
  color: #1c9c3c;
  font-size: 13px;
  margin-top: 10px;
}

.custom-select {
  position: relative;
  width: 100%;
  background: #fefefe;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
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
}

.watch-btn:hover {
  background: #2d2a44;
}
</style>