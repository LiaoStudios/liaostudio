/**
 * URL di un file pubblico (in `public/`), corretto sia in sviluppo/Netlify
 * (dove il sito vive alla radice del dominio) sia su GitHub Pages (dove
 * vive sotto `/liaostudio/`). `import.meta.env.BASE_URL` riflette il `base`
 * passato a Vite in build — `/` di default, `/liaostudio/` con
 * `npm run build:pages`.
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
