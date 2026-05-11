<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useMedia } from "../../composables/useMedia";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete"]);

const router = useRouter();
const {
  updateStatus,
  statusLabels,
  increaseProgress,
  updateMedia,
  setWatchDate,
} = useMedia();

// мы проверяем,это серик или фильм
const isSeries = computed(() => props.item.type === "series");

const statusLabel = computed(
  () => statusLabels[props.item.status] ?? props.item.status,
);

const currentProgress = computed(() => props.item.progress ?? 0);

const totalEpisodes = computed(() => props.item.totalEpisodes ?? null);

const progressText = computed(() => {
  if (!isSeries.value) return "";
  return `${currentProgress.value} / ${totalEpisodes.value ?? "?"}`;
});

//можно ли увеличить прогресс
const canIncreaseProgress = computed(() => {
  if (!isSeries.value) return false; //если это не сериал-> нельзя
  if (!totalEpisodes.value) return true; //если хз скок серий -> можно
  return currentProgress.value < totalEpisodes.value; //если ещё не достигли конца -> моэно
});

//просрочено ли?
const isOverdue = computed(() => {
  if (!props.item.watchDate) return false; //если нет даиы просмотра-> не просрочено
  if (props.item.status === "done" || props.item.status === "abandoned")
    return false; //если отмечено как просмотрено или заброшено, -> не просрочено

  const today = new Date(); //берем сегодняшнюю дату
  today.setHours(0, 0, 0, 0); //обнуляем время

  const watchDate = new Date(props.item.watchDate); //превращаем дату просмотра в тип date
  watchDate.setHours(0, 0, 0, 0); //обнуляем

  return watchDate < today; //если дата просмотра меньше сегодняшней даты -> просрочено
});

//дата добавления
const formattedDateAdded = computed(() =>
  props.item.dateAdded
    ? new Date(props.item.dateAdded).toLocaleDateString("ru-RU")
    : "",
);

function open() {
  router.push({
    name: "media",
    params: { id: props.item.id },
  });
}

function remove() {
  emit("delete", props.item.id);
}

function changeStatus(status) {
  updateStatus(props.item.id, status);

  if (status === "want") {
    updateMedia(props.item.id, { progress: 0 });
  }

  if (status === "done") {
    updateMedia(props.item.id, {
      progress: totalEpisodes.value ?? props.item.progress,
    });
  }
}

function syncStatusWithProgress(progress) {
  const total = totalEpisodes.value;

  if (progress === 0) {
    return "want";
  }

  if (total && progress >= total) {
    return "done";
  }

  return "watching";
}

//увеличить прогресс
function incProgress() {
  if (!isSeries.value || !canIncreaseProgress.value) return;

  const newProgress = (props.item.progress ?? 0) + 1;

  const newStatus = syncStatusWithProgress(newProgress);

  updateMedia(props.item.id, {
    progress: newProgress,
  });

  updateStatus(props.item.id, newStatus);
}

//уменьшить прогресс
function decProgress() {
  if (!isSeries.value) return; //если это не сериал -> нельзя

  const newProgress = Math.max((props.item.progress ?? 0) - 1, 0); //уменьшаем на единичку, но ограничиваем чтобы нельзя было опустить ниже нуля

  const newStatus = syncStatusWithProgress(newProgress);

  updateMedia(props.item.id, {
    progress: newProgress,
  });

  updateStatus(props.item.id, newStatus);
}

// обработчик смены даты из кастомного селекта
function onWatchDateChange(event) {
  const date = event.target.value || null;
  setWatchDate(props.item.id, date);
}

const progressPercent = computed(() => {
  if (!isSeries.value) return 0;

  const total = totalEpisodes.value;
  const current = currentProgress.value;

  if (!total || total === 0) return 0;

  return Math.min((current / total) * 100, 100);
});

//для фикса нажатия календаря
const dateInput = ref(null); //по умолчанию нулл, потом загрузится другое значение

// модальное окно подтверждения удаления
const showDeleteConfirm = ref(false);

function requestDelete() {
  showDeleteConfirm.value = true;
}

function confirmDelete() {
  showDeleteConfirm.value = false;
  emit("delete", props.item.id);
}

function cancelDelete() {
  showDeleteConfirm.value = false;
}

function openDatePicker() {
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
  if (!dateInput.value) return; //чтобы не ругался что dateinput каннот рид пропертдис оф нулл
  //если простыми словами,шоупикер это команда "открой это"
  if (dateInput.value.showPicker) {
    //если шоу пикер поддерживается в браузере
    dateInput.value.showPicker(); //нажать
  } else {
    dateInput.value.focus(); //навести на календарь
    dateInput.value.click(); //кликнуть
  }
}
</script>

