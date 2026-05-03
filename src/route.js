import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { useUsers } from "./composables/useUsers"
import HomePage from "./components/pages/HomePage.vue"
import LoginPage from "./components/auth/LoginPage.vue"
import RegisterForm from "./components/auth/RegisterForm.vue"
import MediaPage from "./components/pages/MediaPage.vue"


// =========================
// РОУТЫ
// =========================

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },

  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { guestOnly: true }
  },

  {
    path: "/register",
    name: "register",
    component: RegisterForm,
    meta: { guestOnly: true }
  },

  {
    path: "/media/:id",
    name: "media",
    component: MediaPage,
    meta: { requiresAuth: true }
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
]






// чтобы каждый раз не переключать createwebhistory (для просмотра на локалхост) на createwebhashhistory (для использования на gh-pages)
// проверка, находится ли сайт на github.io
const isGithubPages =
  import.meta.env.PROD //даёт true при выполнении npm run build
  && location.hostname.includes("github.io");  //если сайт на gh-pages

export const router = createRouter({
  history: isGithubPages ? createWebHashHistory() : createWebHistory(), //если сайт на github.io -> web hash history. иначе обычный web history
  routes
});


// --- ПРОВЕРКА АВТОРИЗАЦИИ ---
router.beforeEach((to, from, next) => {
  const { currentUser } = useUsers()

  const user = currentUser.value

  // ЕСЛИ СТРАНИЦА ТРЕБУЕТ АВТОРИЗАЦИИ И ПОЛЬЗОВАТЕЛЬ НЕ ВОШЁЛ
  if (to.meta.requiresAuth && !user) {
    next({ name: "login" }) // ЕСЛИ НЕ АВТОРИЗОВАН -> ЛОГИН
    return
  }

  // ЕСЛИ СТРАНИЦА ТОЛЬКО ДЛЯ ГОСТЕЙ, А ПОЛЬЗОВАТЕЛЬ УЖЕ ВОШЁЛ
  if (to.meta.guestOnly && user) {
    next({ name: "home" }) // ЕСЛИ УЖЕ АВТОРИЗОВАН -> HOME
    return
  }
  next()
})

// export const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// import { createRouter, createWebHashHistory } from "vue-router";

// export const router = createRouter({
//   history: createWebHashHistory(),
//   routes
// });


// защита админ-панели (оставлю мб пригодится)
// router.beforeEach((to) => {
//   if (to.meta.requiresAdmin && !store.isAdmin()) {
//     return { name: "home" };
//   }
//   return true;
// });