<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductTable from './components/ProductTable.vue'
import InsertProduct from './components/modals/InsertProduct.vue'
import UpdateProduct from './components/modals/UpdateProduct.vue'
import DeleteProduct from './components/modals/DeleteProduct.vue'

import { useCategoryStore } from '@/stores/category'

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

const loadProducts = async () => {
    try {
        const res = await fetch('http://localhost:8000/api/products');
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
            const res = await fetch('http://localhost:8000/api/categories');
            if (res.ok) {
                const data = await res.json();
                categories.reset(data);
            }
        } catch (error) {
            console.log('Something went wrong!', error);
        }
    })()
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
                    <input type="text" placeholder="Type here to search">
                    <div class="space-x-2">
                        <button class="btn" @click="loadProducts">Refresh</button>
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