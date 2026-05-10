---
name: Odoo Inspired Design System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#4e444a'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#80747a'
  outline-variant: '#d1c3ca'
  surface-tint: '#79526f'
  primary: '#57344f'
  on-primary: '#ffffff'
  primary-container: '#714b67'
  on-primary-container: '#f0bfe0'
  inverse-primary: '#e9b8d9'
  secondary: '#00696e'
  on-secondary: '#ffffff'
  secondary-container: '#92eff5'
  on-secondary-container: '#006e73'
  tertiary: '#34451e'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b5d33'
  on-tertiary-container: '#c0d5a0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd7f1'
  primary-fixed-dim: '#e9b8d9'
  on-primary-fixed: '#2f1029'
  on-primary-fixed-variant: '#5f3b56'
  secondary-fixed: '#95f1f8'
  secondary-fixed-dim: '#78d5db'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#d5eab4'
  tertiary-fixed-dim: '#b9ce9a'
  on-tertiary-fixed: '#112000'
  on-tertiary-fixed-variant: '#3b4c24'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
  purple-heritage: '#714B67'
  purple-dark: '#5A3C52'
  purple-medium: '#65435C'
  lavender: '#B18AA7'
  teal-primary: '#017E84'
  teal-accent: '#00A09D'
  deep-charcoal: '#111827'
  neutral-charcoal: '#374151'
  gold-amber: '#FBB130'
  gold-highlight: '#FFC107'
  off-white-light: '#F9FAFB'
  off-white: '#FAFAFA'
  light-gray: '#F9F9F9'
  pale-gray: '#F3F4F6'
  divider-gray: '#DEE2E6'
  border-subtle: '#D8DADD'
  success-green: '#28A745'
  error-red: '#DC3545'
typography:
  display-h1:
    fontFamily: Caveat
    fontSize: 88px
    fontWeight: '700'
    lineHeight: 88px
  display-h2:
    fontFamily: Caveat
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 64px
  display-h6:
    fontFamily: Caveat
    fontSize: 76px
    fontWeight: '700'
    lineHeight: 76px
  heading-h4:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28.8px
  body-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '300'
    lineHeight: 36px
  body-reg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 21px
  link:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  button-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  button-reg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 21px
  input-default:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  micro: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-h: 40px
  section-v: 60px
---

# Design System Inspired by Odoo

## 1. Visual Theme & Atmosphere

Odoo's design system embodies a modern, professional yet approachable aesthetic designed for enterprise business software. The visual language balances sophistication with accessibility, employing a harmonious blend of deep purples, teals, and warm neutrals that convey trust, innovation, and business capability. The system embraces clean lines, generous whitespace, and bold typography to create clarity in complex workflows. Interactive elements use vibrant accents and purposeful shadows to guide user attention, while the overall atmosphere remains calm and focused—ideal for a comprehensive business platform that consolidates multiple applications into one unified experience.

**Key Characteristics**
- Deep purple and teal color scheme signaling enterprise professionalism
- Clean, minimalist interface with breathing room between elements
- Bold, modern typography hierarchy for rapid information scanning
- Subtle elevation and shadow treatment for depth without visual clutter
- Warm, inviting accent colors (gold/amber) for call-to-action emphasis
- High contrast text for accessibility and readability
- Consistent rounded corner treatment for softness and approachability

## 2. Color Palette & Roles

### Primary
- **Purple Heritage** (`#714B67`): Primary brand color used across buttons, links, and key interactive elements; conveys sophistication and business trust
- **Deep Charcoal** (`#111827`): Primary text and heavy semantic weight; highest contrast for readability
- **Neutral Charcoal** (`#374151`): Secondary text, supporting UI elements, and lighter semantic hierarchy

### Accent Colors
- **Teal Primary** (`#017E84`): Accent color for highlights, icons, and secondary CTAs; creates visual interest
- **Teal Accent** (`#00A09D`): Lighter teal for supporting visual elements and hover states
- **Purple Dark** (`#5A3C52`): Deep purple variant for subtle depth variations
- **Purple Medium** (`#65435C`): Mid-tone purple for secondary surfaces
- **Lavender** (`#B18AA7`): Light purple for soft backgrounds and disabled states

### Interactive
- **Gold/Amber** (`#FBB130`): Primary call-to-action highlight and emphasis in marketing contexts
- **Gold Highlight** (`#FFC107`): Warning and secondary highlight states

