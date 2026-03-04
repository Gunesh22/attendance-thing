---
name: google-official-seo-guide
description: Official Google SEO guide covering search optimization, structured data, technical SEO, and best practices.
---

# Google Official SEO Guide

## When to Use This Skill
This skill should be triggered when users ask about:

### SEO & Search Optimization
- Improving website ranking in Google Search
- Implementing SEO best practices
- Optimizing meta tags, titles, and descriptions
- Fixing crawling or indexing issues
- Understanding how Google Search works

### Structured Data & Rich Results
- Adding VideoObject, BroadcastEvent, or Clip structured data
- Implementing schema.org markup for rich results
- Creating sitemaps and robots.txt files
- Setting up breadcrumb navigation
- Configuring hreflang for multi-language sites

### Technical SEO
- Mobile-first indexing optimization
- JavaScript SEO and rendering issues
- Managing duplicate content with canonical tags
- Configuring robots meta tags
- URL structure and internal linking

### Search Console & Monitoring
- Using Google Search Console reports
- Debugging search visibility issues
- Monitoring crawl errors and indexing status
- Analyzing search performance metrics

### Content & Links
- Writing effective anchor text
- Internal and external linking strategies
- Avoiding spam policies violations
- Managing site migrations and redirects

## Key Concepts

### The Three Stages of Google Search
1. Crawling: Googlebot discovers and fetches pages from the web
2. Indexing: Google analyzes page content and stores it in the index
3. Serving: Google returns relevant results for user queries

### Important SEO Principles
- Mobile-First Indexing: Google primarily uses the mobile version of content for indexing and ranking
- Canonical URLs: Specify the preferred version of duplicate or similar pages
- Structured Data: Use schema.org markup to help Google understand your content
- Search Essentials: Technical, content, and spam requirements for Google Search eligibility

### Common Structured Data Types
- VideoObject: For video content and features
- BroadcastEvent: For livestream videos (LIVE badge)
- Clip: For video key moments/timestamps
- SeekToAction: For auto-detected key moments in videos

## Quick Reference

### Example 1: Basic VideoObject Structured Data
`json
{ "@context": "https://schema.org", "@type": "VideoObject", "name": "Video title", "description": "Video description", "thumbnailUrl": [ "https://example.com/photos/1x1/photo.jpg", "https://example.com/photos/4x3/photo.jpg", "https://example.com/photos/16x9/photo.jpg" ], "uploadDate": "2024-03-31T08:00:00+08:00", "duration": "PT1M54S", "contentUrl": "https://example.com/video.mp4", "embedUrl": "https://example.com/embed/123" }
`
Use this for: Adding basic video metadata to help Google understand and display your videos in search results.

### Example 2: LIVE Badge with BroadcastEvent
`json
{ "@context": "https://schema.org", "@type": "VideoObject", "name": "Livestream title", "uploadDate": "2024-10-27T14:00:00+00:00", "publication": { "@type": "BroadcastEvent", "isLiveBroadcast": true, "startDate": "2024-10-27T14:00:00+00:00", "endDate": "2024-10-27T14:37:14+00:00" } }
`
Use this for: Enabling the LIVE badge on livestream videos in Google Search results.

### Example 3: Video Key Moments with Clip
`json
{ "@context": "https://schema.org", "@type": "VideoObject", "name": "Cat video", "hasPart": [ { "@type": "Clip", "name": "Cat jumps", "startOffset": 30, "endOffset": 45, "url": "https://example.com/video?t=30" }, { "@type": "Clip", "name": "Cat misses the fence", "startOffset": 111, "endOffset": 150, "url": "https://example.com/video?t=111" } ] }
`
Use this for: Manually specifying important timestamps/chapters in your video for the key moments feature.

### Example 5: Crawlable Links
`html
<!-- Recommended: Google can crawl these --> <a href="https://example.com">Link text</a> <a href="/products/category/shoes">Link text</a> <a href="./products/category/shoes">Link text</a> <!-- Not recommended: May not be crawled --> <a routerLink="products/category">Link text</a> <a onclick="goto('https://example.com')">Link text</a> <span href="https://example.com">Link text</span>
`
Use this for: Ensuring your links are discoverable and crawlable by Googlebot.

### Example 7: robots meta tags
`html
<!-- Don't index this page --> <meta name="robots" content="noindex"> <!-- Don't follow links on this page --> <meta name="robots" content="nofollow"> <!-- Don't index and don't follow --> <meta name="robots" content="noindex, nofollow"> <!-- Don't show snippet in search results --> <meta name="robots" content="nosnippet">
`
Use this for: Controlling how Google crawls and indexes specific pages.

## Working with This Skill

### For Beginners
Start with fundamentals to understand:
- How Google Search works (crawling â†’ indexing â†’ serving)
- Basic SEO principles
- Search Essentials requirements

### For Web Developers
Priority reading:
1. fundamentals: Understand the technical foundation
2. crawling: Optimize Googlebot access and crawl efficiency
3. indexing: Implement proper meta tags and redirects
4. specialty: Add structured data for rich features

## Common Pitfalls to Avoid

### Spam Policy Violations
- âŒ Keyword stuffing in content or meta tags
- âŒ Hidden text or links
- âŒ Buying/selling links for ranking
- âŒ Cloaking (showing different content to Google vs users)

### Mobile-First Indexing Issues
- âŒ Different content on mobile vs desktop
- âŒ Blocking resources on mobile
- âŒ Missing structured data on mobile

### Structured Data Mistakes
- âŒ Using unsupported formats or properties
- âŒ Missing required fields
- âŒ Different URLs in mobile vs desktop markup

## Tips & Best Practices

### SEO Fundamentals
1. Create unique, descriptive titles and meta descriptions for each page
2. Use meaningful heading structure (H1, H2, H3)
3. Optimize images with descriptive alt text
4. Ensure fast page load times (especially on mobile)
5. Build a logical site structure with clear navigation

### Technical SEO
1. Submit and maintain an XML sitemap
2. Use robots.txt appropriately (crawl control, not indexing control)
3. Implement canonical tags for duplicate content
4. Use HTTPS for security
5. Ensure mobile-friendliness (responsive design recommended)

### Content Strategy
1. Focus on creating helpful, people-first content
2. Match user intent with your content
3. Keep content fresh and up-to-date
4. Use natural language, avoid keyword stuffing
5. Build internal links with descriptive anchor text
