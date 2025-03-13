import { defineConfig, loadEnv  } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default ({ mode } : { mode: string }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    build: {
      outDir: './public/build/',
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(env.TRAEFIK_PORT ?? '80'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      tailwindcss(),
      vue({
        template: {
          transformAssetUrls: {
            base: null,
            includeAbsolute: false,
          },
        },
      }),
    ],
  })
}
