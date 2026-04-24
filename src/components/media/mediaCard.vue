<script setup>
import { useRouter } from "vue-router"

const props = defineProps({
  item: Object
})

const emit = defineEmits(["delete"])

const router = useRouter()

// =========================
// ОТКРЫТЬ СТРАНИЦУ
// =========================
function open() {
  router.push(`/media/${props.item.id}`)
}

// =========================
// УДАЛИТЬ
// =========================
function remove() {
  emit("delete", props.item.id)
}
</script>

<template>
  <div class="card">

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

      <!-- ========================= -->
      <!-- ПРОГРЕСС -->
      <!-- ========================= -->
      <p v-if="item.type === 'series'">
        {{ item.progress }} / {{ item.totalEpisodes }}
      </p>

      <p v-else>
        {{ item.episodeDuration }} мин
      </p>

      <!-- ========================= -->
      <!-- КНОПКИ -->
      <!-- ========================= -->
      <div class="buttons">

        <button @click="open">
          Открыть
        </button>

        <button @click="remove">
          Удалить
        </button>

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
  border: 1px solid #eee;
 
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.cover {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.type {
  font-size: 12px;
  opacity: 0.6;
}

.buttons {
  display: flex;
  gap: 8px;
  margin-top: auto;
}
</style>