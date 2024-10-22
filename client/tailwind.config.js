// tailwind.config.js
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* higher number is darker */
        'cream-700': "#856651"/* paragraphs, titles, hero subtitle and form field label */,
        'cream-500': "#B6A091"/* secondary button border and text */,
        'cream-300': "#F0EBE4"/* main background and button text */,
        'cream-200': "#F9F5EF"/* lighter background */,
        'cream-100': "#fcfaf7"/* form field */,
        'nougat-800': "#642E1F",
        'nougat-700': "#77461F"/* hero title and nav icons */,
        'nougat-600': "#8A4D27",
        'nougat-500': "#925023"/* primary button */,
        'rose-400': "#BE7F6E",
        'gold-200': "#FFE09C"/* yellow chip */,
        'gold-300': "#FDC13C"/* music visualizer */,
        'gold-800': "#886321",
        'gold-900': "#7E5734",
        'blush-700': "#C74659",
        'blush-500': "#F63C58"/* notification */,
        'blush-300': "#FCA7B3"/* red chip */,
        'skyblue-500': "#B8CCCA",
        'skyblue-300': "#DAE7E5"/* blue chip */,
      },
      borderRadius: {
        '4xl': '4rem',
      },
      borderWidth: {
        '3': '2px',
      },
      margin: {
        '0.75': '2.4px;',
        '0.2': '0.8px'
      }
    },
  },
  plugins: [
    typography,
    forms,
    aspectRatio,
  ],
}
