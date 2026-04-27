<script setup>
import { useRouter } from "vue-router"
import { useMedia } from "../../composables/useMedia"

const props = defineProps({
  item: Object
})

const emit = defineEmits(["delete"])

const router = useRouter()
const { updateStatus, statusLabels, increaseProgress } = useMedia()

// =========================
// ОТКРЫТЬ СТРАНИЦУ
// =========================
function open() {
  router.push("/media/" + props.item.id)
}

// =========================
// УДАЛИТЬ
// =========================
function remove() {
  emit("delete", props.item.id)
}

function changeStatus(status) {
  updateStatus(props.item.id, status)
}

function incProgress() {
  if (props.item.type === "series") {
    increaseProgress(props.item.id)
  }
}

function isOverdue() {
  if (!props.item.watchDate) return false
  if (props.item.status === "done") return false
  var today = new Date()
  today.setHours(0, 0, 0, 0)
  var watchDate = new Date(props.item.watchDate)
  return watchDate < today
}

</script>

<template>
  <div class="card" :class="{ overdue: isOverdue() }">

    <!-- ========================= -->
    <!-- ОБЛОЖКА -->
    <!-- ========================= -->
    <img :src="item.image" class="cover" />

    <!-- ========================= -->
    <!-- ИНФО -->
    <!-- ========================= -->
    <div class="info">

      <h3>{{ item.title }}</h3>

      <p class="type">
        {{ item.type === 'series' ? 'Сериал' : 'Фильм' }}
      </p>

      <p class="status">{{ statusLabels[item.status] }}</p>

      <p v-if="item.watchDate">📅 {{ new Date(item.watchDate).toLocaleDateString() }}</p>

      <!-- ========================= -->
      <!-- ПРОГРЕСС -->
      <!-- ========================= -->
      <p v-if="item.type === 'series'">
        📺 Прогресс: {{ item.progress }} / {{ item.totalEpisodes }}
        <!-- ДОБАВЛЕНО 2: кнопка прогресса -->
        <button @click="incProgress" :disabled="item.progress >= item.totalEpisodes">+</button>
      </p>

      <p v-else>
        ⏱  {{ item.duration }} мин
      </p>

      <!-- ========================= -->
      <!-- КНОПКИ (ДОБАВЛЕНЫ СТАТУСЫ)-->
      <!-- ========================= -->
      <div class="buttons">

        <button @click="open" class="btn-open">Открыть</button>
        <button @click="changeStatus('want')" class="status-btn">Хочу</button>
        <button @click="changeStatus('watching')" class="status-btn">Смотрю</button>
        <button @click="changeStatus('done')" class="status-btn">Готово</button>
        <button @click="changeStatus('abandoned')" class="status-btn">Заброшено</button>
        <button @click="remove" class="btn-delete">Удалить</button>

      </div>

    </div>

  </div>
</template>

<style scoped>
.card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #333;
  transition: 0.2s;
}

.card.overdue {
  background-color: #2a1515;
  border-color: #ff4444;
}

.card:hover {
  transform: translateY(-2px);
  border-color: #68a61c;
}

.cover {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info h3 {
  color: #ffffff;
  margin: 0;
}

.type, .status {
  font-size: 12px;
  color: #888;
}

.buttons {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.buttons button {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-open {
  background: #333;
  color: #fff;
  border: none;
}

.btn-open:hover {
  background: #68a61c;
}

.status-btn {
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
}

.status-btn:hover {
  background: #68a61c;
  color: #fff;
  border-color: #68a61c;
}

.btn-delete {
  background: #3a1a1a;
  color: #ff6666;
  border: 1px solid #662222;
}

.btn-delete:hover {
  background: #662222;
  color: #ff8888;
}

.progress-btn {
  background: #68a61c;
  color: #fff;
  border: none;
  margin-left: 4px;
  padding: 2px 6px;
}

.progress-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>