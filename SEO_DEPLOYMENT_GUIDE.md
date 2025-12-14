# SEO Deployment Guide - Cravings Delight

## ✅ SEO Optimizations Completed

### 1. Meta Tags & Open Graph
- **Primary meta tags**: Title, description, keywords
- **Open Graph**: Facebook sharing optimized
- **Twitter Cards**: Twitter sharing optimized
- **Image tags**: Logo used as social share image
- **Geo tags**: Hull, UK location specified
- **Business tags**: Contact and location data

### 2. Structured Data (JSON-LD)
- **Restaurant Schema**: Full business details
- **LocalBusiness Schema**: Location and services
- **WebSite Schema**: Search functionality
- **Ratings**: Aggregate rating included

### 3. Technical SEO
- **Sitemap.xml**: All pages indexed with priorities
- **Robots.txt**: Proper crawl rules, admin blocked
- **Canonical URLs**: Duplicate content prevention
- **.htaccess**: cPanel ready with redirects
- **Manifest.json**: PWA support for mobile

### 4. Page-Specific SEO
- **Homepage**: Default optimized tags
- **Menu**: Food-specific keywords
- **Catering**: Event catering keywords
- **About**: Brand story keywords
- **Contact**: Contact-specific keywords

### 5. Performance & Security
- **GZIP Compression**: Enabled
- **Browser Caching**: 1 year for assets
- **HTTPS Redirect**: Force SSL
- **Security Headers**: XSS, clickjacking protection
- **Image Hotlink Protection**: Bandwidth saving

## 📋 cPanel Deployment Steps

### Step 1: Upload Files
1. Login to cPanel
2. Go to **File Manager**
3. Navigate to `public_html` (or your domain folder)
4. Upload ALL files from your build:
   ```
   - index.html
   - assets/ (folder)
   - cravings delight logo.png
   - favicon.ico
   - sitemap.xml
   - robots.txt
   - manifest.json
   - .htaccess
   ```

### Step 2: Build Your Project First
Before uploading, run:
```bash
npm run build
```
This creates a `dist/` folder. Upload contents of `dist/` to cPanel.

### Step 3: Configure Domain
1. In cPanel, go to **Domains**
2. Set your domain to point to the upload folder
3. Ensure SSL certificate is installed (Let's Encrypt free)

### Step 4: Verify .htaccess
1. Check `.htaccess` is in root folder
2. Test HTTPS redirect works
3. Test that `/menu` and `/about` routes work

### Step 5: Update URLs in Code
Replace `https://cravingsdelight.com` with your actual domain in:
- `index.html` (all meta tags)
- `sitemap.xml` (all URLs)
- `.htaccess` (hotlink protection)

### Step 6: Submit to Search Engines

#### Google Search Console
1. Go to https://search.google.com/search-console
2. Add your property (domain)
3. Verify ownership (HTML file or DNS)
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

#### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add your site
3. Verify ownership
4. Submit sitemap

### Step 7: Test SEO

#### Meta Tags Test
- https://www.opengraph.xyz/
- https://cards-dev.twitter.com/validator

#### Mobile Friendly Test
- https://search.google.com/test/mobile-friendly

#### Page Speed Test
- https://pagespeed.web.dev/

#### Structured Data Test
- https://search.google.com/test/rich-results

## 🎯 SEO Priority Keywords

### Primary Keywords
- African cuisine Hull
- Nigerian food UK
- Jollof rice delivery
- African catering Hull

### Secondary Keywords
- Efo Riro Hull
- Peppersoup delivery
- African restaurant Hull
- Nigerian restaurant UK
- West African food

### Long-tail Keywords
- Authentic African food delivery Hull
- Nigerian catering services UK
- Order Jollof rice online Hull
- African meal bowls delivery

## 📊 Expected SEO Results

### Week 1-2
- Site indexed by Google
- Basic keyword rankings start

### Month 1
- Local search visibility
- "African food Hull" rankings

### Month 2-3
- Top 10 for local keywords
- Increased organic traffic

### Month 6+
- Dominant local presence
- High conversion rates

## 🔧 Ongoing SEO Maintenance

### Weekly
- Monitor Google Search Console
- Check for crawl errors
- Review search queries

### Monthly
- Update sitemap if new pages added
- Check page speed scores
- Review keyword rankings
- Add new content/blog posts

### Quarterly
- Audit backlinks
- Update meta descriptions
- Refresh content
- Check competitor rankings

## 📱 Social Media Integration

### Update These Handles
In `index.html`, update:
```html
<meta name="twitter:site" content="@yourhandle" />
```

In JSON-LD schema, update:
```json
"sameAs": [
  "https://www.facebook.com/yourpage",
  "https://www.instagram.com/yourhandle",
  "https://twitter.com/yourhandle"
]
```

## 🌟 Pro SEO Tips

1. **Get Reviews**: Encourage Google reviews for local SEO
2. **Local Citations**: List on Yelp, TripAdvisor, etc.
3. **Backlinks**: Partner with local food bloggers
4. **Content**: Add blog with African food recipes
5. **Images**: Use descriptive alt tags (already done)
6. **Speed**: Optimize images, use WebP format
7. **Mobile**: Site is already mobile-responsive
8. **Schema**: Rich snippets already implemented

## 🚨 Important Notes

1. **Update Phone Number**: Replace `+44-XXX-XXX-XXXX` in `index.html` with real number
2. **Update Address**: Add specific street address if available
3. **Update Hours**: Modify opening hours in JSON-LD schema
4. **Update Domain**: Replace all `cravingsdelight.com` with your actual domain
5. **SSL Required**: HTTPS is mandatory for good SEO

## ✅ SEO Checklist

- [ ] Build project (`npm run build`)
- [ ] Upload to cPanel
- [ ] Update domain URLs in files
- [ ] Update phone number
- [ ] Update social media handles
- [ ] Install SSL certificate
- [ ] Test HTTPS redirect
- [ ] Test all routes work
- [ ] Submit sitemap to Google
- [ ] Submit sitemap to Bing
- [ ] Test Open Graph tags
- [ ] Test Twitter Cards
- [ ] Test mobile responsiveness
- [ ] Test page speed
- [ ] Set up Google Analytics (optional)
- [ ] Set up Google Search Console
- [ ] Request Google reviews
- [ ] Create Google Business Profile

## 🎉 Your Site is SEO Ready!

All technical SEO is complete. Focus on:
1. Quality content
2. Customer reviews
3. Social media presence
4. Local partnerships
5. Regular updates

Good luck with your launch! 🚀
