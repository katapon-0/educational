<script setup>
import { ref } from "vue"
import { useUsers } from "../../composables/useUsers"
import defaultMedia from "../../data/defaultMedia"

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
  totalEpisodes: null
})

// =========================
// ДОБАВЛЕНИЕ ИЗ БАЗЫ/ теперь через find
// =========================
function addSelected() {
  if (!selectedId.value) return

  const selected = defaultMedia.find(item => item.id === selectedId.value)
  if (!selected) return

  // базовая структура
  const newItem = {
    title: selected.title,
    type: selected.type,
    description: selected.description || "",
    watchDate: selected.watchDate || null,
    link: selected.link || null
  }

  // добавляем специфичные поля
  if (selected.type === "series") {
    newItem.totalEpisodes = selected.totalEpisodes
  } else {
    newItem.duration = selected.duration
  }

  addMediaToUser(newItem)
  emit("close")
}

// =========================
// РУЧНОЕ ДОБАВЛЕНИЕ
// =========================
function addManual() {
  if (!manualForm.value.title) return

  const newItem = {
    title: manualForm.value.title,
    type: manualForm.value.type,
    watchDate: manualForm.value.watchDate || null,
    link: manualForm.value.link || null,
    description: ""
  }

  if (manualForm.value.type === "series") {
    newItem.totalEpisodes = manualForm.value.totalEpisodes || 0
  } else {
    newItem.duration = manualForm.value.duration || 0
  }

  addMediaToUser(newItem)
  emit("close")
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

        <!-- ВЫБОР ИЗ БАЗЫ -->
        <div v-if="mode === 'select'">
          <select v-model="selectedId">
            <option disabled value="">Выберите...</option>
            <option v-for="item in defaultMedia" :key="item.id" :value="item.id">
              {{ item.title }} ({{ item.type === "series" ? "Сериал" : "Фильм" }})
            </option>
          </select>
          <div class="actions">
            <button @click="addSelected" :disabled="!selectedId">Добавить</button>
            <button @click="$emit('close')">Отмена</button>
          </div>
        </div>

        <!-- РУЧНОЕ ДОБАВЛЕНИЕ -->
        <div v-else>
          <input v-model="manualForm.title" placeholder="Название *" />
          <select v-model="manualForm.type">
            <option value="film">Фильм</option>
            <option value="series">Сериал</option>
          </select>
          <input type="date" v-model="manualForm.watchDate" placeholder="Дата просмотра" />
          <input v-model="manualForm.link" placeholder="Ссылка" />

          <div v-if="manualForm.type === 'film'">
            <input type="number" v-model="manualForm.duration" placeholder="Длительность (мин)" />
          </div>
          <div v-else>
            <input type="number" v-model="manualForm.totalEpisodes" placeholder="Количество серий" />
          </div>

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
</style>