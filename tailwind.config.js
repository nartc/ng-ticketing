module.exports = {
  // a hack to get intellisense
  mode: process.env.TAILWIND_MODE ? 'jit' : 'aot',
  purge: ['./src/**/*.{html,scss,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
