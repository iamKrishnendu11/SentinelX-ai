# Design System

> Comprehensive architectural and visual design documentation for **SentinelX AI** (`sentinelx-ai`). Grounded strictly in the production codebase, stylesheets, components, and configuration tokens.

---

## 1. Design Philosophy

The application visual identity is defined as **"Bloomberg Terminal × modern AI lab × elite cybersecurity platform"**.

The design language moves away from generic corporate SaaS and playful consumer UI, establishing an authoritative, clinical DevSecOps cybernetic war room aesthetic. The core metaphor is the **"Autonomous Swarm"** and the **"Digital Twin"**—an intelligent security organism that continuously discovers, simulates, verifies, heals, and predicts application vulnerabilities without risking production downtime.

### Core Principles

1. **Tactical Precision over Decorative Fluff**:
   Every visual element serves an operational purpose. Typography emphasizes tabular numbers, execution timestamps, code diffs, route paths, and real-time status telemetry (`CORE ONLINE`, `VERIFIED IN TWIN`, `SEVERITY: CRITICAL`).
2. **Deterministic Containment ("Attack the twin. Not production")**:
   The UI visually contrasts production live environments (grounded in calm panel backgrounds with soft white strokes) against isolated simulation sandboxes (distinguished by lime-tinted dashed borders, red attack vector tracers, and warning badges).
3. **High-Contrast Dark Surface Architecture**:
   Built on an ultra-deep black canvas (`#050505`) layered with slightly elevated charcoal panels (`#0D0F0D`), structured by razor-thin 1px technical wire lines (`rgba(255, 255, 255, 0.12)`), and accented with high-voltage electric lime (`#B7FF00`).
4. **Kinetic Living Feedback**:
   The system conveys real-time autonomous activity through micro-animations: rotating HUD targeting rings, dynamic cybernetic text scrambling on hover, continuous laser-energy bolts traveling between Red Team and Blue Team agents, SVG circuit pulse lines, and an interactive canvas cursor grid.

---

## 2. Visual Direction

* **Overall Visual Style**: Cybernetic DevSecOps console, dark mode terminal chic, technical Bento-box data grid.
* **Mood / Personality**: Authoritative, autonomous, predictive, clinical, elite, highly vigilant.
* **Visual Hierarchy**:
  * *Hero / Brand Level*: Massive Space Grotesk display typography (`text-4xl` to `text-7xl`, `text-[16vw]` in footer watermark), tight negative tracking (`tracking-tight` to `tracking-[-0.04em]`), zero line-gap (`leading-[0.95]` or `leading-none`).
  * *Section Hierarchy*: Preceded by a monospace tag/eyebrow with a horizontal indicator line (`Tag`), followed by stark display headers where secondary clauses are subdued (`<span className="text-ash">...</span>`).
  * *Data & Operational Level*: JetBrains Mono metadata, uppercase with wide letter-spacing (`tracking-[0.2em]` to `tracking-[0.3em]`), very small font sizes (`text-[9px]` to `text-xs`).
  * *Body Prose*: Neutral Inter font in muted ash (`#8B8F88`), constrained in width (`max-w-md` to `max-w-xl`) with relaxed line spacing (`leading-relaxed`).
* **Density**: High information density. Dashboards and data feeds pack statistics, metrics, progress bars, and execution logs into tightly bordered compartments with 0px margin bleed.
* **Whitespace**: Bounded and disciplined macro-spacing. Sections utilize standardized vertical padding (`py-24 md:py-32`), horizontally centered in a strict `max-w-[1400px]` container. Micro-spacing inside cards is locked to `p-6` or `p-8`.
* **Borders & Dividers**:
  * Ubiquitous 1px hairlines: `border border-white/10` to `border-white/15`.
  * Grid lines: Asymmetrical and Bento grids use a `gap-px` container over `bg-white/10` to produce flawless 1px interior boundary lines.
  * Section dividers: `border-t border-white/10` between stacked sections.
  * Isolated environments: `border border-dashed border-lime/40`.
* **Shadows & Glows**: Traditional diffused drop shadows are replaced by localized neon glows:
  * `.lime-glow`: `box-shadow: 0 0 32px rgba(183, 255, 0, 0.18)`
  * `.text-glow`: `text-shadow: 0 0 28px rgba(183, 255, 0, 0.35)`
  * Ambient Backdrops: `w-[700px] h-[400px] bg-lime/[0.06] blur-[140px] rounded-full`
* **Radius Scale**:
  * *Terminal & Operational Core*: `rounded-none` (0px sharp corners). Cards, modals, diff blocks, inputs, and primary action buttons maintain razor-sharp right angles.
  * *Floating Navigation & Global HUD*: `rounded-full` (pill shape) for the fixed top navbar, footer social items, and pill badges (`LIVE BATTLE`).
  * *Onboarding & Auth Subsystem*: `rounded-2xl` and `rounded-xl` for login dialogs and OTP input boxes.
* **Surface Treatment**:
  * Deep Canvas: `#050505` (`--color-ink`).
  * Elevated Panel: `#0D0F0D` (`--color-panel`).
  * Sub-surface: `#0A0A0A` (inputs and recessed rows) and `#0A0D08` (digital twin container).
  * Noise Texture: Global SVG fractal noise overlay (`body::after`, `feTurbulence` with base frequency 0.9, opacity 0.05, fixed position).
  * Technical Grid Background: `.bg-grid` (linear gradients at 56px intervals, 3.5% white opacity).
  * Reactive Canvas Grid: Full-viewport interactive canvas (`CursorGrid`) responsive to pointer coordinates.
