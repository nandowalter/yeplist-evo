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
        "primary-focus": "#4506cb",
        "primary-content": "#ffffff",
        secondary: "#f000b8",
        "secondary-focus": "#bd0091",
        "secondary-content": "#ffffff",
        accent: "#37cdbe",
        "accent-focus": "#2aa79b",
        "accent-content": "#ffffff",
        neutral: "#3d4451",
        "neutral-focus": "#2a2e37",
        "neutral-content": "#ffffff",
        "base-100": "#ffffff",
        "base-200": "#f9fafb",
        "base-300": "#d1d5db",
        "base-content": "#1f2937",
        info: "#e0f2fe",
        "info-content": "#2563eb",
        success: "#dcfce7",
        "success-content": "#16a34a",
        warning: "#fef3c7",
        "warning-content": "#d97706",
        error: "#fee2e2",
        "error-content": "#dc2626",
        "--border-color": "var(--b3)",
        "--rounded-box": "1rem",
        "--rounded-btn": "0.5rem",
        "--rounded-badge": "1.9rem",
        "--animation-btn": "0.25s",
        "--animation-input": ".2s",
        "--btn-text-case": "uppercase",
        "--btn-focus-scale": "0.95",
        "--navbar-padding": ".5rem",
        "--border-btn": "1px",
        "--tab-border": "1px",
        "--tab-radius": "0.5rem"
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
