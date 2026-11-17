/* icons.js — small hand-drawn illustrations for the sidebar.
   Same language as the rest of the artwork: thick dark outline, flat pastel fill. */
const I='#2B2B2B';
const wrap = inner => `<svg viewBox="0 0 44 44" class="cat-ill" xmlns="http://www.w3.org/2000/svg">
  <g stroke="${I}" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round" fill="none">${inner}</g></svg>`;

export const ICONS = {
  /* a rolled map */
  overview: wrap(`
    <path d="M7 12 h30 v22 h-30 Z" fill="#EFE3C6"/>
    <path d="M7 12 q4 -3 8 0 t8 0 t8 0 t6 0" fill="#EFE3C6"/>
    <path d="M12 20 q6 -4 11 1 t9 -1" stroke="#5C93A8"/>
    <path d="M14 28 h7 M26 27 h6" stroke="#9E8E70"/>
    <circle cx="19" cy="24" r="1.9" fill="var(--accent,#C3272B)" stroke="none"/>
    <circle cx="30" cy="22" r="1.5" fill="#62947A" stroke="none"/>`),

  /* an official in a court cap */
  politics: wrap(`
    <path d="M10 36 q0 -8 12 -8 t12 8" fill="#8FA8C4"/>
    <circle cx="22" cy="18" r="8" fill="#F0D2B4"/>
    <path d="M13 12 h18 v-3 h-18 Z" fill="#3A3A3A"/>
    <path d="M16 9 v-3 M28 9 v-3" />
    <circle cx="19" cy="18" r="1.3" fill="${I}" stroke="none"/>
    <circle cx="25" cy="18" r="1.3" fill="${I}" stroke="none"/>
    <path d="M19.5 22 q2.5 1.8 5 0"/>`),

  /* a hanging lantern */
  culture: wrap(`
    <path d="M22 6 v4"/>
    <ellipse cx="22" cy="21" rx="11" ry="11" fill="#C3272B"/>
    <path d="M13 14 h18 M13 28 h18" stroke="rgba(0,0,0,.25)"/>
    <path d="M15 10 h14 v3 h-14 Z" fill="#E5B95F"/>
    <path d="M15 29 h14 v3 h-14 Z" fill="#E5B95F"/>
    <path d="M22 32 v5 M19 37 l3 3 l3 -3" fill="#E5B95F"/>`),

  /* a pagoda */
  building: wrap(`
    <path d="M22 5 l12 6 h-24 Z" fill="#C0604C"/>
    <path d="M13 11 h18 v5 h-18 Z" fill="#E8DCC2"/>
    <path d="M22 14 l15 6 h-30 Z" fill="#C0604C"/>
    <path d="M11 20 h22 v6 h-22 Z" fill="#E8DCC2"/>
    <path d="M22 24 l17 7 h-34 Z" fill="#C0604C"/>
    <path d="M9 31 h26 v7 h-26 Z" fill="#E8DCC2"/>
    <path d="M20 33 h4 v5 h-4 Z" fill="#7E5236"/>`),

  /* strung cash coins */
  economy: wrap(`
    <circle cx="16" cy="17" r="9" fill="#E5B95F"/>
    <path d="M13 14 h6 v6 h-6 Z" fill="#EFE3C6"/>
    <circle cx="27" cy="26" r="9" fill="#C9A227"/>
    <path d="M24 23 h6 v6 h-6 Z" fill="#EFE3C6"/>
    <path d="M9 33 q10 5 26 2" stroke="#8A7250"/>`),

  /* a carved printing block, mid-impression */
  innov: wrap(`
    <path d="M8 24 h22 v10 h-22 Z" fill="#B07A52"/>
    <path d="M11 20 h16 v4 h-16 Z" fill="#8A5E3C"/>
    <path d="M13 31 h5 M21 31 h5" stroke="#EFE3C6"/>
    <path d="M33 8 l2.5 5.5 L41 16 l-5.5 2.5 L33 24 l-2.5 -5.5 L25 16 l5.5 -2.5 Z"
      fill="var(--accent,#E5B95F)"/>`),

  /* a figure in profile, like a portrait plate */
  figures: wrap(`
    <circle cx="22" cy="22" r="16" fill="#EFE3C6"/>
    <circle cx="22" cy="18" r="6.5" fill="#F0D2B4"/>
    <path d="M15.5 13 q6.5 -5 13 0 q-2 -2 -6.5 -2.5 q-4.5 .5 -6.5 2.5 Z" fill="#3A3027"/>
    <path d="M12 34 q0 -8 10 -8 t10 8" fill="#8FB89C"/>
    <circle cx="19.6" cy="18" r="1.2" fill="${I}" stroke="none"/>
    <circle cx="24.4" cy="18" r="1.2" fill="${I}" stroke="none"/>`),

  /* a lens held over a brick — the Builder's Lens */
  lens: wrap(`
    <path d="M6 30 h16 v8 h-16 Z" fill="#C98E72"/>
    <path d="M14 30 v8" stroke="rgba(0,0,0,.25)"/>
    <circle cx="26" cy="17" r="11" fill="rgba(255,255,255,.6)" stroke-width="2.6"/>
    <path d="M18.5 25.5 l-7 7" stroke-width="3.4"/>
    <path d="M21 14 q5 -4 10 0" stroke="rgba(255,255,255,.9)"/>`)
};
export const iconFor = id => ICONS[id] || ICONS.overview;
