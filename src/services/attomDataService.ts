// ATTOM Data API Service
// Documentation: https://api.developer.attomdata.com/home

const ATTOM_API_BASE = 'https://api.developer.attomdata.com/v3.0';
const ATTOM_API_KEY = 'c7eff490b37a37b3fcd4083fe2a704e5'; // HomeListingAI's App API key

export interface AttomPropertyData {
  identifier: {
    obPropId: number;
    fips: string;
    apn: string;
  };
  address: {
    line1: string;
    line2: string;
    locality: string;
    countrySubd: string;
    postal1: string;
    oneLine: string;
  };
  location: {
    latitude: string;
    longitude: string;
    accuracy: string;
  };
  summary: {
    propclass: string;
    yearbuilt: number;
    propLandUse: string;
  };
  building: {
    size: {
      livingsize: number;
      bldgsize: number;
    };
    rooms: {
      beds: number;
      bathstotal: number;
      bathsfull: number;
      bathshalf: number;
    };
  };
  assessment: {
    assessed: {
      assdttlvalue: number;
    };
  };
}

export interface AttomComparable {
  identifier: {
    obPropId: number;
  };
  address: {
    line1: string;
    locality: string;
    oneLine: string;
  };
  summary: {
    yearbuilt: number;
  };
  building: {
    size: {
      livingsize: number;
    };
    rooms: {
      beds: number;
      bathstotal: number;
    };
  };
  sale: {
    amount: number;
    date: string;
  };
}

export interface AttomSchool {
  name: string;
  type: string;
  distance: string;
  rating?: string;
  enrollment?: number;
}

export interface AttomPOI {
  name: string;
  business_category: string;
  distance: string;
  industry: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

// Get property details by address
export const getPropertyDetails = async (address: string): Promise<AttomPropertyData | null> => {
  try {
    const response = await fetch('/.netlify/functions/attom-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'property/detail',
        params: { address1: address }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.property?.[0] || null;
  } catch (error) {
    console.error('Error fetching ATTOM property details:', error);
    return null;
  }
};

// Get comparable properties
export const getComparableProperties = async (address: string, radius: number = 0.5): Promise<AttomComparable[]> => {
  try {
    const response = await fetch('/.netlify/functions/attom-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'property/expandedprofile',
        params: { address1: address, radius: radius.toString() }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.property || [];
  } catch (error) {
    console.error('Error fetching ATTOM comparables:', error);
    return [];
  }
};

// Get nearby schools
export const getNearbySchools = async (address: string, radius: number = 1.0): Promise<AttomSchool[]> => {
  try {
    const response = await fetch('/.netlify/functions/attom-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'school/snapshot',
        params: { address1: address, radius: radius.toString() }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.school || [];
  } catch (error) {
    console.error('Error fetching ATTOM schools:', error);
    return [];
  }
};

// Get points of interest
export const getPointsOfInterest = async (address: string, radius: number = 0.5): Promise<AttomPOI[]> => {
  try {
    const response = await fetch('/.netlify/functions/attom-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'poi/snapshot',
        params: { address1: address, radius: radius.toString() }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.poi || [];
  } catch (error) {
    console.error('Error fetching ATTOM POI:', error);
    return [];
  }
};

// Get neighborhood data
export const getNeighborhoodData = async (address: string): Promise<any> => {
  try {
    const response = await fetch('/.netlify/functions/attom-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'neighborhood/snapshot',
        params: { address1: address }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.neighborhood?.[0] || null;
  } catch (error) {
    console.error('Error fetching ATTOM neighborhood data:', error);
    return null;
  }
};

// Get property history
export const getPropertyHistory = async (address: string): Promise<any[]> => {
  try {
    const response = await fetch('/.netlify/functions/attom-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'property/saleshistory',
        params: { address1: address }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error('Error fetching ATTOM property history:', error);
    return [];
  }
};

// Mock data for demo purposes when API key is not available
export const getMockAttomData = () => ({
  propertyDetails: {
    identifier: {
      obPropId: 2511639610001,
      fips: "10001",
      apn: "11701014062800000"
    },
    address: {
      line1: "123 Oak Street",
      line2: "Springfield, IL 62701",
      locality: "Springfield",
      countrySubd: "IL",
      postal1: "62701",
      oneLine: "123 Oak Street, Springfield, IL 62701"
    },
    location: {
      latitude: "39.7811985",
      longitude: "-89.6535866",
      accuracy: "Street"
    },
    summary: {
      propclass: "Single Family",
      yearbuilt: 2006,
      propLandUse: "SINGLE FAMILY"
    },
    building: {
      size: {
        livingsize: 1850,
        bldgsize: 2145
      },
      rooms: {
        beds: 3,
        bathstotal: 3,
        bathsfull: 2,
        bathshalf: 1
      }
    },
    assessment: {
      assessed: {
        assdttlvalue: 41100
      }
    }
  },
  comparables: [
    {
      identifier: { obPropId: 2511639610002 },
      address: {
        line1: "456 Elm Avenue",
        locality: "Springfield",
        oneLine: "456 Elm Avenue, Springfield, IL 62701"
      },
      summary: { yearbuilt: 2008 },
      building: {
        size: { livingsize: 1920 },
        rooms: { beds: 3, bathstotal: 3 }
      },
      sale: { amount: 478000, date: "2024-01-15" }
    },
    {
      identifier: { obPropId: 2511639610003 },
      address: {
        line1: "789 Pine Drive",
        locality: "Springfield",
        oneLine: "789 Pine Drive, Springfield, IL 62701"
      },
      summary: { yearbuilt: 2004 },
      building: {
        size: { livingsize: 1780 },
        rooms: { beds: 3, bathstotal: 2 }
      },
      sale: { amount: 442000, date: "2024-02-01" }
    }
  ],
  schools: [
    {
      name: "Oak Street Elementary",
      type: "Elementary",
      distance: "0.3",
      rating: "9.2",
      enrollment: 450
    },
    {
      name: "Central Middle School",
      type: "Middle",
      distance: "0.5",
      rating: "8.9",
      enrollment: 650
    },
    {
      name: "Lincoln High School",
      type: "High",
      distance: "1.2",
      rating: "9.1",
      enrollment: 1200
    }
  ],
  poi: [
    {
      name: "Downtown Shopping Center",
      business_category: "SHOPPING",
      distance: "0.8",
      industry: "SHOPPING CENTERS",
      street: "100 Main St",
      city: "Springfield",
      state: "IL",
      zip_code: "62701"
    },
    {
      name: "Springfield Public Library",
      business_category: "EDUCATION",
      distance: "0.3",
      industry: "LIBRARIES",
      street: "200 Oak St",
      city: "Springfield",
      state: "IL",
      zip_code: "62701"
    },
    {
      name: "Community Park",
      business_category: "RECREATION",
      distance: "0.2",
      industry: "PARKS",
      street: "300 Pine Ave",
      city: "Springfield",
      state: "IL",
      zip_code: "62701"
    }
  ]
}); 