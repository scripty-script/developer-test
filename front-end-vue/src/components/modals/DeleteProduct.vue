<script setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { ref } from "vue";
import { useProductStore } from '@/stores/products'

const products = useProductStore();
const emit = defineEmits(['close', 'submit']);
const props = defineProps(['show', 'pid']);

const alert = ref({ message: undefined, type: undefined });


const handleSubmit = async (e) => {
    e.preventDefault();

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

        const res = await fetch(`${process.env.API_HOST || ''}/api/products/${props.pid}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) },
        });

        if (res.ok) {
            products.remove(props.pid);
            emit('close', true);
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
                                    <template v-if="alert.message !== undefined">
                                        <p
                                            class='display mt-2 px-4 py-3 bg-red-100 rounded-md text-sm font-semibold text-red-700 text-justify mb-2'>
                                            {{ alert.message }}
                                        </p>
                                    </template>
                                    <div class="sm:flex sm:items-start">
                                        <div
                                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg"
                                                fill="none" view-box="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                                Delete Product
                                            </DialogTitle>

                                            <div class="mt-2">
                                                <p class="text-sm text-gray-500">
                                                    Are you sure you want to delete this product? This action cannot be
                                                    undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="bg-gray-50 px-4 py-3 rounded-b-lg sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        class="btn-danger w-full inline-flex justify-center sm:ml-3 sm:w-auto">Submit</button>
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