* **Overall Interaction Philosophy**: Immediate, kinetic, and tactile. Buttons exhibit magnetic pull (`Magnetic` spring physics), hover states trigger character scrambles (`ScrambleText`), interactive laser feeds pulse between threat and remediation streams, and page transitions use smooth Lenis inertia.

---

## 3. Color System

Colors are registered in `src/app/globals.css` via the Tailwind CSS v4 `@theme` directive, supplemented by explicit HEX and RGBA values across component files.

### 1. Primary Palette Tokens

| Token Name | CSS Variable | Hex / RGBA | Role / Usage in Codebase |
| :--- | :--- | :--- | :--- |
| **Ink** | `--color-ink` | `#050505` | Global body background, input recess, terminal backgrounds |
| **Panel** | `--color-panel` | `#0D0F0D` | Bento cards, elevated surface layers, modal dialog bodies |
| **Lime** | `--color-lime` | `#B7FF00` | Primary CTA buttons, active state accents, resolved badges, glowing indicators |
| **Fog** | `--color-fog` | `#F4F4F0` | Primary readable copy, display headlines, high-contrast labels |
| **Ash** | `--color-ash` | `#8B8F88` | Muted descriptions, secondary labels, disabled text, metric subtexts |
| **Border** | `--color-border` | `rgba(255, 255, 255, 0.12)` | Default hairline stroke for cards, grid cells, and dividers |

### 2. Interactive & State Variations

* **Lime Hover**: `#CFFF4D` — Used on `PrimaryButton:hover` and navbar CTA hover.
* **Lime Low-Opacity Tints**:
  * `bg-lime/5`: Active stage background in the Loop pipeline, DevSecOps step highlights.
  * `bg-lime/10`: Blue team defensive badge background, checkmark container background.
  * `bg-lime/15` / `bg-lime/[0.06]`: Radial glow spotlights, ambient blur filters.
  * `border-lime/25` to `border-lime/60`: Active node outlines, Tag lines, tech stack hover borders.

### 3. Severity & Status Palette

* **Critical / Red Team (Attack)**:
  * Hex: `#FF5F56`
  * Text variant: `#FF8A80`
  * Usage: Red Team events, critical severity badges, attack vector laser arrows, SQL injection alarms, and diff deletions (`diff-del`: `rgba(255, 95, 86, 0.08)`).
* **High Severity / Warning**:
  * Hex: `#FFB020`
  * Usage: High risk vulnerabilities, warning status pills, Pie chart high-risk slice.
* **Medium Severity**:
  * Hex: `#F4F4F0` (Fog) or `#8B8F88` (Ash)
  * Usage: Standard security events, baseline alerts.
* **Low Severity / Blue Team / Verified**:
  * Hex: `#B7FF00` (Lime)
  * Usage: Blue Team defense logs, exploit blocked notifications, 100% resolved patches, and diff additions (`diff-add`: `rgba(183, 255, 0, 0.08)`).

### 4. Neutral & Surface Accents

* **Deep Charcoal**: `#0A0A0A` — Input backgrounds, user dropdown menus.
* **Twin Sandbox Background**: `#0A0D08` — Inset surface for simulated attack environment.
* **Button Base / Social Pills**: `#111111` — Background for footer quick links and social buttons.
* **Scrollbar Thumb**: `#1C1F1C` — Custom scrollbar thumb with 2px solid `#050505` border.
* **Selection Highlight**: Background `#B7FF00`, text `#050505`.

---

## 4. Typography

Typography is loaded via `next/font/google` in `src/app/layout.tsx` and mapped to CSS variables.

### 1. Font Families

```css
--font-sans: var(--font-inter);
--font-display: var(--font-space-grotesk);
--font-mono: var(--font-jetbrains-mono);
```

### 2. Typographic Roles & Hierarchy

#### Font Display: Space Grotesk (`--font-space-grotesk`)
* **Role**: Primary display headers, hero titles, massive metrics, section headers, brand wordmark.
* **Characteristics**: Geometric, aggressive, authoritative, uppercase, tight tracking (`tracking-tight` to `tracking-[-0.04em]`).
* **Scale**:
  * *Footer Watermark*: `text-[16vw] lg:text-[18vw] leading-[0.75] font-bold tracking-tighter`
  * *Hero Main Title*: `text-[2.5rem] md:text-[4.5rem] font-bold leading-none tracking-[-0.03em]`
  * *Final CTA Headline*: `text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight`
  * *Section Headlines*: `text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight`
  * *Dashboard Stat Value*: `text-6xl font-bold text-lime`
  * *Problem Card Titles*: `text-2xl font-bold uppercase`
  * *Mobile Nav Links*: `text-2xl font-bold uppercase tracking-tight`

#### Font Mono: JetBrains Mono (`--font-jetbrains-mono`)
* **Role**: UI operational metadata, real-time telemetry, buttons, diff viewers, form labels, tags, chart axes, navigation items.
* **Characteristics**: Strictly monospaced, uppercase, tabular-nums, heavily tracked (`tracking-[0.2em]` to `tracking-[0.3em]`).
* **Scale**:
  * *Micro HUD / Scroll Indicator*: `text-[8px]` to `text-[9px]`, tracking-widest
  * *Eyebrows / Form Labels / Card Headers*: `text-[10px]`, `tracking-[0.2em]` to `tracking-[0.3em]`
  * *Tags / Badges / Nav Links*: `text-[10px]` to `text-[11px]`, `tracking-[0.25em]`
  * *Button Labels*: `text-xs` (`12px`), `font-bold`, `tracking-[0.2em]`
  * *Code Diffs & Terminal Logs*: `text-xs` (`12px`) to `text-sm` (`14px`), `leading-7`