### Neutral Scale
- **White** (`#FFFFFF`): Primary surface and content background
- **Off-White Light** (`#F9FAFB`): Subtle background distinction
- **Off-White** (`#FAFAFA`): Card and container backgrounds
- **Light Gray** (`#F9F9F9`): Hover and active states on light surfaces
- **Pale Gray** (`#F3F4F6`): Disabled and inactive surface states
- **Divider Gray** (`#DEE2E6`): Border and divider lines
- **Border Gray** (`#D8DADD`): Input borders and subtle separators
- **Black** (`#000000`): Extreme contrast and emphasis elements

### Surface & Borders
- **Border Light** (`#DEE2E6`): Standard border color for inputs and cards
- **Border Subtle** (`#D8DADD`): Very subtle dividers and shadows

### Semantic / Status
- **Success Green** (`#28A745`): Positive confirmations, successful states, and validation
- **Error Red** (`#DC3545`): Error messages, dangerous actions, and failure states
- **Warning Amber** (`#FBB130`): Alert conditions and warning messaging

## 3. Typography Rules

### Font Family
**Primary:** Inter (300, 400, 500, 600, 700 weights)
Fallback stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

**Display/Accent:** Caveat (700 weight)
Fallback stack: `Caveat, cursive, serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|---|---|
| Display/H1 | Caveat | 88px | 700 | 88px | 0px | Hero headlines, maximum impact |
| Display/H2 | Caveat | 64px | 700 | 64px | 0px | Section headlines, prominent messaging |
| Display/H6 | Caveat | 76px | 700 | 76px | 0px | Large accent headline |
| Heading/H4 | Inter | 24px | 600 | 28.8px | 0px | Primary heading levels, section titles |
| Body/Large | Inter | 24px | 300 | 36px | 0px | Large body text for emphasis |
| Body/Regular | Inter | 16px | 400 | 24px | 0px | Standard body copy |
| Body/Small | Inter | 14px | 400 | 21px | 0px | Supplementary text, captions |
| Link | Inter | 16px | 600 | 24px | 0px | Standard hyperlinks |
| Link/Small | Inter | 12px | 400 | 18px | 0px | Metadata links, small actionable text |
| Button/Large | Inter | 16px | 600 | 24px | 0px | Primary button text |
| Button/Regular | Inter | 14px | 600 | 21px | 0px | Standard button sizing |
| Button/Small | Inter | 12px | 600 | 18px | 0px | Compact button text |
| Input/Default | Inter | 16px | 400 | 24px | 0px | Form input text |
| Span/Small | Inter | 12px | 400 | 18px | 0px | Badge and label text |

### Principles
- **Hierarchy through weight, not size:** Use 300–700 weight variations to establish visual priority while keeping size consistent
- **Ample line spacing:** Generous line heights (1.5–1.8x) for comfortable reading in dense business interfaces
- **Contrast-driven:** Text color pairs use high contrast (`#111827` on white) for accessibility compliance
- **Caveat for personality:** Handwritten Caveat font used sparingly on display-level headlines to humanize enterprise software
- **Proportional scaling:** Typography scales predictably across breakpoints; base size and weight remain consistent

## 4. Component Stylings

### Buttons

#### Button / Primary Large
- **Background:** `#714B67` (Purple Heritage)
- **Text Color:** `#FFFFFF` (White)
- **Font Size:** `16px`
- **Font Weight:** `600`
- **Padding:** `12px 24px`
- **Border Radius:** `4px`
- **Border:** `1px solid #714B67`
- **Height:** `50px`
- **Line Height:** `24px`
- **Hover State:** Background `#5A3C52` (Purple Dark)
- **Active State:** Background `#65435C` (Purple Medium)
- **Disabled State:** Background `#B18AA7` (Lavender), Text `#FFFFFF` at 50% opacity

#### Button / Primary Small
- **Background:** `#714B67` (Purple Heritage)
- **Text Color:** `#FFFFFF` (White)
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Padding:** `8px 16px`
- **Border Radius:** `4px`
- **Border:** `1px solid #714B67`
- **Height:** `36px`
- **Line Height:** `18px`
- **Hover State:** Background `#5A3C52` (Purple Dark)

#### Button / Secondary Large
- **Background:** `#F3F4F6` (Pale Gray)
- **Text Color:** `#714B67` (Purple Heritage)
- **Font Size:** `16px`
- **Font Weight:** `600`
- **Padding:** `12px 24px`
- **Border Radius:** `4px`
- **Border:** `1px solid #F9F9F9`
- **Height:** `50px`
- **Line Height:** `24px`
- **Hover State:** Background `#FAFAFA` (Off-White), Text `#5A3C52`
- **Active State:** Background `#F9FAFB` (Off-White Light)

