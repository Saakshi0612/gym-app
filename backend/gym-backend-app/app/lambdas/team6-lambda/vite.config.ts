import { defineConfig } from 'vite';
import path from 'path';
 
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['cjs'],
            fileName: () => 'index.js'
        },
        rollupOptions: {
            external: [
                'aws-lambda',
                'mongoose',
                '@aws-sdk/client-cognito-identity-provider',
                '@aws-sdk/client-lambda',
                /^@aws-sdk\/.*/  // Exclude all AWS SDK packages
            ],
            output: {
                preserveModules: false
            }
        },
        sourcemap: true,
        outDir: 'dist',
        emptyOutDir: true,
        minify: false,
        target: 'esnext'
    },
    resolve: {
    }
});