#### Font Sans: Inter (`--font-inter`)
* **Role**: Body copy, explanatory paragraphs, long-form problem descriptions, tooltips.
* **Characteristics**: Clean, neutral, high dark-mode readability, sentence case.
* **Scale**:
  * *Body Text*: `text-sm` (`14px`) to `text-base` (`16px`) / `text-lg` (`18px`), `text-ash`, `leading-relaxed`
  * *Auth Subtext*: `text-sm` (`14px`), `text-ash`

---

## 5. Spacing & Sizing

### 1. Containers & Max-Widths
* **Global Page Container**: `max-w-[1400px] mx-auto`
* **Floating Navbar**: `max-w-4xl`
* **Agent Constellation**: `max-w-5xl mx-auto aspect-[16/10]`
* **Modals (`ScanModal`)**: `max-w-lg` (`32rem` / `512px`)
* **Auth Cards (`AuthFlow`)**: `max-w-md` (`28rem` / `448px`) and `max-w-sm` (`24rem` / `384px`)
* **Constrained Prose**: `max-w-md` (`28rem`), `max-w-lg` (`32rem`), `max-w-xl` (`36rem`), `max-w-3xl` (`48rem`)

### 2. Section Spacing Scale
* **Standard Section Padding**: `py-24 md:py-32` combined with `px-6 md:px-12`
* **Final CTA Section Padding**: `py-28 md:py-40`
* **Footer Spacing**: `pt-24 md:pt-32 pb-8 md:pb-12`
* **Loop Pipeline Scroll Track**: `height: 350vh` (scroll-pinned track)

### 3. Component Inner Padding
* **Standard Panel/Card**: `p-6` (`1.5rem`) or `p-8` (`2rem`)
* **Primary Button**: `px-7 py-4` (`1.75rem` × `1rem`)
* **Navbar Pill Buttons**: `px-4 sm:px-5 py-2 sm:py-2.5`
* **Standard Form Inputs**: `px-4 py-3`
* **Auth Inputs (with leading icon)**: `pl-11 p-3.5`
* **OTP Digit Inputs**: `w-11 h-14 sm:w-[46px] sm:h-[58px]`

### 4. Gaps & Grid Divider Technique
* **Bento Grid Lines**: Constructed using `gap-px` on a parent container having `bg-white/10` and `border border-white/10`. Child panels specify `bg-panel`. This eliminates doubled border borders.
* **Flex Gaps**: Standardized intervals of `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px), `gap-12` (48px).

### 5. Border Widths & Radius
* **Border Width**: `1px` baseline (`border`), with `border-l-2` for active state accents and `2px` for focused inputs.
* **Radius Scale**:
  * `rounded-none` (0px): Cards, dashboard modules, diff containers, terminal inputs, primary/ghost buttons.
  * `rounded-full` (9999px): Floating navbar, HUD status pills, checkmark containers, quick link buttons.
  * `rounded-xl` / `rounded-2xl` / `rounded-[28px]`: Authentication forms (`auth/`) and OTP containers.

---

## 6. Layout System

### 1. Macro Page Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ GsapIntroTransition (Full-screen curtain wipe, z-[99999])    │
├─────────────────────────────────────────────────────────────┤
│ CursorGrid (Fixed Canvas Background, z-0)                   │
├─────────────────────────────────────────────────────────────┤
│ GsapEffects (Parallax SVG & wireframe lines, z-[1])          │
├─────────────────────────────────────────────────────────────┤
│ Fixed Floating Navbar (z-50, max-w-4xl, pill shape)         │
├─────────────────────────────────────────────────────────────┤
│ <main> Content Stack (z-10, border-t dividers)               │
│   ├── #top: Hero (Full viewport, HUD, Video background)     │
│   ├── #problem: Problem (3-column asymmetric cards)         │
│   ├── #platform: Loop (Sticky scroll pinned across 350vh)   │
│   ├── #how-it-works: DigitalTwin (Split-screen sandbox)     │
│   ├── #agents: Agents (Swarm constellation + SVG curves)    │
│   ├── #battle: Battle (Red vs Blue live stream + lasers)    │
│   ├── #security: SelfHealing (3-column diff & code patch)   │
│   ├── #dashboard: Dashboard (Bento Recharts intelligence)   │
│   ├── #devsecops: DevSecOps (Pipeline flow & GitHub PR)     │
│   ├── #technology: TechStack (Monochrome icon grid)         │
│   └── FinalCTA (High-impact conversion block)               │
├─────────────────────────────────────────────────────────────┤
│ <footer> (12-column grid + massive text watermark)          │
├─────────────────────────────────────────────────────────────┤
│ ScanModal / Modals (z-[100], fixed centered overlay)        │
└─────────────────────────────────────────────────────────────┘
```

### 2. Layout Patterns

