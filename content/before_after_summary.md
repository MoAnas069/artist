# BEFORE / AFTER SUMMARY: Chintwo Portfolio Redesign

**Project:** Chintwo — Visual Artist & Illustrator Portfolio  
**Deliverable:** Comparative Analysis of Changes and Design Rationale  

---

## 1. High-Level Transformation Overview

| Domain | Before Redesign | After Redesign ("The Dusk Gallery") | Strategic Rationale |
| :--- | :--- | :--- | :--- |
| **Atmospheric Mood** | Stark white/ivory catalog background. Flattened chiaroscuro and reduced dramatic contrast. | Warm obsidian dusk base (`#0B0A09`) with interactive amber lantern illumination (`#DF9B52`). | Chintwo’s art explores "atmospheric worlds, memory, and myth through textured brushwork and quiet light." A dusk gallery setting allows the paintings to hold and emit light naturally. |
| **Hero Experience** | Standard banner or text block with static thumbnail. | Full-viewport hero texture crop with refined typography, 1.04 to 1 slow entrance scale, and authentic artist descriptor. | Creates an immediate cinematic threshold into the artist's world without template gimmicks or loud animations. |
| **Artist Statement** | Hidden inside sub-pages or buried in footer text. | Set prominently directly after the hero in a refined serif beside generous negative space. | Centers the artist's authentic philosophy early in the narrative scroll. |
| **Artwork Presentation** | Rigid, uniform card grid. All pieces felt identically sized regardless of original medium or aspect ratio. | Asymmetrical curated salon layout with hover reveals of title, year, and medium. | Emulates a curated museum salon where each piece has intentional breathing room and rhythm. |
| **Series Exploration** | Generic category dropdown or tab filter. | Numbered editorial rows (`01`, `02`, `03`, `04`) with theme descriptors and desktop hover image previews (mobile stacked cards). | Gives structure to the narrative cycles (Cartography, Solitudes, Coastal Stillness) and encourages deep viewing. |
| **Materiality & Tactility** | Only low-res web thumbnails; brush textures and paper grain were invisible. | Full-bleed macro crop of dry-brush gouache and charcoal wash on 300gsm cold-pressed cotton rag with curatorial caption. | Visual storytelling emphasizing physical craftsmanship, Japanese hake brushes, and raw umber washes. |
| **Collector Path** | No framing previews or cart; disconnected from collector desires. | Live custom framing selector (Solid Walnut, Black Oak, White Ash), Collector Folio cart drawer, and direct studio reservation fallback. | Provides high-net-worth collectors a clear, tactile path to acquire prints or commission original works. |
| **Navigation & Chrome** | Heavy text chrome (`01 WORK`, `02 PERSON`). | Minimalist header with ambient dusk sound toggle, daylight mode switch, and full-screen mobile menu. | Keeps attention strictly on the artwork while providing intuitive mobile ergonomics. |

---

## 2. Information Architecture Evolution

```
[BEFORE]
/
├── Home (generic blocks)
├── Work (flat grid)
├── Me (About)
└── Shop (simple list)

[AFTER - THE DUSK GALLERY]
/
├── / (Home: 1. Hero -> 2. Statement -> 3. Selected Works -> 4. Series Rows -> 5. Macro Texture -> 6. Inquiry CTA -> 7. Footer)
├── /works (Complete salon archive with series filters & constellation threads)
├── /works/:series (Dedicated series cycle with intro & masonry gallery)
├── /works/:series/:work & /work/:slug (Deep zoomable canvas, provenance, inquiry pre-fill)
├── /prints & /editions (Collector prints with custom framing selector & slideout cart)
├── /about (Authentic artist statement, long bio, studio practice, selected clients, exhibitions CV)
├── /contact (Calm inquiry form with auto-filled work reference)
└── /journal (Studio process essays on chiaroscuro and monoprint synthesis)
```

---

## 3. Performance & Accessibility Upgrades

1. **Accessibility (WCAG AA):**
   - High-contrast warm bone text (`#EDE6D9`) on dark dusk background (`#0B0A09`).
   - Accessible keyboard-controlled lightbox with `Esc`, `ArrowLeft`, `ArrowRight`, `+`, `-`.
   - Complete ARIA attributes, semantic landmarks, and skip-to-content structure.
   - `prefers-reduced-motion` compliance across all breathing and scroll effects.

2. **Engineering Efficiency:**
   - Pure Web Audio API synthesized dusk tone (0 bytes of external MP3 assets to fail or lag).
   - Zero-layout-shift image aspect ratios with responsive dimensions.
   - Clean, modular Next/React component hierarchy.