<template>
  <article class="card" :class="{ overdue: isOverdue }">
    <img :src="item.image" :alt="item.title" class="cover" />

    <div class="info">
      <h3 class="title">{{ item.title }}</h3>

      <p class="type">{{ isSeries ? "Сериал" : "Фильм" }}</p>

      <p class="status">{{ statusLabel }}</p>

      <p v-if="item.dateAdded" class="meta">
        ➕ Добавлено: {{ formattedDateAdded }}
      </p>

      <!-- кастомный селект даты просмотра (как фильтры) -->
      <div v-if="item.status !== 'done' && item.status !== 'abandoned'" class="date-picker">
        <label class="meta">Назначить дату просмотра:</label>

        <div class="date-row">
          <div class="custom-date-select" @click="openDatePicker">
            <img src="../../assets/icons/calendar.png" class="calendar-icon" />
            <span class="selected-date">
              {{
                item.watchDate
                  ? new Date(item.watchDate).toLocaleDateString("ru-RU")
                  : "Не выбрана"
              }}
            </span>
            <span class="custom-select__arrow">▼</span>

            <input ref="dateInput" type="date" :value="item.watchDate ?? ''" @change="onWatchDateChange"
              class="hidden-date-input" />
          </div>

          <p v-if="isOverdue" class="badge overdue-badge">Просрочено :-(</p>
        </div>
      </div>

      <div v-if="isSeries" class="progress">
        <p class="meta">Прогресс: {{ progressText }}</p>

        <div class="progress-bar">
          <div class="fill" :style="{ width: progressPercent + '%' }"></div>
        </div>

        <div class="progress-controls">
          <button class="btn round neutral" @click="decProgress">–</button>

          <button class="btn round dark" @click="incProgress" :disabled="!canIncreaseProgress">
            +
          </button>
        </div>
      </div>

      <p v-else class="meta">
        ⏱ {{ item.episodeDuration ?? item.duration ?? "?" }} мин
      </p>

      <div class="buttons">
        <!-- Открыть -->
        <button type="button" @click="open" class="btn dark primary-mobile">
          Открыть
        </button>

        <!-- статусы -->
        <div class="secondary-actions">
          <button type="button" @click="changeStatus('want')" class="btn neutral">
            Хочу
          </button>

          <button type="button" @click="changeStatus('watching')" class="btn neutral">
            Смотрю
          </button>

          <button type="button" @click="changeStatus('done')" class="btn neutral">
            Готово
          </button>

          <button type="button" @click="changeStatus('abandoned')" class="btn neutral">
            Заброшено
          </button>

          <!-- удалить -->
          <button type="button" @click="requestDelete" class="btn danger">
            Удалить
          </button>
        </div>
      </div>
    </div>
  </article>

  <!--  модальное окно подтверждения удаления -->
  <Teleport to="body">
    <div v-if="showDeleteConfirm" class="confirm-overlay" @click.self="cancelDelete">
      <div class="confirm-modal">
        <h3>Удаление медиа</h3>
        <p>
          Вы точно хотите удалить <strong>{{ item.title }}</strong>?
        </p>

        <div class="confirm-actions">
          <button type="button" class="btn danger" @click="confirmDelete">
            Удалить
          </button>
          <button type="button" class="btn accent" @click="cancelDelete">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </Teleport>
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

/* .card:hover {
  border-color: #1a172c;
  box-shadow: 0 6px 18px rgba(26, 23, 44, 0.08);
   transform: translateY(-1px); 
} */

.cover {
  width: 280px;
  height: 400px;
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
  padding: 15px;
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

.date-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 8px 0;
}

.date-picker .meta {
  font-size: 14px;
  color: #666;
}

.date-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.custom-date-select {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #fefefe;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  position: relative;
  width: 220px;
  justify-content: space-between;
}

.custom-date-select:hover {
  border-color: #fdb688;
}

.calendar-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.selected-date {
  flex: 1;
  font-size: 14px;
  color: #1a172c;
  text-align: left;
}

.custom-select__arrow {
  font-size: 10px;
  color: #999;
}

.hidden-date-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
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
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 0;
  /* убираем общий gap, теперь управляем через блоки */
  margin-top: 12px;
}

.buttons button {
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;

  padding: 9px 26px;
  font-size: 17px;

  margin: 2px;
}


.overdue-badge {
  color: #c36b65;
  font-weight: 600;
  margin: 0;
  padding: 4px 10px;
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
}

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 23, 44, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.confirm-modal {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  max-width: 360px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(26, 23, 44, 0.2);
}

.confirm-modal h3 {
  margin: 12px 0 12px;
  color: #1a172c;
  font-size: 20px;
}

.confirm-modal p {
  margin: 0 0 24px;
  color: #333;
  font-size: 15px;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn {
  border-radius: 999px;
  height: 38px;
  padding: 0 20px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  font-weight: 500;
}

.accent {
  background: #fdb688;
  color: #1a172c;
  border: none;
}

.accent:hover {
  background: #fdeabf;
  /* transform: translateY(-1px); */
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
  /* transform: translateY(-1px); */
}


@media (max-width: 768px) {
  .card {
    flex-direction: column;
    align-items: center;
    padding: 12px;
  }

  .cover {
    width: 100%;
    max-width: 320px;
    height: auto;
    aspect-ratio: 2 / 3;
  }

  .info {
    width: 100%;
    padding: 10px 0;
  }

  .title {
    font-size: 20px;
  }

  .type,
  .status,
  .meta {
    font-size: 14px;
  }

  .custom-date-select {
    width: 100%;
    max-width: 280px;
  }

  .buttons {
    width: 100%;
    gap: 8px;
  }

  .buttons button {
    flex: 1 1 45%;
    padding: 10px;
    font-size: 14px;
  }

  .progress-controls {
    justify-content: center;
  }

  .primary-mobile {
    width: 100%;
    font-size: 16px;
    padding: 12px;
    border-radius: 14px;
    margin-bottom: 10px;
  }

  .secondary-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    width: 100%;
  }

  .secondary-actions button {
    flex: 1 1 45%;
    font-size: 13px;
    padding: 8px;
    border-radius: 12px;
  }
}

.dark {
  background: #1a172c;
  color: #fefefe;
  border: 1px solid #1a172c;
}

.dark:hover {
  background: #2d2a44;
}

.accent {
  background: #fdb688;
  color: #1a172c;
  border: none;
}

.accent:hover {
  background: #fdeabf;
}

.neutral {
  background: #fefefe;
  color: #1a172c;
  border: 1px solid #e5e5e5;
}

.neutral:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

.round {
  width: 38px;
  height: 38px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  line-height: 1;
  font-size: 18px;
}
</style>
