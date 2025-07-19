// Manual listing creation script - run this in browser console
console.log('🚀 Creating your Cashmere listing...');

// Store the scraped data in localStorage
const scrapedData = {
  "address": "951 Willems Road, Cashmere, WA 98815",
  "price": "$2,995,000",
  "bedrooms": 2,
  "bathrooms": 4,
  "squareFeet": 3198,
  "description": "Stunning mountain home with indoor lap pool, mountain views, red fir hardwoods, primary bedroom on main floor, custom made doors, walk-in pantry, and custom birch cabinetry.",
  "features": ["Indoor lap pool", "Mountain views", "Red fir hardwoods", "Primary on main floor", "Custom made doors", "Walk-in pantry", "Custom birch cabinetry"],
  "neighborhood": "Cashmere, WA",
  "images": [
    "https://photos.zillowstatic.com/fp/dd393793aadbca37b7ce9ec56b06dc22-cc_ft_960.jpg",
    "https://photos.zillowstatic.com/fp/f9d1b84b3a95a7172efd8c997e6926cb-cc_ft_576.jpg",
    "https://photos.zillowstatic.com/fp/f241f3070fffeaac4f563bee2e3cdb65-cc_ft_576.jpg",
    "https://photos.zillowstatic.com/fp/10fc5a00e5289c1200a5eb6cb250ef4a-cc_ft_576.jpg",
    "https://photos.zillowstatic.com/fp/ab0dfcc09e2762568dd1aedb322df918-cc_ft_576.jpg"
  ],
  "listingUrl": "https://www.zillow.com/homedetails/951-Willems-Rd-Cashmere-WA-98815/252012107_zpid/",
  "scrapedAt": new Date().toISOString()
};

const session = {
  "id": "md7xvztt0gao3lcyjgcv",
  "propertyUrl": "https://www.zillow.com/homedetails/951-Willems-Rd-Cashmere-WA-98815/252012107_zpid/",
  "agentName": "Chris",
  "agentPhone": "",
  "agencyName": "AI You",
  "propertyData": {
    "title": "951 Willems Road, Cashmere, WA 98815",
    "price": "$2,995,000",
    "bedrooms": 2,
    "bathrooms": 4,
    "sqft": 3198,
    "description": "Indoor lap poolMountain viewsRed fir hardwoodsPrimary on main floorCustom made doorsWalk-in pantryCustom birch cabinetry",
    "images": scrapedData.images,
    "whatsSpecialTags": scrapedData.features,
    "whatsSpecialDescription": "Located in Cashmere, WA"
  },
  "createdAt": new Date().toISOString()
};

// Store in localStorage
localStorage.setItem('lastScrapedProperty', JSON.stringify(scrapedData));
localStorage.setItem('anonymousSession', JSON.stringify(session));

console.log('✅ Data stored in localStorage');
console.log('🔍 Now checking if saveScrapedPropertyAsListing function exists...');

// Check if the function exists and call it
if (window.saveScrapedPropertyAsListing) {
  console.log('📞 Calling saveScrapedPropertyAsListing...');
  
  // Get current user ID from the page context
  const currentUser = window.user || { id: '943b7a8c-601f-48cc-aec5-85f3bac148aa' };
  
  window.saveScrapedPropertyAsListing(currentUser.id)
    .then(listingId => {
      if (listingId) {
        console.log('🎉 SUCCESS! Listing created with ID:', listingId);
        console.log('📍 Go to /dashboard/listings to see your new listing!');
        // Navigate to listings page
        window.location.href = '/dashboard/listings';
      } else {
        console.log('❌ No listing ID returned - check for errors above');
      }
    })
    .catch(error => {
      console.error('❌ Error creating listing:', error);
    });
} else {
  console.log('❌ saveScrapedPropertyAsListing function not found');
  console.log('💡 Navigate to /anonymous-builder first to load the function, then come back and run this script');
} 