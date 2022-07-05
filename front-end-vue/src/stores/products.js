import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('products', () => {
    const products = ref([]);

    const reset = (p = []) => { products.value = [...p]; }

    const insert = (p) => { products.value.push(p); }

    const remove = (id) => {
        tmp = products.filter(({ id: pid }) => pid != id);
        products.value = [...tmp];
    }

    return { state: products, reset, insert, remove }
})