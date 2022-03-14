import { createApp } from "vue";
import app from "./app.vue";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(new URL("sw.js", import.meta.url), {type: "module"});
}

createApp(app).mount("#app");
