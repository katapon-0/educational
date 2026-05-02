<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useMedia } from "../../composables/useMedia"

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["delete"])

const router = useRouter()
const { updateStatus, statusLabels, increaseProgress, updateMedia, setWatchDate } = useMedia()

// мы проверяем,это серик или фильм
const isSeries = computed(() => props.item.type === "series")

const statusLabel = computed(() => statusLabels[props.item.status] ?? props.item.status)

const formattedWatchDate = computed(() => {
  if (!props.item.watchDate) return ""

  const date = new Date(props.item.watchDate)
  if (Number.isNaN(date.getTime())) return ""

  return date.toLocaleDateString("ru-RU")
})

const formattedDuration = computed(() => {
  return props.item.duration ?? "?" //если есть длительность показываем, иначе ?
})

const currentProgress = computed(() => props.item.progress ?? 0)

const totalEpisodes = computed(() => props.item.totalEpisodes ?? null)

const progressText = computed(() => {
  if (!isSeries.value) return ""
  return `${currentProgress.value} / ${totalEpisodes.value ?? "?"}`
})

//можно ли увеличить прогресс
const canIncreaseProgress = computed(() => {
  if (!isSeries.value) return false //если это не сериал-> нельзя
  if (!totalEpisodes.value) return true //если хз скок серий -> можно
  return currentProgress.value < totalEpisodes.value //если ещё не достигли конца -> моэно
})

//просрочено ли?
const isOverdue = computed(() => {
  if (!props.item.watchDate) return false //если нет даиы просмотра-> не просрочено 
  if (props.item.status === "done") return false //если отмечено как просмотрено, -> просрочено 

  const today = new Date() //берем сегодняшнюю дату
  today.setHours(0, 0, 0, 0) //обнуляем время

  const watchDate = new Date(props.item.watchDate) //превращаем дату просмотра в тип date
  watchDate.setHours(0, 0, 0, 0) //обнуляем

  return watchDate < today //если дата просмотра меньше сегодняшней даты -> просрочено
})

//дата добавления
const formattedDateAdded = computed(() => {
  if (!props.item.dateAdded) return ""
  return new Date(props.item.dateAdded).toLocaleDateString("ru-RU")
})

function open() {
  router.push(`/media/${props.item.id}`)
}

function remove() {
  emit("delete", props.item.id)
}

function changeStatus(status) {
  updateStatus(props.item.id, status)
}

//увеличить прогресс
function incProgress() {
  if (!isSeries.value || !canIncreaseProgress.value) return //если это не сериал и нельзя увеличивать -> нельзя
  increaseProgress(props.item.id) //иначе разрешаем
}

//уменьшить прогресс
function decProgress() {
  if (!isSeries.value) return //если это не сериал -> нельзя

  const newProgress = Math.max((props.item.progress ?? 0) - 1, 0) //уменьшаем на единичку, но ограничиваем чтобы нельзя было опустить ниже нуля
  updateMedia(props.item.id, { progress: newProgress })

  if (newProgress === 0) {
    updateStatus(props.item.id, "want") //если прогресс 0, кидаем в статус "хочу посмотреть"
  }
}

function onWatchDateChange(event) {
  const date = event.target.value || null
  setWatchDate(props.item.id, date)
}

const progressPercent = computed(() => {
  if (!isSeries.value) return 0

  const total = totalEpisodes.value
  const current = currentProgress.value

  if (!total || total === 0) return 0

  return Math.min((current / total) * 100, 100)
})

</script>

<template>
  <article class="card" :class="{ overdue: isOverdue }">
    <img :src="item.image" :alt="item.title" class="cover" />

    <div class="info">

      <h3 class="title">{{ item.title }}</h3>

      <p class="type">{{ isSeries ? "Сериал" : "Фильм" }}</p>

      <p class="status">{{ statusLabel }}</p>

      <p v-if="isOverdue" class="badge overdue-badge">⚠ Просрочено</p>

      <p v-if="item.watchDate" class="meta">
        📅 Смотреть до: {{ formattedWatchDate }}
      </p>

      <p v-if="item.dateAdded" class="meta">
        ➕ Добавлено: {{ formattedDateAdded }}
      </p>

      <div v-if="item.status !== 'done'" class="date-picker">
        <label class="meta">Назначить дату просмотра:</label>

        <input type="date" :value="item.watchDate ?? ''" @change="onWatchDateChange" />
      </div>

      <div v-if="isSeries" class="progress">

        <p class="meta">
          Прогресс: {{ progressText }}
        </p>

        <div class="progress-bar">
          <div class="fill" :style="{ width: progressPercent + '%' }"></div>
        </div>

        <div class="progress-controls">
          <button type="button" class="progress-btn" @click="decProgress">
            –
          </button>

          <button type="button" class="progress-btn" :disabled="!canIncreaseProgress" @click="incProgress">
            +
          </button>
        </div>
      </div>

      <p v-else class="meta">
        ⏱ {{ item.duration ?? "?" }} мин
      </p>

      <div class="buttons">

        <button type="button" @click="open" class="btn-open">
          Открыть
        </button>

        <button type="button" @click="changeStatus('want')" class="status-btn">
          Хочу
        </button>

        <button type="button" @click="changeStatus('watching')" class="status-btn">
          Смотрю
        </button>

        <button type="button" @click="changeStatus('done')" class="status-btn">
          Готово
        </button>

        <button type="button" @click="changeStatus('abandoned')" class="status-btn">
          Заброшено
        </button>

        <button type="button" @click="remove" class="btn-delete">
          Удалить
        </button>

      </div>

    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  gap: 14px;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  background: #fefefe;
  color: #1a172c;
  transition: all 0.2s ease;
  padding: 14px;
}

.card:hover {
  border-color: #1a172c;
  box-shadow: 0 6px 18px rgba(26, 23, 44, 0.08);
  transform: translateY(-1px);
}

.cover {
  width: 250px;
  height: 350px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  border: 1px solid #e5e5e5;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 18px;
  min-width: 0;
}

.title {
  color: #1a172c;
  margin: 0;
  font-size: 25px;
  line-height: 1.2;
}

.type,
.status,
.meta {
  font-size: 17px;
  color: rgba(26, 23, 44, 0.72);
  margin: 0;
}

.status {
  display: inline-flex;
  width: fit-content;
  padding: 10px 25px;
  border-radius: 999px;
  background: #fdeabf;
  color: #1a172c;
  font-weight: 600;
}

.progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.progress-controls {
  display: flex;
  gap: 8px;
}

.buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
}

.buttons button {
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 9px 26px;
  font-size: 17px;
}

.btn-open {
  background: #1a172c;
  color: #fefefe;
  border: 1px solid #1a172c;
}

.btn-open:hover {
  opacity: 0.92;
}

.status-btn {
  background: #fefefe;
  color: #1a172c;
  border: 1px solid #dcdcdc;
}

.status-btn:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

.btn-delete {
  background: #fefefe;
  color: #1a172c;
  border: 1px solid #dcdcdc;
}

.btn-delete:hover {
  background: #c36b65;
  border-color: #8b2424;
  color: #fff;
}

.progress-btn {
  border: 1px solid #dcdcdc;
  padding: 2px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #1a172c;
}

.progress-btn:hover:not(:disabled) {
  background: #fdb688;
}

.progress-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.overdue-text {
  color: #c36b65;
  font-weight: 600;
}

</style>