* **Sticky Scroll-Pinning**: Used in `Loop.tsx`. Outer container is set to `height: 350vh`. The inner view is `sticky top-0 h-screen`, sampling scroll progression to advance stages from 0 to 5.
* **Asymmetric Editorial Grids**: Used in `Problem.tsx`. A 3-column grid (`lg:grid-cols-3 gap-8`) where column 1 has `lg:mt-12`, column 2 is centered with an accented background, and column 3 has `lg:mt-24`.
* **Split Sandbox Architecture**: Used in `DigitalTwin.tsx`. A 3-element horizontal layout (`grid lg:grid-cols-[1fr_auto_1fr]`) contrasting live production against isolated twin sandboxing with animated SVG pulse dots.
* **Bento Intelligence Grid**: Used in `Dashboard.tsx`. A responsive 4-column container (`grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10`) housing mixed-size data cards (`lg:col-span-2` for charts and feeds).

---

## 7. Components

### 1. Buttons

#### PrimaryButton (`src/components/shared.tsx`)
* **Purpose**: Primary conversion action (e.g., "START SECURITY SCAN", "GENERATE SECURE PATCH").
* **Appearance**: Background `#B7FF00` (`bg-lime`), text `#000000`, 0px border radius, `.lime-glow` shadow.
* **Typography**: `font-mono text-xs font-bold tracking-[0.2em] uppercase`.
* **Interaction**: Wrapped in `<Magnetic>` spring physics. Hover transitions background to `#CFFF4D`.
* **Padding**: `px-7 py-4`.

#### GhostButton (`src/components/shared.tsx`)
* **Purpose**: Secondary action (e.g., "VIEW GITHUB", "VIEW SECURITY PIPELINE").
* **Appearance**: Transparent background, `border border-white/20`, text `#F4F4F0`.
* **Typography**: `font-mono text-xs tracking-[0.2em] uppercase`.
* **Interaction**: Wrapped in `<Magnetic>`. Hover state transitions border to `border-lime` and text to `text-lime`.
* **Padding**: `px-7 py-4`.

#### Nav Button (`src/components/Navbar.tsx`)
* **Appearance**: `rounded-full bg-[#B7FF00] text-[#050505] font-mono text-[10px] sm:text-[11px] font-bold tracking-wider px-4 sm:px-5 py-2 sm:py-2.5`.
* **Interaction**: Hover triggers `bg-[#cfff4d]` and `scale-105`.

#### AuthButton (`auth/AuthButton.tsx`)
* **Appearance**: `rounded-xl font-medium text-ink bg-lime py-3.5 px-4`. Includes Framer Motion scale tap (`scale: 0.98`) and built-in `Loader2` spinner state.

---

### 2. Navigation Elements

#### Floating Pill Navbar (`src/components/Navbar.tsx`)
* **Layout**: Fixed `top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4`.
* **Frame**: `rounded-full border border-white/12 h-14 sm:h-16 px-4 sm:px-6`.
* **Dynamic Backdrop**:
  * Default: `bg-[#050505]/70 backdrop-blur-[18px]`.
  * Scrolled (>24px): `bg-[#050505]/85 backdrop-blur-2xl shadow-lg shadow-black/50`.
* **Scroll-Linked Hide/Show**: Translates `-150%` upwards when scrolling down past 150px; restores smoothly on upward scroll.
* **Mobile Handling**: At `< lg`, links collapse to an icon toggle (`Menu` / `X`), activating a full-screen drawer (`bg-ink pt-28 px-8 backdrop-blur-md`).

---

### 3. Cards & Panels

#### Bento Card (`src/components/Dashboard.tsx`)
* **Appearance**: `bg-panel border border-white/10 p-6 flex flex-col`.
* **Header**: Monospace tracked eyebrow (`font-mono text-[10px] tracking-[0.25em] text-ash mb-5`).
* **Sizing**: Modular single cell or `lg:col-span-2` double cell.

#### ProblemCard (`src/components/Problem.tsx`)
* **Appearance**: `border border-white/10 p-8 flex flex-col`. Default uses `bg-panel`, accented variant uses `bg-black/90`.
* **Typography**: `font-display font-bold uppercase text-2xl text-fog mb-4`.

#### AgentCard (`src/components/Agents.tsx`)
* **Appearance**: Floating holographic detail panel (`w-56 border-l-2 border-lime bg-black/90 backdrop-blur-md p-4 shadow-[10px_0_30px_rgba(183,255,0,0.1)]`).
* **Features**: Live confidence progress bar with an animated shimmer overlay (`animate-[shimmer_1s_infinite]`).

---

### 4. Interactive Specialized Visualizers

#### Hero HUD & Target Ring (`src/components/Hero.tsx`)
* **Appearance**: Concentric 192px circles (`w-48 h-48 border border-white/10 rounded-full`).
* **Motion**: Outer ring rotates clockwise (12s linear), inner ring counter-clockwise (18s linear), center dot pulses scale, horizontal scanline oscillates vertically (4s easeInOut).

#### Autonomous Swarm Constellation (`src/components/Agents.tsx`)
* **Appearance**: SVG network connecting 6 hexagonal nodes around a central core using dynamic S-curve paths (`generateSCurve`).
* **Interactivity**: Mouse coordinates translate the core and nodes in parallax. Hovering a node activates `ScrambleText`, highlights the circuit line, and launches a traveling data pulse.

#### Adversarial Live Arena (`src/components/Battle.tsx`)
* **Appearance**: Terminal event feed masked with vertical fade gradient (`maskImage: linear-gradient(to bottom, black 50%, transparent 100%)`).
* **Visual FX**: `LaserEffects` component projects high-speed SVG energy bolts (red attacking from left, green defending from right) with motion blur and glow filters.

