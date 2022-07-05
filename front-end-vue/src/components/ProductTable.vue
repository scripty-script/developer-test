<script setup>
const { products } = defineProps({
    products: Array
})

const emit = defineEmits(['onDelete', 'onUpdate']);
</script>

<template>
    <div class="overflow-auto shadow-sm rounded-md border">
        <table class="border-collapse w-full">
            <thead>
                <tr class="text-left bg-slate-100">
                    <th class="p-2 pl-4 font-medium">No.</th>
                    <th class="p-2 font-medium">Name</th>
                    <th class="p-2 font-medium">Description</th>
                    <th class="p-2 font-medium">Price</th>
                    <th class="p-2 font-medium">QTY</th>
                    <th class="p-2 font-medium">Category</th>
                    <th class="p-2 pr-4 font-medium">&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="({ id, name, description, price, qty, category }, i) in products">
                    <tr>
                        <td class="p-2 pl-4">{{ id }}</td>
                        <td class="p-2">{{ name }}</td>
                        <td class="p-2">{{ description }}</td>
                        <td class="p-2">{{ price }}</td>
                        <td class="p-2">{{ qty }}</td>
                        <td class="p-2">{{ category.name }}</td>
                        <td class="p-2 pr-4 space-x-4">
                            <button class="text-sky-700 font-medium text-sm" tabindex="-1"
                                @click="emit('onUpdate', products[i])">Edit</button>
                            <button class="text-red-700 font-medium text-sm" tabindex="-1"
                                @click="emit('onDelete', id)">Delete</button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>