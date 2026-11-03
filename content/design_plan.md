# CONCEPT & DESIGN PLAN: "The Dusk Gallery"

## 1. Design Concept & Philosophy
**"The Dusk Gallery"** places the visitor in a quiet, twilight exhibition room where darkness is not absence of color, but the very medium that allows Chintwo's paintings to radiate. The artworks hold the light, and the visitor’s own presence illuminates the physical textures of oil, gouache, and monoprint grain.

---

## 2. Palette System (Derived Directly from Artworks)

Chintwo's work is grounded in chiaroscuro, raw umber, Payne’s grey, and ember lantern points.

| Token | Hex / HSL | Origin & Artistic Role |
| :--- | :--- | :--- |
| `--bg-dusk` | `#0B0A09` | Deep obsidian umber — the hush of an exhibition hall after sunset. |
| `--surface-dusk` | `#141210` | Elevated gallery wall / shadow surface. |
| `--lantern-gold` | `#DF9B52` | Warm amber lantern light extracted from *Nocturne for Two Solitudes*. |
| `--lantern-glow` | `rgba(223, 155, 82, 0.18)` | Soft diffused pool following visitor cursor. |
| `--paynes-grey` | `#2D3942` | Cool twilight mist extracted from *Arrival in the Cold Mist*. |
| `--linen-bone` | `#EDE6D9` | Japanese washi and archival cotton rag extracted from *The Silent Hour*. |
| `--text-muted` | `#968F85` | Quiet gallery wall labels and small caps notation. |
| `--border-dusk` | `rgba(237, 230, 217, 0.10)` | Minimal gallery lineation. |

*Optional Daylight Restraint:* Supports a toggled daylight mode (`--bg-daylight: #F4EFE6`, `--text-daylight: #181614`) for high-glare environments, preserving artwork contrast.

---

## 3. Typography Hierarchy & Pairings

We establish an editorial typographic voice tailored to fine art:
- **Display Serif:** **Cormorant Garamond** & **Instrument Serif** (Monumental hero title, expressive italics, quote statements).
- **Grotesque UI & Notation:** **Inter** (Optical size adjusted, set in crisp small-caps with `letter-spacing: 0.18em` to `0.24em`).
- **Archive / Series Numbers:** **Space Mono** (`01`, `02`, dimensions, edition counts, years).

---

## 4. Information Architecture & Sitemap

```
├── /                    Home: "The Dusk Gallery"
│   ├── 01 Threshold     Monumental name, lantern cursor, hero artwork, enter prompt
│   ├── 02 The Rooms     Artwork IS the navigation (asymmetrical doorway tiles 01–04)
│   ├── 03 Statement     Real artist words in large serif with negative space
│   ├── 04 Macro Moment  Full-bleed close-up crop of paper/brushwork texture
│   ├── 05 Prints Drift  Horizontal curation of limited editions + "Reserve this print"
│   ├── 06 Inquiry Call  Warm invitation for commissions & acquisitions
│   └── 07 Footer        Minimal copyright, studio email, Instagram
├── /works               Salon-style series hang, filters, constellation threads & zoom lightbox
├── /works/:series       Dedicated series salon view
├── /work/:slug          Work detail: zoomable canvas, provenance, inquiry prefill, related myth threads
├── /prints              Prints & Editions shop with framing selector & slideout Cart Drawer
├── /about               Artist portrait, philosophy, studio practice, clients, exhibition CV
├── /contact             Calm inquiry form (pre-populates with referenced artwork)
└── /journal             Studio process notes & philosophical essays (/journal/:slug)
```

---

## 5. Signature Interaction Specifications

1. **Lantern Cursor & Shader Reveal:**
   - Coordinates `(x, y)` track the cursor with a spring-smoothed lag (`0.12`).
   - Radial illumination overlay (`radial-gradient(circle 380px at x y, rgba(223,155,82,0.18), transparent 75%)`) reveals texture details and relief on artwork frames.
   - On touch/mobile: shifts to a slow auto-drifting ambient glow with gyroscope tilt interaction if permitted.
   - Pauses on document blur / hidden tab and respects `prefers-reduced-motion`.

2. **"Enter the Painting" Transition:**
   - Clicking an artwork tile triggers an expansion transition (`layoutId` shared-element animation). The image smoothly scales and occupies the viewport canvas, eliminating jarring page cuts.

3. **Breathing Images:**
   - Featured works execute a slow breathing oscillation: scale `1.000` to `1.028` over a 22-second cycle with subtle contrast drift, recreating the illusion of wet paint under dusk gallery lighting.

4. **Memory / Myth Threads:**
   - Interactive SVG constellation lines connecting pieces that share thematic, narrative, or pigment relationships (`/content/threads.json`). Hovering an artwork highlights its constellation thread.

5. **Monumental Typographic Hero:**
   - The artist's name is set at monumental scale behind and between layered artwork planes. As the visitor scrolls, the letters catch the lantern light and emerge from shadow.

6. **Procedural Atmospheric Sound (Optional, Muted by Default):**
   - Built with native browser **Web Audio API** (no external audio files to fail or lag). Produces an ultra-warm, low-frequency 55Hz dusk tone with filtered pink noise and gentle binaural detuning. Requires explicit user click to unmute.

---

## 6. What Was Borrowed vs. What Was Invented

| Feature | Reference Principle Borrowed | What Was Invented Specifically for Chintwo |
| :--- | :--- | :--- |
| **Hero** | *Artonaut:* Bold typography interacting with imagery. | **Invented:** Monumental dusk reveal where letters catch the visitor's lantern light, layered between foreground brushwork and deep shadow. |
| **Navigation** | *Owen Gent:* Artwork acts as navigation. | **Invented:** "The Rooms" — an asymmetrical gallery wall with interactive illuminated doorways, numbered series badges, and shared-element zoom into the space. |
| **Rhythm** | *Artonaut:* Scroll alternating full-bleed with quiet negative space. | **Invented:** Macro brushwork crop section celebrating tactile paper grain, dry-brush gouache, and monoprint ink viscosity. |
| **Shop Route** | *Owen Gent:* Clear route to limited prints. | **Invented:** Slideout collector cart with real-time custom framing preview (American Walnut, Black Oak, White Ash), edition counter badges, and inquiry fallback. |
| **Interconnection** | *None (Reference lack)* | **Invented:** "Memory/Myth Threads" — dynamic constellation map connecting works across pigments and literary themes. |
| **Atmosphere** | *None (Both references use flat lighting)* | **Invented:** Procedural Web Audio dusk tone + interactive lantern illumination revealing brush relief under the visitor's cursor. |
