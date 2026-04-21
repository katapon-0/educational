import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";

const routes = [
  { path: "/", name: "home", component: HomePage },

];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});


// защита админ-панели (оставлю мб пригодится)
// router.beforeEach((to) => {
//   if (to.meta.requiresAdmin && !store.isAdmin()) {
//     return { name: "home" }; 
//   }
//   return true; 
// });