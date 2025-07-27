import { supabase } from '../lib/supabase';

export interface ListingPWAConfig {
  listingId: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  images: string[];
  agentName: string;
  agentEmail: string;
}

export const pwaService = {
  // Generate dynamic manifest for a specific listing
  generateListingManifest(listing: ListingPWAConfig) {
    const appName = `${listing.address} - HomeListingAI`;
    const shortName = listing.address.split(' ')[0] + ' ' + listing.address.split(' ')[1];
    
    return {
      name: appName,
      short_name: shortName,
      description: `${listing.bedrooms} bed, ${listing.bathrooms} bath home for ${listing.price} - ${listing.squareFeet} sq ft`,
      start_url: `/listing/${listing.listingId}`,
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#3b82f6",
      orientation: "portrait-primary",
      icons: [
        {
          src: listing.images[0] || "/new hlailogo.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: listing.images[0] || "/new hlailogo.png", 
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ],
      categories: ["real estate", "property", "home"],
      lang: "en",
      dir: "ltr"
    };
  },

  // Create install prompt for a listing
  async createListingInstallPrompt(listing: ListingPWAConfig) {
    const manifest = this.generateListingManifest(listing);
    
    // Store manifest in localStorage for this listing
    localStorage.setItem(`listing-manifest-${listing.listingId}`, JSON.stringify(manifest));
    
    // Create custom event for install prompt
    const event = new CustomEvent('listing-install-prompt', {
      detail: {
        listing,
        manifest
      }
    });
    
    window.dispatchEvent(event);
  },

  // Get listing-specific install instructions
  getListingInstallInstructions(listing: ListingPWAConfig, deviceType: 'mobile' | 'desktop', browserType: 'safari' | 'chrome' | 'other') {
    const appName = `${listing.address} - HomeListingAI`;
    
    if (deviceType === 'mobile') {
      if (browserType === 'safari') {
        return {
          title: `Install ${appName} (iOS)`,
          steps: [
            'Tap the Share button (square with arrow up)',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to confirm',
            `Your ${appName} app will now appear on your home screen!`
          ]
        };
      } else {
        return {
          title: `Install ${appName} (Android)`,
          steps: [
            'Tap the menu button (three dots)',
            'Select "Add to Home screen" or "Install app"',
            'Tap "Add" or "Install" to confirm',
            `Your ${appName} app will now appear on your home screen!`
          ]
        };
      }
    } else {
      return {
        title: `Install ${appName} (Desktop)`,
        steps: [
          'Look for the install button in your browser address bar',
          'Click the install button (usually looks like a download icon)',
          'Click "Install" in the popup that appears',
          `Your ${appName} app will now open in its own window!`
        ]
      };
    }
  },

  // Generate listing-specific meta tags
  generateListingMetaTags(listing: ListingPWAConfig) {
    return {
      title: `${listing.address} - ${listing.price} | HomeListingAI`,
      description: `${listing.bedrooms} bed, ${listing.bathrooms} bath home for ${listing.price}. ${listing.squareFeet} sq ft. Contact ${listing.agentName} for details.`,
      image: listing.images[0] || "/og-image.png",
      url: `${window.location.origin}/listing/${listing.listingId}`
    };
  }
}; 