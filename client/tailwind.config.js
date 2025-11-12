/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'neon-cyan': '#00ffff',
        'neon-magenta': '#ff00ff',
        'neon-lime': '#00ff00',
        'neon-green': '#00FF7F', // xanh neon cho Available
        'neon-orange': '#FFB347', // cam sáng cho In-Use
        'neon-red': '#FF355E', // đỏ hồng cho Maintenance
        'neon-gold': '#FFD700', // vàng ánh kim cho giá
        'text-gray': '#C5C6C7', // xám sáng cho chữ
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff',
        'neon-magenta': '0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff',
        'neon-lime': '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#00ffff",
          secondary: "#ff00ff",
          accent: "#00ff00",
        },
      },
    ],
  },
}