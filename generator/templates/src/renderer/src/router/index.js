import { createRouter, createWebHistory } from "vue-router";
import AgGrid from "../components/AgGrid.vue";
import HomeComponent from "../components/HomeComponent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use BASE_URL for routing
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeComponent,
    },
    {
      path: "/ag-grid",
      name: "AG-Grid",
      component: AgGrid,
    },
  ],
});

export default router;