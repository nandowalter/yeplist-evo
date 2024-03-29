module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  plugins: [
    require('daisyui')
  ],
  theme: {
    extend: {
      scale: {
        '175': '1.75',
      },
      boxShadow: {
        'topxl': '0 -5px 5px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
      }
    }
  },
  daisyui: {
    themes: [{
      lightOne: {
        "primary": "#673BB7",
        // "primary-content": "#ffffff",
        secondary: "#FEF08A",
        /*"secondary-content": "#ffffff",
        accent: "#37cdbe",
        "accent-content": "#ffffff",
        neutral: "#3d4451",
        "neutral-content": "#ffffff",
        "base-100": "#ffffff",
        "base-200": "#f9fafb",
        "base-300": "#d1d5db",
        "base-content": "#1f2937"*/
      },
      light: {
        ...require("daisyui/src/colors/themes")["[data-theme=light]"],
        primary: "#673BB7"
      }
    }, "dark"]
  }
}
