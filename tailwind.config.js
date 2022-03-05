module.exports = {
  content: [
    './src/app/**/*.{html,ts}',
  ],
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [{
      light: {
        primary: "#673bb7",
        "primary-content": "#ffffff",
    secondary: "#f000b8",
    "secondary-content": "#ffffff",
    accent: "#37cdbe",
    "accent-content": "#ffffff",
    neutral: "#3d4451",
    "neutral-content": "#ffffff",
    "base-100": "#ffffff",
    "base-200": "#f9fafb",
    "base-300": "#d1d5db",
    "base-content": "#1f2937"
      }
    }, "dark"]
  }

  /*
  ,
  purge: {
    content: ['**//*.html'],
    options: {
      safelist: [
        /data-theme$/,
      ]
    },
  }
  */
}
