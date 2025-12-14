import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  canonical?: string;
}

const defaultSEO = {
  title: 'Cravings Delight - Authentic African Cuisine | Soup & Meal Bowls | Hull, UK',
  description: 'Order authentic African cuisine in Hull. Jollof rice, Efo Riro, Peppersoup, and more. Available in 2L & 3L bowls or full coolers. Catering services for events. 3-5 day delivery.',
  keywords: 'African cuisine Hull, Nigerian food UK, Jollof rice delivery, African catering Hull, Efo Riro, Peppersoup, African restaurant Hull',
  image: 'https://cravingsdelight.com/cravings delight logo.png',
  type: 'website'
};

export function SEOHead({ 
  title, 
  description, 
  keywords, 
  image, 
  type = 'website',
  canonical 
}: SEOHeadProps) {
  const location = useLocation();
  
  const seoTitle = title || defaultSEO.title;
  const seoDescription = description || defaultSEO.description;
  const seoKeywords = keywords || defaultSEO.keywords;
  const seoImage = image || defaultSEO.image;
  const seoCanonical = canonical || `https://cravingsdelight.com${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = seoTitle;

    // Update meta tags
    updateMetaTag('name', 'description', seoDescription);
    updateMetaTag('name', 'keywords', seoKeywords);
    updateMetaTag('property', 'og:title', seoTitle);
    updateMetaTag('property', 'og:description', seoDescription);
    updateMetaTag('property', 'og:image', seoImage);
    updateMetaTag('property', 'og:url', seoCanonical);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('name', 'twitter:title', seoTitle);
    updateMetaTag('name', 'twitter:description', seoDescription);
    updateMetaTag('name', 'twitter:image', seoImage);

    // Update canonical
    updateCanonical(seoCanonical);
  }, [seoTitle, seoDescription, seoKeywords, seoImage, seoCanonical, type]);

  return null;
}

function updateMetaTag(attr: string, key: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}