#### Code Diff Viewer (`src/components/SelfHealing.tsx`)
* **Structure**: Inset terminal header (`PATCH #128 — api/users.js`) with `+2 -1` metric.
* **Styling**: `font-mono text-xs md:text-sm leading-7 p-5 bg-black border border-white/10`.
* **Diff Highlighting**:
  * Additions (`.diff-add`): `bg: rgba(183, 255, 0, 0.08)`, `color: #B7FF00`.
  * Deletions (`.diff-del`): `bg: rgba(255, 95, 86, 0.08)`, `color: #FF5F56`.
  * Context (`.diff-ctx`): `color: #8B8F88`.

#### Interactive Cursor Grid (`src/components/CursorComp.tsx`)
* **Technology**: HTML5 Canvas running at device pixel ratio (`dpr`).
* **Behavior**: Renders a reactive 70px cell grid. Pointer movement energizes cells with a radial falloff gradient in `#B7FF00`; pointer clicks trigger expanding concentric shockwave rings.

---

### 5. Modals & Dialogs

#### ScanModal (`src/components/ScanModal.tsx`)
* **Backdrop**: `fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center px-4`.
* **Dialog Frame**: `w-full max-w-lg bg-panel border border-white/15 rounded-none`.
* **Header**: Monospace tracked title with divider and close `X` button.
* **Progress Telemetry**: Multi-stage pipeline feedback (`CREATING DIGITAL TWIN` -> `MAPPING ATTACK SURFACE` -> `RED TEAM ENGAGED` -> `VERIFYING EXPLOITS` -> `GENERATING PATCHES`) using `Loader2` spin states.
* **Completion Screen**: Security score counter (`text-5xl font-bold text-lime`), findings breakdown grid, and direct report navigation.

---

## 8. Interaction & States

### 1. State Matrix

| State | Visual Treatment | Implementation Example |
| :--- | :--- | :--- |
| **Hover (Buttons)** | Background shifts `#B7FF00` → `#CFFF4D`, magnetic position follow | `hover:bg-[#cfff4d]` inside `<Magnetic>` |
| **Hover (Ghost)** | Border shifts `white/20` → `border-lime`, text `fog` → `lime` | `hover:border-lime hover:text-lime` |
| **Hover (Chips)** | Border shifts `white/12` → `border-lime/60`, icon becomes `#B7FF00` | `group-hover:text-lime` in `TechStack.tsx` |
| **Hover (Agents)** | Scale 1.1x, node fills with `#B7FF00`, text scramble triggers | `ScrambleText` + SVG fill toggle |
| **Focus (Inputs)** | 1px sharp lime border, ring suppressed or subtle | `focus:border-lime outline-none` |
| **Active (Stages)** | Left border 2px solid lime, subtle lime tint background | `border-lime bg-lime/5 text-lime` |
| **Disabled** | Opacity dropped to 30%–50%, pointer events removed | `disabled:opacity-30 disabled:cursor-not-allowed` |
| **Loading** | Indeterminate pulse, rotating SVG loader | `animate-spin text-ink` (`Loader2`) |

### 2. Kinetic Animation Conventions

1. **ScrambleText**: 30ms character cycling algorithm selecting from `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+` before locking onto final text.
2. **Magnetic Physics**: Framer Motion spring physics with `stiffness: 220` and `damping: 16`. Follows mouse delta with a `0.22` dampening multiplier.
3. **Blinking Telemetry**: CSS step animation (`@keyframes blink`, 1.1s step-end infinite) on status indicator dots.
4. **Flowing Vector Arrows**: CSS translateX animation (`@keyframes flow-x`, 1.8s linear infinite).
5. **GSAP Parallax**:
   * Vertical gradient lines move down by `150% + i * 20%` scrubbed against document scroll.
   * Floating blur spheres rotate and translate across viewport quadrants.
6. **Smooth Scrolling**: Lenis smooth wheel inertia enabled globally with `duration: 1.1` and `smoothWheel: true`.

---

## 9. Responsive Design

The codebase relies on Tailwind CSS breakpoints:
* **sm**: `640px`
* **md**: `768px`
* **lg**: `1024px`
* **xl**: `1280px`

### Responsive Behavior by Section

* **Navbar**:
  * `lg` and above: Inline navigation links + GitHub icon + Launch/Login CTA.
  * Below `lg`: Links hidden, hamburger button rendered. Full-screen drawer overlay (`bg-ink pt-28 px-8 backdrop-blur-md`) opens on click.
* **Hero Section**:
  * Desktop (`md`+): Full circular HUD target ring (192px) and vertical data points on the right side.
  * Mobile (`< md`): Target ring hidden; replaced with `MobileHUD` (a compact horizontal strip: `CORE ONLINE · 06 AGENTS · RISK 12%`).
  * Headline: Responsive font scaling (`text-[2.5rem] md:text-[4.5rem]`).
* **Loop Pipeline**:
  * Desktop: Full pinned scroll-jacking across `350vh` container.
  * Mobile: Scroll container maintains max height with scrollable overflow list (`max-h-[60vh] overflow-y-auto no-scrollbar`).
* **Digital Twin**:
  * Desktop: Horizontal split (`grid lg:grid-cols-[1fr_auto_1fr]`). Vertical data sync dots with right-facing arrow.
  * Mobile: Stacks into vertical column; sync indicators re-orient.
* **Autonomous Swarm (Agents)**:
  * Desktop (`lg`+): Full interactive 16:10 SVG constellation with mouse parallax and holographic detail cards.
  * Mobile (`< lg`): Constellation hidden; collapses into a clean 2-column card grid (`grid sm:grid-cols-2 gap-4`).
