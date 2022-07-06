<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductTable from './components/ProductTable.vue'
import InsertProduct from './components/modals/InsertProduct.vue'
import UpdateProduct from './components/modals/UpdateProduct.vue'
import DeleteProduct from './components/modals/DeleteProduct.vue'

import { useCategoryStore } from '@/stores/category'

import { Switch } from '@headlessui/vue'

const hasNoStack = ref(false)

const modalRef = ref({
    isOpen: false,
    sub: undefined,
    data: null
});

const MODAL_SUB = {
    INSERT: "INSERT",
    UPDATE: "UPDATE",
    DELETE: "DELETE"
}

const openModal = (sub, data = null) => {
    modalRef.value.isOpen = true;
    modalRef.value.sub = sub;
    modalRef.value.data = data;
}

const closeModal = () => {
    modalRef.value.isOpen = false;
    modalRef.value.sub = undefined;
    modalRef.value.data = null;
}

const products = useProductStore();
const categories = useCategoryStore();

const searchHandler = (e) => {
    e.preventDefault();
    loadProducts(e.target.search.value, hasNoStack.value);
}

const loadProducts = async (query = undefined || '', filter = undefined) => {
    try {
        let url = 'http://localhost:8000/api/products';
        const params = new URLSearchParams();
    
        if (query !== undefined && query !== '') {
            params.append('q', query);
        }

        if (filter) {
            params.append('filter', 'no-stock');
        }

        url += '?' + params.toString();

        const res = await fetch(url, {
            credentials: 'include'
        });

        if (res.ok) {
            const data = await res.json();
            products.reset(data);
        }
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}


onMounted(() => {
    loadProducts();
    (async () => {
        try {
            const res = await fetch('http://localhost:8000/api/categories',{
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                categories.reset(data);
            }
        } catch (error) {
            console.log('Something went wrong!', error);
        }
    })();
})
</script>

<template>
    <header>
        <div class="container pt-4">
            <h1 class="text-4xl">Products</h1>
        </div>
    </header>

    <main>
        <section>
            <div class="container py-4 space-y-4">
                <div class="flex justify-between">
                    <form @submit="searchHandler">
                        <input type="search" placeholder="Type here to search" name="search">
                        <div class="mt-2 flex items-center space-x-2">
                            <Switch v-model="hasNoStack" :class="hasNoStack ? 'bg-teal-900' : 'bg-teal-600'"
                                class="relative inline-flex h-6 w-11 items-center rounded-full">
                                <span class="sr-only">Enable notifications</span>
                                <span :class="hasNoStack ? 'translate-x-6' : 'translate-x-1'"
                                    class="inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out" />
                            </Switch>
                            <span class="text-sm">Has No Stack</span>
                        </div>
                    </form>

                    <div class="space-x-2">
                        <button class="btn" @click="() => { loadProducts(undefined, hasNoStack); }">Refresh</button>
                        <button class="btn-fill" @click="() => { openModal(MODAL_SUB.INSERT); }">New</button>
                    </div>
                </div>
                <ProductTable :products="products.state" @onDelete="(e) => { openModal(MODAL_SUB.DELETE, e); }"
                    @onUpdate="(e) => { openModal(MODAL_SUB.UPDATE, e); }" />
            </div>
        </section>
    </main>

    <InsertProduct :show="modalRef.isOpen && modalRef.sub === MODAL_SUB.INSERT" @close="closeModal" />
    <UpdateProduct :show="modalRef.isOpen && modalRef.sub === MODAL_SUB.UPDATE" :product="modalRef.data"
        @close="closeModal" />
    <DeleteProduct :show="modalRef.isOpen && modalRef.sub === MODAL_SUB.DELETE" :pid="modalRef.data"
        @close="closeModal" />
</template>