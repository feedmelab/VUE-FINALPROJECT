import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";

import router from "./router/index";
import "./index.css";

const store = createPinia();
createApp(App).use(router).use(store).mount("#app");