* **Security Intelligence Dashboard**:
  * Desktop (`lg`+): 4-column Bento grid with double-span charts.
  * Tablet (`md`): 2-column grid.
  * Mobile: 1-column stack.
* **Footer**:
  * Desktop: 12-column grid (`5 col` tagline + `4 col` links + `3 col` contact).
  * Mobile: Stacks vertically with 16-gap intervals. Brand watermark scales responsively via viewport units (`text-[16vw] lg:text-[18vw]`).

---

## 10. Icons & Imagery

### 1. Iconography Libraries
* **Lucide React (`lucide-react`)**: Primary interface iconography.
  * *Icons*: `Shield`, `Menu`, `X`, `ArrowRight`, `ArrowDown`, `User`, `LogOut`, `Server`, `Globe`, `Database`, `KeyRound`, `Boxes`, `Radar`, `Swords`, `ShieldCheck`, `Check`, `GitPullRequest`, `Mail`, `Loader2`.
  * *Sizing*: Standardized to `12px`, `14px`, `16px`, or `20px`.
* **Simple Icons (`react-icons/si`)**: Technology stack branding.
  * *Icons*: `SiNextdotjs`, `SiReact`, `SiTypescript`, `SiTailwindcss`, `SiShadcnui`, `SiNodedotjs`, `SiExpress`, `SiPostgresql`, `SiRedis`, `SiSocketdotio`, `SiJsonwebtokens`, `SiOllama`, `SiFastapi`, `SiDocker`, `SiGithubactions`, `SiGithub`.
* **FontAwesome (`react-icons/fa`)**: Social media links in footer (`FaGithub`, `FaTwitter`, `FaLinkedin`).

### 2. Imagery & Textures
* **No Generic Stock Photography**: The application strictly avoids decorative stock photos, generic 3D illustrations, or matrix digital rain.
* **Cinematic Video Background**: Located at `/hero-background.mp4`, rendered under dark overlays (`bg-black/65`), a lime radial vignette, and an SVG noise texture.
* **Procedural SVG Assets**:
  * Concentric rotating dashed circles in `SecurityCore.tsx` and `HeroHUD`.
  * Pure SVG polygon hexagons (`points="50,2 98,26 98,74 50,98 2,74 2,26"`).
  * Cubic Bezier wire connections (`M 50 50 C ...`).
* **Noise Grain Overlay**: Embedded in `globals.css` (`body::after` pseudo-element):
  ```css
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
  ```

---

## 11. Forms & Validation

The application contains two distinct form paradigms:

### 1. Terminal Scan Input (`ScanModal.tsx`)
* **Structure**: Single-field input inside a technical modal dialog.
* **Input Box**: Sharp corners, deep black background (`bg-black`), muted border (`border-white/15`), monospace typography (`font-mono text-sm text-fog`).
* **Label**: Inset uppercase monospace label (`font-mono text-[10px] tracking-[0.2em] text-ash block mb-2`).
* **Focus State**: Snaps cleanly to lime (`focus:border-lime outline-none`).
* **Submit CTA**: Full-width primary lime button (`bg-lime text-black font-mono text-xs font-bold tracking-[0.2em] py-4`).
* **Feedback States**: Multi-step animated progress indicators with `Loader2` spinner; red error text (`#FF5F56`) on connection failure.

### 2. Authentication & OTP Input (`auth/`)
* **Email Step (`EmailStep.tsx`)**:
  * Input with leading `Mail` icon.
  * Active typing effect: Dynamic rotating conic-gradient border (`conic-gradient(from 0deg, transparent 0%, #B7FF00 20%, transparent 50%)`).
  * Validation: Live regex email validation with animated red error messages.
* **OTP Verification Step (`OtpStep.tsx`)**:
  * 6 individual numeric inputs (`w-11 h-14 sm:w-[46px] sm:h-[58px]`).
  * Auto-advance focus to next digit, auto-verify on 6th digit.
  * Backspace and paste handling (`clipboardData` parsing digits).
  * Error State: Inputs execute an animated horizontal shake (`x: [-5, 5, -5, 5, 0]`) and turn red.
  * Success Transition: Inputs rotate 360° and collapse toward center into a single glowing green dot, handing off to a circular SVG checkmark draw (`SuccessAnimation.tsx`).

---

## 12. Accessibility

### 1. Implemented Accessibility Practices
* **Semantic HTML**: Standard structure using `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<a>`, `<pre>`, `<code>`, `<input>`, `<label>`, `<form>`.
* **ARIA & Labels**:
  * Explicit `aria-label` attributes on icon-only buttons (`aria-label="Menu"`, `aria-label="GitHub"`).
  * All input fields in modals and auth steps have programmatic labels or clear placeholder identifiers.
* **Testability**: Comprehensive `data-testid` coverage across all interactive components (`data-testid="navbar"`, `data-testid="hero-section"`, `data-testid="battle-arena"`, `data-testid="scan-modal"`, etc.).
* **Keyboard Focus**: Focus visible rings or crisp border transitions (`focus:border-lime`) present on inputs and action buttons.

