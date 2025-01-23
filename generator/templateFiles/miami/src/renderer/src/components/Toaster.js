import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const ShowToaster = (message, type="error") => {
    toast[type](message);
}