#### Button / Ghost
- **Background:** `transparent`
- **Text Color:** `#374151` (Neutral Charcoal)
- **Font Size:** `12px`
- **Font Weight:** `400`
- **Padding:** `0px 0px`
- **Border Radius:** `0px`
- **Border:** `none`
- **Height:** `auto`
- **Line Height:** `18px`
- **Hover State:** Text Color `#714B67`, text-decoration underline

### Links

#### Link / Standard
- **Background:** `transparent`
- **Text Color:** `#374151` (Neutral Charcoal)
- **Font Size:** `16px`
- **Font Weight:** `600`
- **Padding:** `0px 4px`
- **Border Radius:** `0px`
- **Border:** `none`
- **Line Height:** `24px`
- **Hover State:** Text Color `#714B67`, text-decoration underline
- **Active State:** Text Color `#5A3C52`

#### Link / Small Metadata
- **Background:** `transparent`
- **Text Color:** `#374151` (Neutral Charcoal)
- **Font Size:** `12px`
- **Font Weight:** `400`
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Line Height:** `18px`
- **Hover State:** Text Color `#017E84` (Teal Primary)

### Cards & Containers

#### Card / Default
- **Background:** `#FFFFFF` (White)
- **Border:** `1px solid #DEE2E6` (Border Light)
- **Border Radius:** `4px`
- **Padding:** `24px`
- **Box Shadow:** `rgba(0, 0, 0, 0.05) 0px 3px 6px 0px`
- **Hover State:** Box Shadow `rgba(0, 0, 0, 0.1) 0px 8px 16px 0px`

#### Container / Light Background
- **Background:** `#F9FAFB` (Off-White Light)
- **Border Radius:** `4px`
- **Padding:** `32px 40px`
- **Border:** `none`

#### Container / Section
- **Background:** `#FFFFFF` (White)
- **Padding:** `60px 40px`
- **Border Radius:** `0px`
- **Border Top:** `1px solid #DEE2E6`

### Inputs & Forms

#### Input / Text Default
- **Background:** `#FFFFFF` (White)
- **Text Color:** `#111827` (Deep Charcoal)
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Padding:** `12px 16px`
- **Border Radius:** `5px`
- **Border:** `1px solid #D8DADD` (Border Subtle)
- **Line Height:** `24px`
- **Placeholder Color:** `#9CA3AF` (Gray, 60% opacity)
- **Focus State:** Border `1px solid #714B67`, Box Shadow `0px 0px 0px 3px rgba(113, 75, 103, 0.1)`
- **Error State:** Border `1px solid #DC3545` (Error Red)

#### Input / Rounded
- **Background:** `#FFFFFF` (White)
- **Border Radius:** `32px`
- **Padding:** `12px 24px`
- **Border:** `1px solid #D8DADD` (Border Subtle)
- **Focus State:** Border `1px solid #714B67`

#### Input / Disabled
- **Background:** `#F3F4F6` (Pale Gray)
- **Text Color:** `#9CA3AF` (Gray, reduced contrast)
- **Border:** `1px solid #E5E7EB`
- **Cursor:** `not-allowed`

### Navigation

#### Navigation / Header
- **Background:** `#FFFFFF` (White)
- **Height:** `64px`
- **Padding:** `0px 40px`
- **Border Bottom:** `1px solid #DEE2E6` (Border Light)
- **Display:** `flex`
- **Align Items:** `center`
- **Justify Content:** `space-between`

#### Navigation / Link
- **Text Color:** `#374151` (Neutral Charcoal)
- **Font Size:** `14px`
- **Font Weight:** `600`
- **Padding:** `12px 16px`
- **Border Radius:** `4px`
- **Hover State:** Background `#F9FAFB` (Off-White Light), Text Color `#714B67`
- **Active State:** Background `#714B67`, Text Color `#FFFFFF`

### Badges

#### Badge / Success
- **Background:** `#28A745` (Success Green)
- **Text Color:** `#FFFFFF` (White)
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Padding:** `4px 12px`
- **Border Radius:** `4px`

#### Badge / Error
- **Background:** `#DC3545` (Error Red)
- **Text Color:** `#FFFFFF` (White)
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Padding:** `4px 12px`
- **Border Radius:** `4px`

#### Badge / Warning
- **Background:** `#FBB130` (Gold/Amber)
- **Text Color:** `#111827` (Deep Charcoal)
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Padding:** `4px 12px`
- **Border Radius:** `4px`

## 5. Layout Principles

### Spacing System
**Base Unit:** `4px`

