<script setup>
import { computed, ref } from "vue"
import MediaCard from "./MediaCard.vue"
import { useMedia } from "../../composables/useMedia"

const { media, deleteMedia } = useMedia()

// =========================
// ФИЛЬТР
// =========================
const filter = ref("all")

const filteredMedia = computed(() => {
  if (filter.value === "all") return media.value
  return media.value.filter(m => m.type === filter.value)
})
</script>

<template>
  <div class="list">

    <!-- ========================= -->
    <!-- ФИЛЬТРЫ -->
    <!-- ========================= -->
    <div class="filters">

      <button @click="filter = 'all'">Все</button>
      <button @click="filter = 'series'">Сериалы</button>
      <button @click="filter = 'film'">Фильмы</button>

    </div>

    <!-- ========================= -->
    <!-- СПИСОК -->
    <!-- ========================= -->
    <div class="grid">

      <MediaCard
        v-for="item in filteredMedia"
        :key="item.id"
        :item="item"
        @delete="deleteMedia"
      />

    </div>

  </div>
</template>

<style scoped>
.list {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.grid {
  display: grid;
  gap: 12px;
}
</style>