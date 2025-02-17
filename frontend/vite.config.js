import { defineConfig } from 'vite'
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: '',
    plugins: [reactRouter(), tailwindcss()],
    server: {    
        open: true,
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
})