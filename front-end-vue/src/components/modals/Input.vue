<script setup>

import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, } from '@headlessui/vue'
import { useCategoryStore } from '@/stores/category'

const props = defineProps([
    'name', 'description', 'price', 'qty', 'category'
]);

const name = ref(props.name);
const description = ref(props.description);
const price = ref(props.price);
const qty = ref(props.qty);

const categories = useCategoryStore();
const selected = ref(props.category);
</script>

<template>
    <div class="mt-2 space-y-4">
        <div>
            <label for="name" class="block font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" class="mt-1 block shadow-sm w-full rounded-md capitalize"
                v-model="name" required>
        </div>
        <div>
            <label for="description" class="block font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" class="mt-1 block shadow-sm w-full rounded-md min-h-min h-36"
                v-model="description" required></textarea>
        </div>
        <div class="grid grid-cols-2 gap-5">
            <div>
                <label for="price" class="block font-medium text-gray-700">Price</label>
                <input type="number" name="price" id="price" class="mt-1 block shadow-sm w-full rounded-md capitalize"
                    v-model="price" required>
            </div>
            <div>
                <label for="qty" class="block font-medium text-gray-700">Qty</label>
                <input type="number" name="qty" id="qty" class="mt-1 block shadow-sm w-full rounded-md capitalize"
                    v-model="qty" required />
            </div>
        </div>
        <!-- category starts here -->
        <div>
            <label for="category_id" class="block font-medium text-gray-700">Category</label>
            <input v-if="selected" type="hidden" name="category_id" v-model="selected.id">
            <input v-else type="hidden" name="category_id" value="-1">

            <Listbox v-model="selected">
                <div class="relative mt-1">
                    <ListboxButton
                        class="flex item-center w-full py-2 px-3 text-left bg-white border border-gray-300 shadow-sm rounded-lg cursor-default text-sm focus:outline-none focus:border-sky-500">
                        <span v-if="selected" class="flex-1 capitalize">{{ selected.name }}</span>
                        <span v-else class="flex-1 capitalize italic">No selected category</span>

                        <span className="flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none"
                                view-box="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </span>
                    </ListboxButton>

                    <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                        leave-to-class="opacity-0">
                        <ListboxOptions
                            class="absolute w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 text-sm focus:outline-none">
                            <ListboxOption v-slot="{ active, selected }" v-for="category in categories.state"
                                :key="name" :value="category" as="template">
                                <li :class="[
                                    active ? 'bg-sky-200' : '',
                                    'relative cursor-default select-none py-2 pl-10 pr-4',
                                ]">
                                    <span v-if="selected"
                                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                                            view-box="0 0 24 24" stroke="currentColor" stroke-width="2"
                                            aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span :class="[
                                        selected ? 'font-medium' : 'font-normal',
                                        'block truncate',
                                    ]">{{ category.name }}</span>
                                </li>
                            </ListboxOption>
                        </ListboxOptions>
                    </transition>
                </div>
            </Listbox>
        </div>
        <!-- category ends here -->
    </div>
</template>