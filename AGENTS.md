# AGENTS.md — AI Architecture & Coding Guidelines
> **Target Audience:** Autonomous AI coding agents (Antigravity, Gemini Code Assist, Claude Code, GitHub Copilot, Codex, Cursor).  
> **Purpose:** Provide an instant, token-efficient mental model of the codebase to read, navigate, modify, and extend features without regressions.

---

## 1. Project Overview
- **App Name:** `embro-app` (Embro Optimizer)
- **Domain:** Industrial multi-head computerized embroidery management: needle sequence optimization, trial thread approval (ACC), machine scheduling (SPK), warehouse inventory, and Wilcom floppy database.
- **Architecture:** **Modular Single File Components (SFC)** powered by Vite + Vue 3 + Pinia + Tailwind CSS.

---

## 2. Tech Stack
- **Build Tool:** Vite 5 (instant sub-second HMR)
- **Framework:** Vue 3.4+ (`<script setup>` Composition API)
- **State Management:** Pinia 2.2+ (isolated modular stores per domain)
- **Styling:** Tailwind CSS 3.4+ + PostCSS (utility-first, purged CSS)
- **Cloud & Sync:** Firebase Modular SDK v10 (Realtime Database & Storage)

---

## 3. Directory Map & File Responsibilities

When tasked with a feature or bugfix, **navigate directly to the designated file below**:

```
embro-app/
├── AGENTS.md                   # This AI guidance document
├── index.html                  # Minimal HTML entry point (< 25 lines)
├── index.monolith.html         # Legacy monolithic backup (READ-ONLY REFERENCE)
├── package.json                # Dependencies and npm scripts
├── vite.config.js              # Bundler config & '@/' alias to 'src/'
├── tailwind.config.js          # Custom theme, font families, and zinc color palette
├── postcss.config.js           # PostCSS Tailwind and Autoprefixer config
│
└── src/
    ├── main.js                 # App bootstrapping (Vue + Pinia + CSS)
    ├── App.vue                 # App shell layout (Header, Tab Switcher, Toast)
    │
    ├── assets/
    │   └── main.css            # Tailwind directives and custom dark scrollbars
    │
    ├── utils/                  # PURE LOGIC (Zero DOM, Side-Effect Free, Unit Testable)
    │   ├── needleSolver.js     # Needle allocation engine & stage sequence optimizer
    │   ├── colorPalette.js     # Thread catalog (Star Elephant Rayon), hex map, text contrast
    │   └── imageCompressor.js  # Client-side Canvas compressor (WebP, max 1280px)
    │
    ├── services/               # EXTERNAL INTEGRATIONS
    │   └── firebase.js         # Firebase modular Realtime Database & Auth initialization
    │
    ├── stores/                 # REACTIVE STATE (PINIA STORES)
    │   ├── useTrialStore.js    # Active CMTs, needle capacity, stages, option ACC states
    │   ├── useInventoryStore.js# Warehouse thread inventory, [-]/[+] adjusters, filters
    │   ├── useFloppyStore.js   # Wilcom master database, stitch/meter formulas, screenshots
    │   └── useToastStore.js    # Reactive floating toast alerts
    │
    ├── components/             # REUSABLE UI COMPONENTS
    │   ├── common/
    │   │   ├── AppNavigation.vue  # Main module tab switcher
    │   │   └── ToastContainer.vue # Global toast message renderer
    │   └── trial/
    │       └── ComboBadge.vue     # Connected option badge [J3|1171||J2|1070] with [✓] indicator
    │
    └── views/                  # TOP-LEVEL MODULE VIEWS
        ├── TrialView.vue       # Module 1: Trial Benang & Machine Operator Card Stages
        ├── ScheduleView.vue    # Module 2: Jadwal Mesin & Production SPK Checklist
        ├── InventoryView.vue   # Module 3: Thread Warehouse Stock & Location Rack
        └── FloppyView.vue      # Module 4: Wilcom Design Floppy Master & WebP Uploads
```

---

## 4. Key Domain Rules & Non-Negotiables

### A. Independent ACC State per Option (Strict Isolation)
- **Source of Truth:** `src/stores/useTrialStore.js` (`accMap`) and `src/components/trial/ComboBadge.vue`.
- **Rule:** For multi-color combination films, approvals are stored strictly per option: `accMap[key]['opt_' + optIdx] = true`.
- **Constraint:** Approving Option 1 (`opt_0`) **MUST NEVER** highlight or alter the needle state of Option 2 (`opt_1`), even if both options share identical thread codes (e.g., thread `1070`).
- **UI Spec:** Do NOT display redundant text like `"OPSI 1"`. Directly display the connected badge (`[ J3 | 🔵 1171 || J2 | 🔵 1070 ]`) with an emerald green `[✓]` checkmark badge on approval.

### B. Machine Needle Allocation Algorithm
- **Source of Truth:** `src/utils/needleSolver.js` -> `calculateMachineStages()`.
- **Rule:** Calculates global thread frequency, maps highest-frequency threads to fixed needles (J1–J11 excluding swap needle), and routes dynamic threads through the primary swap needle (default needle 4 or rack end).
- **Constraint:** Pure mathematical function. Never import Vue reactivity or DOM elements into this file.

### C. Image Compression (Firebase Storage Economy)
- **Source of Truth:** `src/utils/imageCompressor.js` -> `compressImageBase64()`.
- **Rule:** Wilcom screenshots must be compressed to **WebP format** (max dimension: 1280px, quality: 0.80–0.82) before storing to localStorage or Firebase to conserve storage quotas.

---

## 5. Strict AI Rules of Engagement

1. **Maintain Modular Structure:** Never collapse code back into a single monolithic file. Keep individual files small and focused (< 250 lines).
2. **Component Syntax:** Always use Vue 3 `<script setup>` syntax with Composition API.
3. **No Math in Templates:** Place all scheduling and needle calculations in `src/utils/needleSolver.js` or Pinia computed getters.
4. **Preserve Storage Keys:** Maintain exact localStorage key names for backward compatibility:
   - `needle_cap`
   - `needle_swap`
   - `cmts`
   - `embro_acc_map`
   - `completed_cmts`
   - `embro_inventory_list`
   - `embro_floppy_list`
5. **Always Verify Builds:** Always run `npm run build` after making changes to verify zero syntax, lint, or bundler errors.

---

## 6. Common Commands
```powershell
# Start local development server (HMR enabled at http://localhost:5173)
npm run dev

# Compile and bundle for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```
