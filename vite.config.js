import { createVuePlugin } from 'vite-plugin-vue2'
import { visualizer } from "rollup-plugin-visualizer";

module.exports = {
  root: './',
  base: './',
  plugins: [createVuePlugin(), visualizer()],
}
