module.exports = {
  content: [
    './src/app/**/*.{html,ts}',
  ],
  plugins: [
    require('daisyui'),
  ]

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
