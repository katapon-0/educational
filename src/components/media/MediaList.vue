<script setup>
import { computed, ref } from "vue";
import MediaCard from "./MediaCard.vue";
import { useMedia } from "../../composables/useMedia";

import iconCalendar from "../../assets/icons/icon-calendar.png";
import iconWarning from "../../assets/icons/icon-warning.png";

// ПРИНИМАЕМ СПИСОК ОТ РОДИТЕЛЯ
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["delete"]);

const {
  filterByType,
  filterByStatus,
  sortByDate,
  getOverdue,
  statuses,
  statusLabels,
} = useMedia();

const typeFilter = ref("all");
const statusFilter = ref("all");
const sortType = ref("date-asc");

// кастомный селект сортировки
const showSortDropdown = ref(false);
const sortSelectRef = ref(null);
function toggleSortDropdown() {
  showSortDropdown.value = !showSortDropdown.value;
}
function selectSort(value) {
  sortType.value = value;
  showSortDropdown.value = false;
}

// сброс всех фильтров и сортировки к значениям по умолчанию
function resetFilters() {
  typeFilter.value = "all";
  statusFilter.value = "all";
  sortType.value = "date-asc";
}

const filteredMedia = computed(() => {
  let list = props.items;
  list = filterByType(list, typeFilter.value);
  list = filterByStatus(list, statusFilter.value);

  if (sortType.value === "date-asc") list = sortByDate(list, "asc");
  else if (sortType.value === "date-desc") list = sortByDate(list, "desc");
  else if (sortType.value === "overdue") list = getOverdue(list);

  list = [...list].sort((a, b) => {
    const aAbandoned = a.status === "abandoned";
    const bAbandoned = b.status === "abandoned";

    if (aAbandoned && !bAbandoned) return 1;
    if (!aAbandoned && bAbandoned) return -1;
    return 0;
  });

  return list;
});
</script>

<template>
  <div class="list">
    <div class="filters">
      <button
        @click="typeFilter = 'all'"
        :class="['type-btn', { active: typeFilter === 'all' }]"
      >
        Все
      </button>
      <button
        @click="typeFilter = 'series'"
        :class="['type-btn', { active: typeFilter === 'series' }]"
      >
        Сериалы
      </button>
      <button
        @click="typeFilter = 'film'"
        :class="['type-btn', { active: typeFilter === 'film' }]"
      >
        Фильмы
      </button>

      <span class="separator"></span>

      <button
        @click="statusFilter = 'all'"
        :class="{ active: statusFilter === 'all' }"
      >
        Все
      </button>
      <button
        v-for="st in statuses"
        :key="st"
        @click="statusFilter = st"
        :class="{ active: statusFilter === st }"
      >
        {{ statusLabels[st] }}
      </button>

      <span class="separator"></span>

      <!-- кастомный селект сортировки -->
      <div
        class="custom-select"
        @click="toggleSortDropdown"
        ref="sortSelectRef"
      >
        <div class="custom-select__trigger">
          <span>
            <img
              :src="sortType === 'overdue' ? iconWarning : iconCalendar"
              class="sort-icon"
              alt="sort"
            />
            {{
              sortType === "date-asc"
                ? "Ближайшие"
                : sortType === "date-desc"
                  ? "Поздние"
                  : "Просроченные"
            }}
          </span>
          <span class="custom-select__arrow">▼</span>
        </div>
        <div v-if="showSortDropdown" class="custom-select__options">
          <div class="custom-select__option" @click="selectSort('date-asc')">
            <img :src="iconCalendar" class="sort-icon" alt="calendar" />
            Ближайшие
          </div>
          <div class="custom-select__option" @click="selectSort('date-desc')">
            <img :src="iconCalendar" class="sort-icon" alt="calendar" /> Поздние
          </div>
          <div class="custom-select__option" @click="selectSort('overdue')">
            <img :src="iconWarning" class="sort-icon" alt="warning" />
            Просроченные
          </div>
        </div>
      </div>
      <div class="bottom-actions">
        <button class="reset-btn-bottom" @click="resetFilters">
          Сбросить
        </button>
      </div>
    </div>

    <slot name="stats" />

    <div class="grid">
      <MediaCard
        v-for="item in filteredMedia"
        :key="item.id"
        :item="item"
        @delete="emit('delete', item.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;

  background: #fefefe;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.filters button {
  font-family: var(--font-text);
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;

  background: transparent;
  color: #1a172c;

  cursor: pointer;
  transition: all 0.2s ease;
}

.filters button:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

.filters button.active {
  background: #fdb688;
  color: #1a172c;
  border-color: #fdb688;
}

.filters .type-btn {
  background: #fefefe;
  border: 1px solid #e8e8e8;
}

.filters .type-btn:hover {
  background: #2d2a44;
  border-color: #2d2a44;
  color: #fefefe;
}

.filters .type-btn.active {
  background: #1a172c;
  color: #fefefe;
  border: 1px solid #1a172c;
}

.separator {
  width: 1px;
  height: 24px;
  background: #e0e0e0;
  margin: 0 4px;
  align-self: center;
}

.sort-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  vertical-align: middle;
}

.sort-select {
  padding: 6px 12px;

  background: transparent;
  color: #1a172c;

  border: 1px solid #e0e0e0;
  border-radius: 20px;

  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-select:hover {
  border-color: #fdb688;
  background: #fdeabf;
}

.sort-select:focus {
  outline: none;
  border-color: #fdb688;
  background: #fdeabf;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.custom-select {
  position: relative;
  width: 220px;
  background: #fefefe;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: #1a172c;
  transition: border-color 0.2s;
}

.custom-select__trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
}

.custom-select__arrow {
  font-size: 10px;
  color: #999;
}

.custom-select__options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(26, 23, 44, 0.12);
  z-index: 10;
  overflow: hidden;
}

.custom-select__option {
  padding: 10px 14px;
  transition: 0.2s;
}

.custom-select__option:hover {
  background: #fdeabf;
}

.reset-btn {
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: transparent;
  color: #1a172c;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}
.reset-btn:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 10px;
  }

  .filters button {
    width: 100%;
    text-align: center;
    padding: 10px 12px;
    font-size: 14px;
  }

  .separator {
    width: 100%;
    height: 1px;
    margin: 4px 0;
  }

  .custom-select {
    width: 100%;
  }

  .custom-select__trigger {
    padding: 10px 12px;
    font-size: 14px;
  }

  .custom-select__option {
    padding: 12px 14px;
    font-size: 14px;
  }

  .sort-icon {
    width: 18px;
    height: 18px;
  }

  .grid {
    gap: 10px;
  }
}
</style>
