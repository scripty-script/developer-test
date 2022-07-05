import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoryStore = defineStore('categories', () => {
    const categories = ref([]);

    const reset = (c = []) => { categories.value = [...c]; }

    return { state: categories, reset }
})