**Scale:**
- `4px` — Micro spacing between inline elements
- `8px` — Minimal gap between small components
- `12px` — Small component padding
- `16px` — Standard component padding and small gaps
- `20px` — Medium spacing between related sections
- `24px` — Card and container padding
- `28px` — Medium section spacing
- `32px` — Large component padding
- `40px` — Horizontal container padding, major spacing
- `48px` — Large vertical spacing between major sections
- `60px` — Section-level vertical spacing
- `64px` — Extra-large padding for hero and primary containers

**Usage Context:**
- `4px–8px`: Inline icon-text spacing, button padding refinement
- `12px–16px`: Input padding, small card spacing, internal component padding
- `24px–32px`: Card padding, container internal spacing
- `40px–60px`: Section margins, horizontal container padding
- `64px`: Hero sections, primary container padding

### Grid & Container
- **Max Width:** `1280px` (desktop) with `40px` horizontal padding
- **Column Strategy:** 12-column grid system; components span 1–12 columns depending on breakpoint
- **Section Pattern:** Full-width sections with centered content containers
- **Horizontal Padding:** `40px` on desktop, `24px` on tablet, `16px` on mobile
- **Vertical Rhythm:** Sections separated by `60px` or `64px`

### Whitespace Philosophy
Odoo's design prioritizes breathing room and clarity. Generous whitespace between sections and components prevents cognitive overload in enterprise interfaces. Content is never crowded; information hierarchy is expressed through spacing as much as visual styling. Negative space acts as a design element, directing focus and allowing the eye to rest between dense sections.

### Border Radius Scale
- **0px:** Large containers, full-width sections, hero areas
- **4px:** Buttons, cards, inputs, small components—primary radius
- **5px:** Text inputs and form fields—subtle softness
- **9px:** Modal top corners (`9px 9px 0px 0px`) and bottom corners (`0px 0px 9px 9px`)
- **10px:** Large interactive elements and special components
- **32px:** Fully rounded inputs and pill-shaped elements

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (L0) | No shadow, `#FFFFFF` or neutral background | Primary content areas, sections |
| Raised (L1) | `rgba(0, 0, 0, 0.05) 0px 3px 6px 0px` | Cards, dropdowns, subtle elevation |
| Elevated (L2) | `rgba(0, 0, 0, 0.1) 0px 8px 16px 0px` | Modals, overlays, high-emphasis components, hover states on cards |
| Float (L3) | `rgba(0, 0, 0, 0.15) 0px 12px 24px 0px` | Tooltips, floating buttons, maximum prominence (inferred) |

**Shadow Philosophy:**
Odoo uses subtle shadows to establish hierarchy without creating visual noise. Shadows are reserved for elements that require elevation clarity (cards, dropdowns, modals). The shadow palette is minimal and refined, always using semi-transparent black with consistent blur and spread distances. Elevation progression is gradual; even maximum elevation shadows remain understated to maintain the clean, professional aesthetic.

## 7. Do's and Don'ts

### Do
- **Use Purple Heritage (`#714B67`) for all primary CTAs** — buttons, key links, and interactive elements
- **Maintain high contrast:** Pair `#111827` (Deep Charcoal) text on `#FFFFFF` (White) backgrounds for WCAG AA compliance
- **Apply subtle shadows only on hover or elevated states** — keep flat designs clean
- **Use Inter weight progression:** 300 for large body text, 400 for regular body, 600 for headings and buttons, 700 for emphasis
- **Space components generously:** Minimum `16px` padding within cards, `40px` horizontal container padding
- **Implement rounded corners consistently:** Use `4px` for buttons and inputs, `0px` for sections
- **Reserve teal accents (`#017E84`, `#00A09D`) for secondary interactive elements** and icons
- **Use semantic status colors appropriately:** Green for success, Red for errors, Amber for warnings
- **Employ Caveat font sparingly** — only for display headlines and brand emphasis to preserve professionalism
- **Scale typography predictably** — scale size in increments (12px, 14px, 16px, 24px) rather than arbitrary values

### Don't
- **Don't use purple (`#714B67`) for body text or secondary content** — reserve it for primary interactions
- **Don't pair light neutrals on white backgrounds without borders** — ensure visual distinction
- **Don't exceed two shadow levels in a single view** — excessive elevation confuses hierarchy
- **Don't apply border radius larger than `10px` except for pill inputs** — maintain the modern, controlled aesthetic
- **Don't mix font families within a single component** — Inter for content, Caveat only for display
- **Don't use line heights below `1.5x` font size** — maintain readability in enterprise contexts
- **Don't place text directly on dark backgrounds without sufficient contrast** — test all combinations
- **Don't overuse the gold/amber accent (`#FBB130`)** — reserve it for high-priority CTAs and highlights
- **Don't nest more than three levels of component elevation** — keep depth hierarchies clear
- **Don't apply custom colors not defined in this palette** — maintain visual consistency

