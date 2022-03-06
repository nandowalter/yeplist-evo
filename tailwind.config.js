module.exports = {
  content: [
    './src/app/**/*.{html,ts}',
  ],
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [{
      lightOne: {
        ...require("daisyui/src/colors/themes")["[data-theme=light]"],
        "primary": "#673BB7", 
        "secondary": "#FEF08A"
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