### 2. Contrast & Color Considerations
* **Primary Text**: Fog (`#F4F4F0`) against Ink (`#050505`) achieves an 18.2:1 contrast ratio (exceeds WCAG AAA standard).
* **Primary Buttons**: Black (`#000000`) text on Lime (`#B7FF00`) achieves a 16.5:1 contrast ratio (exceeds WCAG AAA standard).
* **Caution Area**: Micro-typography (`text-[9px]`, `text-[10px]`) in Ash (`#8B8F88`) on Ink (`#050505`) yields a ~4.7:1 ratio. This meets WCAG AA for normal text, but requires careful usage for essential content.

### 3. Motion & Cognitive Considerations
* The application features rich continuous animation (GSAP, Framer Motion, Lenis).
* **Recommendation**: Implement `@media (prefers-reduced-motion: reduce)` media queries in `globals.css` to disable parallax scrub, SVG laser loops, and intro transitions for users who request reduced motion.

---

## 13. UX Patterns

* **Scroll-Linked Storytelling**: The Loop section uses scroll progression across `350vh` to guide users through the 6 DevSecOps stages without taking them to separate pages.
* **Autonomous Simulation**: The scan modal gives users realistic terminal feedback through sequential execution phases before rendering metrics.
* **Adversarial Live Feed**: Red vs. Blue team logs demonstrate continuous verification rather than static promise copy.
* **Dual-State Onboarding**: Users can either trigger a contextual repository scan modal directly from the landing page or enter the dedicated authentication flow at `/login`.
* **Auto-Collapsing Modals**: Modals lock body interactions while open, dismiss on backdrop click or `Escape` key, and prevent closing during active scan execution.

---

## 14. Design Tokens

### 1. Color Tokens

| Token / Variable | Raw Value | Semantic Category | Typical Classes |
| :--- | :--- | :--- | :--- |
| `--color-ink` | `#050505` | Background | `bg-ink`, `bg-[#050505]` |
| `--color-panel` | `#0D0F0D` | Surface | `bg-panel`, `bg-[#0D0F0D]` |
| `--color-lime` | `#B7FF00` | Accent / Primary | `bg-lime`, `text-lime`, `border-lime` |
| `--color-fog` | `#F4F4F0` | Primary Text | `text-fog`, `text-[#F4F4F0]` |
| `--color-ash` | `#8B8F88` | Secondary Text | `text-ash`, `text-[#8B8F88]` |
| `--color-border` | `rgba(255, 255, 255, 0.12)` | Border Default | `border-white/10`, `border-white/12` |
| *Critical* | `#FF5F56` | Destructive / Red Team | `text-[#FF5F56]`, `border-[#FF5F56]/30` |
| *Warning* | `#FFB020` | High Risk Alert | `text-[#FFB020]`, `border-[#FFB020]/40` |
| *Hover Lime* | `#CFFF4D` | Interactive Hover | `hover:bg-[#cfff4d]` |

### 2. Typography Tokens

| Token / Variable | Font Family | Typical Weight | Typical Tracking |
| :--- | :--- | :--- | :--- |
| `--font-display` | `'Space Grotesk', sans-serif` | Bold (`700`), Medium (`500`) | `tracking-tight`, `tracking-[-0.03em]` |
| `--font-mono` | `'JetBrains Mono', monospace` | Regular (`400`), Bold (`700`) | `tracking-[0.2em]`, `tracking-[0.3em]` |
| `--font-sans` | `'Inter', sans-serif` | Regular (`400`), Medium (`500`) | `tracking-normal` |

### 3. Spacing & Container Tokens

| Concept | Token / Value | Codebase Occurrences |
| :--- | :--- | :--- |
| Max Container | `1400px` | `max-w-[1400px] mx-auto` |
| Nav Container | `896px` (`4xl`) | `max-w-4xl` |
| Modal Container | `512px` (`lg`) | `max-w-lg` |
| Auth Container | `384px`–`448px` | `max-w-sm`, `max-w-md` |
| Section Vertical Padding | `py-24 md:py-32` | Standard sections |
| Card Padding | `p-6` (`24px`) or `p-8` (`32px`) | Bento cards & Problem cards |
| Grid Line Gaps | `gap-px` | Bento grids with `bg-white/10` |

### 4. Radius & Border Tokens

| Shape | Radius Value | Component Scope |
| :--- | :--- | :--- |
| Sharp / Flat | `0px` (`rounded-none`) | Cards, panels, modals, diff blocks, inputs, primary buttons |
| Pill | `9999px` (`rounded-full`) | Floating navbar, live battle tag, footer quick links |
| Auth Rounded | `12px` (`rounded-xl`), `16px` (`rounded-2xl`), `28px` | Authentication cards, OTP digit boxes |

---

## 15. Component Usage Rules

1. **Button Variant Usage**:
   * Use `PrimaryButton` exclusively for primary conversion funnels (e.g., initiating a scan, generating a patch, submitting credentials). Wrap with `<Magnetic>`.
   * Use `GhostButton` for informational or exploratory secondary actions (e.g., "VIEW GITHUB", "VIEW SECURITY PIPELINE").
   * Never create custom button styles with thick drop shadows or arbitrary border radii.
2. **Monospace Font Application**:
   * Reserve `font-mono` for metadata tags, timestamps, log output, diff displays, form labels, and button labels.
   * **Mandatory Rule**: Whenever `font-mono` is used for text smaller than 12px, it must have `uppercase` and letter-spacing (`tracking-wider` to `tracking-[0.3em]`).
   * Never use `font-mono` for multi-sentence prose paragraphs.
3. **Card & Bento Construction**:
   * Data cards must have `bg-panel` and `border border-white/10`.
   * For multi-card grids, wrap cards in a parent with `gap-px bg-white/10 border border-white/10` rather than applying independent outer borders to each item.