## 8. Responsive Behavior

### Breakpoints

| Breakpoint Name | Width | Key Changes |
|-----------------|-------|-------------|
| Mobile | 320px–640px | Single column, `16px` horizontal padding, `24px` vertical spacing |
| Tablet | 641px–1024px | 2–6 columns, `24px` horizontal padding, `40px` vertical spacing |
| Desktop | 1025px–1280px | Full 12-column grid, `40px` horizontal padding, `60px` vertical spacing |
| Wide | 1281px+ | Max-width container `1280px` centered, maintain `40px` padding |

### Touch Targets
- **Minimum Height:** `48px` for all interactive elements (buttons, links, inputs)
- **Minimum Width:** `48px` for buttons and icon buttons
- **Spacing Between Targets:** Minimum `8px` between adjacent touch-interactive elements
- **Small Text Links:** `44px` height minimum with padding when font size is `12px` or `14px`

### Collapsing Strategy
- **Navigation:** Header becomes hamburger menu below `768px`; navigation items stack vertically
- **Containers:** Horizontal padding reduces from `40px` (desktop) → `24px` (tablet) → `16px` (mobile)
- **Grid:** 12-column desktop grid collapses to 6 columns on tablet, single column on mobile
- **Typography:** Display headlines (Caveat) reduce in size by ~20% on tablet, ~40% on mobile
- **Cards:** Cards maintain `24px` padding but span full width; grid gaps reduce from `24px` → `16px` → `12px`
- **Buttons:** Full-width buttons on mobile (`width: 100%`), aligned horizontally on tablet/desktop
- **Sections:** Vertical spacing reduces from `60px` (desktop) → `40px` (tablet) → `24px` (mobile)

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Purple Heritage (`#714B67`)
- **Secondary CTA:** Secondary Large Button (`#F3F4F6` background, `#714B67` text)
- **Background/Surface:** White (`#FFFFFF`)
- **Subtle Background:** Off-White Light (`#F9FAFB`)
- **Heading Text:** Deep Charcoal (`#111827`)
- **Body Text:** Neutral Charcoal (`#374151`)
- **Link Text:** Neutral Charcoal (`#374151`), hover to Purple (`#714B67`)
- **Secondary Accent:** Teal Primary (`#017E84`)
- **Success Status:** Success Green (`#28A745`)
- **Error Status:** Error Red (`#DC3545`)
- **Warning Status:** Warning Amber (`#FBB130`)
- **Border/Divider:** Border Light (`#DEE2E6`)
- **Disabled State:** Lavender (`#B18AA7`)

### Iteration Guide
1. **All primary buttons use `#714B67` background with `#FFFFFF` text**, `12px 24px` padding, `4px` border radius, `50px` height (large) or `36px` (small)
2. **All body text uses Inter 400 weight at `16px` size with `24px` line height**, color `#374151`; headings use 600–700 weight
3. **All card containers have `#FFFFFF` background, `#DEE2E6` border, `4px` radius, `24px` padding, and subtle shadow `rgba(0, 0, 0, 0.05) 0px 3px 6px 0px`**
4. **All inputs use `#FFFFFF` background, `#D8DADD` border, `5px` radius, `12px 16px` padding; focus state adds `#714B67` border and `rgba(113, 75, 103, 0.1)` glow**
5. **All form labels use Inter 600 weight at `14px` size, color `#111827`; helper text uses 400 weight at `12px`, color `#6B7280`**
6. **Spacing within components:** Minimum `8px` between elements; `16px` between related groups; `24px+` between major sections
7. **Display headlines use Caveat 700 weight** at `88px` (H1), `64px` (H2), `76px` (H6); reserve for hero and primary messaging only
8. **Navigation links are `14px` Inter 600 weight, color `#374151`; hover adds `#F9FAFB` background; active state uses `#714B67` background with `#FFFFFF` text**
9. **All interactive elements have hover state:** buttons darken by 1–2 shades, cards lift shadow, links underline or change color to `#714B67`
10. **Responsive breakpoints:** Desktop `≥1025px` with `40px` padding; Tablet `641px–1024px` with `24px` padding; Mobile `≤640px` with `16px` padding and single-column layout