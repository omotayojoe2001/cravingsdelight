# Logo & Branding Setup

## Files to Replace

### 1. Site Icon/Favicon
**Location:** `public/cravings-delight-logo.svg`
- Current: Placeholder SVG with "CD" text
- Replace with: Your actual Cravings Delight logo in SVG format
- Recommended: Simple, recognizable design that works at small sizes

### 2. Apple Touch Icon
**Location:** `public/cravings-delight-logo.png`
- Current: Placeholder text file
- Replace with: PNG version of your logo
- Size: 512x512px (will be scaled down automatically)
- Format: PNG with transparent background

### 3. Social Media Image (Open Graph)
**Location:** `public/og-image.jpg`
- Current: Not created yet
- Create: A banner image for social media sharing
- Size: 1200x630px
- Should include:
  - Cravings Delight logo
  - Tagline or key message
  - Food imagery
  - Contact info (optional)

## Current Branding

### Colors (from design system)
- **Wine Red:** #7C2D3A (Primary brand color)
- **Golden Yellow:** #D4AF37 (Secondary accent)
- **Cream:** #F5F1E8 (Background)

### Typography
- **Display Font:** Playfair Display (headings)
- **Body Font:** Inter (text)

## Quick Setup Steps

1. **Create your logo files:**
   - Design logo in vector format
   - Export as SVG for favicon
   - Export as PNG (512x512) for app icon
   - Create social media banner (1200x630)

2. **Replace placeholder files:**
   ```
   public/
   ├── cravings-delight-logo.svg  (replace)
   ├── cravings-delight-logo.png  (replace)
   └── og-image.jpg               (add new)
   ```

3. **Test:**
   - Check favicon appears in browser tab
   - Test social media preview using Facebook Debugger or Twitter Card Validator
   - Verify logo displays correctly on mobile devices

## Social Media Preview

The site is configured with:
- **Title:** Cravings Delight - Authentic African Cuisine | Hull, UK
- **Description:** Order Jollof rice, Efo Riro, Peppersoup & more. 2L/3L bowls & coolers available.
- **Twitter:** @cravings_delighthull
- **Email:** cravingsdelight2025@gmail.com

When you share the site on social media, it will display your og-image.jpg with this information.
