<script setup>
import { ref } from 'vue'

const alert = ref({
    message: undefined
})

const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const xsrf = await (async () => {
            const res = await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                credentials: 'include'
            });
            if (res.ok) {
                return document.cookie
                    .split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1];
            }
        })();

        const res = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) },
            body : new FormData(e.target)
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
                        <input type="email" name="email" id="email" class="w-full" />
                    </div>
                    <div class="mt-4">
                        <label for="password" class="block text-sm">Password</label>
                        <input type="password" name="password" id="password" class="w-full" />
                    </div>
                    <button class="btn-fill mt-6">Login</button>
                </div>
            </form>
        </section>
    </main>
</template>