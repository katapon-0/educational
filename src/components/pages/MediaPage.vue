<script setup>
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMedia } from "../../composables/useMedia"

const route = useRoute()
const router = useRouter()

const { getMediaById, updateMedia, deleteMedia } = useMedia()

// =========================
// ДАННЫЕ
// =========================

const item = computed(() =>
    getMediaById(Number(route.params.id))
)

// =========================
// РЕЖИМ РЕДАКТИРОВАНИЯ
// =========================

const isEditing = ref(false)

// форма — только то, что реально редактируем
const form = ref({
    title: "",
    type: "",
    progress: 0,
    totalEpisodes: 0,
    episodeDuration: 0
})

// =========================
// СИНХРОНИЗАЦИЯ ФОРМЫ
// =========================

watch(item, (val) => {
    if (!val) return

    form.value = {
        title: val.title,
        type: val.type,
        progress: val.progress,
        totalEpisodes: val.totalEpisodes,
        episodeDuration: val.episodeDuration
    }
}, { immediate: true })

// =========================
// UI ACTIONS
// =========================

function startEdit() {
    isEditing.value = true
}

function cancelEdit() {
    isEditing.value = false
}

// =========================
// СОХРАНЕНИЕ (ВАЖНО: не ломаем объект)
// =========================

function save() {
    if (!item.value) return

    updateMedia(item.value.id, {
        title: form.value.title,
        type: form.value.type,
        progress: form.value.progress,
        totalEpisodes: form.value.totalEpisodes,
        episodeDuration: form.value.episodeDuration
    })

    isEditing.value = false
}

// =========================
// ПРОГРЕСС
// =========================

function increaseProgress() {
    if (!item.value) return

    updateMedia(item.value.id, {
        progress: (item.value.progress || 0) + 1
    })
}

// =========================
// УДАЛЕНИЕ
// =========================

function remove() {
    if (!item.value) return

    deleteMedia(item.value.id)
    router.push("/")
}

// =========================
// BACK
// =========================

function goBack() {
    router.back()
}
</script>

<template>
    <div v-if="item" class="page">

        <!-- НАВИГАЦИЯ -->
        <button @click="goBack">← назад</button>

        <!-- ========================= -->
        <!-- VIEW MODE -->
        <!-- ========================= -->
        <div v-if="!isEditing">

            <h1>{{ item.title }}</h1>

            <p>Тип: {{ item.type }}</p>

            <p v-if="item.type === 'series'">
                {{ item.progress }} / {{ item.totalEpisodes }}
            </p>

            <p v-else>
                {{ item.episodeDuration }} мин
            </p>

            <div class="buttons">
                <button @click="increaseProgress">+ прогресс</button>
                <button @click="startEdit">редактировать</button>
                <button @click="remove">удалить</button>
            </div>

        </div>

        <!-- ========================= -->
        <!-- EDIT MODE -->
        <!-- ========================= -->
        <div v-else>

            <h2>Редактирование</h2>

            <input v-model="form.title" placeholder="Название" />

            <select v-model="form.type">
                <option value="series">Сериал</option>
                <option value="film">Фильм</option>
            </select>

            <div v-if="form.type === 'series'">
                <input v-model="form.progress" type="number" placeholder="Прогресс" />
                <input v-model="form.totalEpisodes" type="number" placeholder="Эпизоды" />
            </div>

            <div v-else>
                <input v-model="form.episodeDuration" type="number" placeholder="Длительность" />
            </div>

            <div class="buttons">
                <button @click="save">сохранить</button>
                <button @click="cancelEdit">отмена</button>
            </div>

        </div>

    </div>

    <div v-else>
        <p>Медиа не найдено</p>
    </div>
</template>

<style scoped>
.page {
    max-width: 720px;
    margin: 40px auto;
    padding: 0 16px;

    display: flex;
    flex-direction: column;
    gap: 20px;

    font-family: Arial;
}


.page>button {
    align-self: flex-start;
    cursor: pointer;
}

.page h1,
.page h2 {
    margin: 0;
}


.page p {
    margin: 4px 0;
}


.buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    margin-top: 12px;
}


.page input,
.page select {
    width: 100%;
    padding: 8px;
    margin: 6px 0;

    border: 1px solid #ddd;
    border-radius: 6px;
}


.page .edit-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}


.page>div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}


.page {
    min-height: 60vh;
}
</style>