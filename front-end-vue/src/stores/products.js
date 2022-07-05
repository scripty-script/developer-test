import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('products', () => {
    const products = ref([]);

    const reset = (p = []) => { products.value = [...p]; }

    const insert = (p) => { products.value.push(p); }

    const update = (p) => {
        for (let i = 0; i < products.value.length; i++) {
            if (products.value[i].id == p.id) {
                products.value[i] = p
                break;
            }
        }
    }

    const remove = (id) => {
        const tmp = products.value.filter(({ id: pid }) => pid != id);
        products.value = [...tmp];
    }

    return { state: products, reset, insert, update, remove }
})