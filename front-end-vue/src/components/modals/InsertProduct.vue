<script setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { ref } from "vue";
import Input from './Input.vue'
import { useProductStore } from '@/stores/products'
const products = useProductStore();

const emit = defineEmits(['close']);
const props = defineProps(['show']);

const alert = ref({ message: undefined, type: undefined });

const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    try {
        const xsrf = await (async () => {
            const res = await fetch(`${process.env.API_HOST || ''}/sanctum/csrf-cookie`, {
                credentials: 'include'
            });
            if (res.ok) {
                return document.cookie
                    .split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1];
            }
        })();

        const res = await fetch(`${process.env.API_HOST || ''}/api/products`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) },
            body: data
        });

        if (res.status === 201) {
            const data = await res.json();
            products.insert(data.data);
            alert.value.message = data.message;
            alert.value.type = "SUCCESS";
            e.target.reset();
        } else if (res.status === 400) {
            alert.value.message = await res.json();
            alert.value.type = "ERROR";
        } else {
            throw new Error(res.status);
        }
    } catch (error) {
        alert.value.message = `Something went wrong! ${error}`;
        alert.value.type = "ERROR";
    }
}
</script>


<template>
    <TransitionRoot appear :show="props.show" as="template">
        <Dialog as="div" @close="emit('close', true)" class="relative z-10">
            <TransitionChild as="template" enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25"></div>
            </TransitionChild>

            <div class="fixed inset-0 bg-black/20 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-2xl transform text-left align-middle shadow-xl transition-all sm:max-w-md">
                            <form @submit="handleSubmit">
                                <div class="px-4 py-3 rounded-t-lg bg-white">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                        New Product
                                    </DialogTitle>
                                    <span class='text-sm'>Only provide information that is true and correct.</span>
                                    <template v-if="alert.type !== undefined">
                                        <p v-if="alert.type === 'SUCCESS'"
                                            class='display mt-2 px-4 py-3 bg-green-100 rounded-md text-sm font-semibold text-green-700 text-justify'>
                                            {{ alert.message }}
                                        </p>
                                        <p v-else
                                            class='display mt-2 px-4 py-3 bg-red-100 rounded-md text-sm font-semibold text-red-700 text-justify'>
                                            {{ alert.message }}
                                        </p>
                                    </template>
                                    <Input />
                                </div>

                                <div class="bg-gray-50 px-4 py-3 rounded-b-lg sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        class="btn-fill w-full inline-flex justify-center sm:ml-3 sm:w-auto">Submit</button>
                                    <button class="btn mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto"
                                        type="button" @click="emit('close', true)">Cancel</button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>