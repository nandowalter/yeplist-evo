module.exports = {
  content: [
    './src/app/**/*.{html,ts}',
  ],
  plugins: [
    require('daisyui'),
  ],
  theme: {
    extend: {
      scale: {
        '175': '1.75',
      }
    }
  },
  daisyui: {
    themes: [{
      lightOne: {
        "primary": "#673BB7",
        "primary-content": "#ffffff",
        secondary: "#FEF08A",
        "secondary-content": "#ffffff",
        accent: "#37cdbe",
        "accent-content": "#ffffff",
        neutral: "#3d4451",
        "neutral-content": "#ffffff",
        "base-100": "#ffffff",
        "base-200": "#f9fafb",
        "base-300": "#d1d5db",
        "base-content": "#1f2937"
      },
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
