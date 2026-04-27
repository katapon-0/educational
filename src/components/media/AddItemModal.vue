<script setup>
import { ref } from "vue"
import { useUsers } from "../../composables/useUsers"
import defaultMedia from "../../data/defaultMedia"

const emit = defineEmits(["close"])
const { addMediaToUser } = useUsers()

// =========================
// СОСТОЯНИЕ РАЗР 2 
// =========================
const mode = ref("select") // 'select' или 'manual'
const selectedId = ref(null)

const manualForm = ref({
  title: "",
  type: "film",
  watchDate: "",
  link: "",
  duration: null,
  totalEpisodes: null
})

const baseItems = defaultMedia

// =========================
// ДОБАВЛЕНИЕ ИЗ БАЗЫ
// =========================
function addSelected() {
  if (!selectedId.value) return

  var selected = null
  for (var i = 0; i < baseItems.length; i++) {
    if (baseItems[i].id === selectedId.value) {
      selected = baseItems[i]
      break
    }
  }

  if (selected) {
    var newItem = {
      title: selected.title,
      type: selected.type,
      description: selected.description || "",
      watchDate: selected.watchDate || null,
      link: selected.link || null
    }

    if (selected.type === "series") {
      newItem.totalEpisodes = selected.totalEpisodes
    } else {
      newItem.duration = selected.duration
    }

    addMediaToUser(newItem)
    emit("close")
  }
}

// =========================
// РУЧНОЕ ДОБАВЛЕНИЕ
// =========================
function addManual() {
  if (!manualForm.value.title) return

  var newItem = {
    title: manualForm.value.title,
    type: manualForm.value.type,
    watchDate: manualForm.value.watchDate || null,
    link: manualForm.value.link || null,
    description: "",
    image: null
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
            <option v-for="item in baseItems" :key="item.id" :value="item.id">
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a1a1a;
  padding: 24px;
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  border: 1px solid #333;
}

.modal h3 {
  color: #ffffff;
  margin: 0 0 10px 0;
}

.tabs {
  display: flex;
  gap: 10px;
  margin: 16px 0;
}

.tabs button {
  flex: 1;
  padding: 8px;
  border: none;
  background: #2a2a2a;
  color: #cccccc;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.tabs button.active {
  background: #68a61c;
  color: #ffffff;
}

select, input {
  width: 100%;
  margin: 8px 0;
  padding: 10px;
  box-sizing: border-box;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #ffffff;
}

select:focus, input:focus {
  outline: none;
  border-color: #68a61c;
}

input::placeholder {
  color: #888;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.actions button:first-child {
  background: #68a61c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
}

.actions button:first-child:hover {
  background: #4c7a14;
}

.actions button:last-child {
  background: #333;
  color: #ccc;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
}

.actions button:last-child:hover {
  background: #444;
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>