4. **Color Usage Restrictions**:
   * Never use `#B7FF00` (Lime) as a full-screen or large container background.
   * Reserve Lime for buttons, status dots, diff additions, and glow halos.

---

## 16. Do / Don't

### Do
* **DO** use the Bento grid technique (`gap-px bg-white/10 border border-white/10`) for all data dashboards.
* **DO** prefix section headers with `<Tag>` components containing an uppercase monospace eyebrow and indicator line.
* **DO** keep cards, terminal panels, inputs, and primary buttons sharp (`rounded-none`).
* **DO** wrap primary action buttons in `<Magnetic>` for interactive tactile responsiveness.
* **DO** use `Space Grotesk` with uppercase styling and tight letter-spacing for headlines.
* **DO** include `data-testid` attributes on every interactive element.

### Don't
* **DON'T** introduce arbitrary neon colors (cyan, magenta, yellow). Stick to Lime (`#B7FF00`), Red (`#FF5F56`), and Amber (`#FFB020`).
* **DON'T** use traditional drop shadows (`shadow-md`, `shadow-xl`); use `.lime-glow` or subtle 1px border highlights instead.
* **DON'T** use generic stock photos, illustrations of brains, or matrix digital rain.
* **DON'T** apply border radii (`rounded-md`, `rounded-lg`) to data cards or terminal panels.
* **DON'T** use `transition: all`. Specify transition properties explicitly (e.g., `transition-colors`, `transition-transform`).

---

## 17. Design Consistency Notes

During codebase inspection, the following differences were observed across modules:

1. **Border Radius in Main App vs. Auth Flow**:
   * *Observation*: The core application uses strict `rounded-none` (sharp right angles) for cards, inputs, and buttons. In contrast, the `auth/` directory (`EmailStep.tsx`, `OtpStep.tsx`) uses rounded shapes (`rounded-2xl`, `rounded-xl`, `rounded-[28px]`).
   * *Dominant Pattern*: The sharp, terminal aesthetic is dominant across the entire marketing and product experience (`src/components/`).
   * *Recommendation*: The rounded auth flow is a self-contained modal subsystem. For future features, maintain sharp corners on all operational tooling, dashboards, and data panels.
2. **Border Opacity Values**:
   * *Observation*: Border opacities fluctuate slightly between `border-white/10`, `border-white/12`, `border-white/15`, and `border-white/20`.
   * *Dominant Pattern*: `border-white/10` is used for structural framing; `border-white/15` is used for interactive input strokes; `border-white/20` is used for ghost button borders.
   * *Recommendation*: Standardize on `border-white/10` for non-interactive containers and `border-white/15` for interactive elements.
3. **Pill Shapes vs. Sharp Corners**:
   * *Observation*: Buttons in the floating `Navbar.tsx` and `Footer.tsx` use `rounded-full`, while `PrimaryButton` and `GhostButton` in `shared.tsx` use sharp corners.
   * *Dominant Pattern*: Pill shapes are intentionally reserved for persistent viewport-level navigation elements. Content-level components remain sharp.
4. **Tailwind Version Alignment**:
   * *Observation*: The root application runs Tailwind CSS v4 using `@theme` in `src/app/globals.css`. A legacy prototype folder (`landing-page/`) contains a Tailwind v3 configuration (`tailwind.config.js`) and shadcn-style HSL variables.
   * *Dominant Pattern*: The production runtime is driven entirely by `src/app/globals.css`. All new components must reference Tailwind v4 tokens.

---

## 18. Developer Implementation Guidelines

When creating new pages, sections, or components for **SentinelX AI**, adhere to these implementation steps:

### 1. Base Setup & Structure
* Ensure new pages are wrapped with `<main className="bg-ink text-fog font-sans antialiased">`.
* Standard sections should use `<SectionShell id="your-section-id">` from `@/components/shared`.

### 2. Typographic Standard for New Sections
Follow the canonical header pattern:
```tsx
<Reveal>
    <Tag>YOUR CATEGORY</Tag>
    <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8">
        Primary Headline <span className="text-ash">Muted Sub-clause.</span>
    </h2>
    <p className="text-ash text-base md:text-lg mt-6 max-w-xl leading-relaxed">
        Descriptive body copy using Inter font.
    </p>
</Reveal>
```

### 3. Creating a New Bento Data Card
```tsx
<div className="bg-panel border border-white/10 p-6 flex flex-col">
    <p className="font-mono text-[10px] tracking-[0.25em] text-ash mb-5 uppercase">
        METRIC NAME
    </p>
    <div className="flex items-end gap-2">
        <span className="font-display text-5xl font-bold text-lime">
            <Counter to={98} />
        </span>
        <span className="font-mono text-ash text-sm mb-2">/100</span>
    </div>
    <p className="font-mono text-[10px] text-lime mt-3 uppercase">
        ▲ ACTIVE STATUS
    </p>
</div>
```

### 4. Interactive Element Standards
* Primary CTA: `<PrimaryButton testId="my-action-btn" onClick={...}>ACTION TITLE <ArrowRight size={14} /></PrimaryButton>`
* Secondary CTA: `<GhostButton testId="my-secondary-btn" href="...">EXPLORE <ArrowRight size={14} /></GhostButton>`
* Always import action icons from `lucide-react` with sizes restricted to `12`, `14`, or `16`.
* For technology logos, import exclusively from `react-icons/si`.
