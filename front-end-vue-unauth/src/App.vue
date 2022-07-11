<script setup>
import { ref } from 'vue'

const alert = ref({
    message: undefined
})

const onPending = ref(false);

const submitHandler = async (e) => {
    e.preventDefault();
    onPending.value = true;
    try {
        const xsrf = await (async () => {
            const res = await fetch(`${import.meta.env.VITE_API_HOST || ''}/sanctum/csrf-cookie`, {
                credentials: 'include'
            });
            if (res.ok) {
                return document.cookie
                    .split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1];
            }
        })();

        const res = await fetch(`${import.meta.env.VITE_API_HOST || ''}/api/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) },
            body: new FormData(e.target)
        });

        if (res.ok) {
            window.location.assign('/');
        } else if (res.status === 400) {
            const data = await res.json();
            alert.value.message = data.message;
        } else {
            alert.value.message = `Something went wrong! ${res.status}`;
        }
    } catch (error) {
        alert.value.message = "Something went wrong!";
        console.log('Something went wrong!', error);
    } finally {
        onPending.value = false;
    }
}

</script>

<template>
    <main>
        <section>
            <div class="mt-20"></div>
            <img src="./assets/logo.svg" alt="logo" class="h-20 w-20 mx-auto">
            <form @submit="submitHandler">
                <div class="mt-5 max-w-sm w-full mx-auto flex flex-col border rounded-lg shadow-md p-6 bg-white">
                    <header class="text-3xl text-center sr-only">Log in</header>
                    <p v-if="alert.message"
                        class="display mt-2 px-4 py-3 bg-red-100 rounded-md text-sm font-semibold text-red-700 text-justify mb-2">
                        {{ alert.message }}
                    </p>
                    <div>
                        <label for="email" class="block text-sm">Email</label>
                        <input type="email" name="email" id="email" class="w-full" required/>
                    </div>
                    <div class="mt-4">
                        <label for="password" class="block text-sm">Password</label>
                        <input type="password" name="password" id="password" class="w-full" required />
                    </div>

                    <!-- button goes here -->
                    <button v-if="onPending"
                        class="btn-fill mt-6 flex justify-center items-center w-full cursor-not-allowed disabled:opacity-75"
                        type="button" disabled>
                        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>  
                        Verifying
                    </button>
                    <button v-else class="btn-fill mt-6">Login</button>
                    <!-- button ends here -->
                </div>
            </form>
        </section>
    </main>
</template>