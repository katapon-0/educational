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
      <!-- требуется поле с добавленной/измененной датой -->
       <!-- ТИПО ТАКОГО -- <p v-if="item.dateAdded">➕ Добавлено: {{ new Date(item.dateAdded).toLocaleDateString() }}</p> -->

      <!-- ========================= -->
      <!-- ПРОГРЕСС -->
      <!-- ========================= -->
       <!-- запасной вариант для продвижения серии -->
      <p v-if="item.type === 'series'">
        Прогресс: {{ item.progress || 0 }} / {{ item.totalEpisodes ? item.totalEpisodes : '?' }}
        <!-- кнопка прогресса -->
        <button @click="incProgress" :disabled="item.progress >= item.totalEpisodes" class="progress-btn">+</button>
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
  gap: 14px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  background: #fefefe;
  color: #1a172c;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #1a172c;
  box-shadow: 0 6px 18px rgba(26, 23, 44, 0.08);
  transform: translateY(-1px);
}

.card.overdue {
  background: #fdeabf;
  border-color: #fdb688;
}

.cover {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  border: 1px solid #e5e5e5;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.info h3 {
  color: #1a172c;
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
}

.type,
.status,
.info p {
  font-size: 13px;
  color: rgba(26, 23, 44, 0.72);
  margin: 0;
}

.status {
  display: inline-flex;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fdeabf;
  color: #1a172c;
  font-weight: 600;
}

.buttons {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.buttons button {
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 6px 12px;
  border: 1px solid transparent;
  font-size: 13px;
}

.btn-open {
  background: #1a172c;
  color: #fefefe;
  border-color: #1a172c;
}

.btn-open:hover {
  opacity: 0.92;
}

.status-btn {
  background: #fefefe;
  color: #1a172c;
  border-color: #dcdcdc;
}

.status-btn:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

.btn-delete {
  background: #fefefe;
  color: #1a172c;
  border-color: #dcdcdc;
}

.btn-delete:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

.progress-btn {
 
  border: none;
  margin-left: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.progress-btn:hover {
  background: #fdeabf;
}

.progress-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>