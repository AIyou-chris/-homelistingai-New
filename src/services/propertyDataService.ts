// Property Data Service - Mock Data for Demo
// TODO: Integrate with OpenAI API for real AI-generated content

export interface SchoolData {
  name: string;
  type: 'Elementary' | 'Middle' | 'High';
  rating: number;
  distance: string;
  enrollment: number;
  description: string;
}

export interface PropertyHistory {
  date: string;
  event: string;
  price?: number;
  description: string;
}

export interface AmenityData {
  category: string;
  items: string[];
  description: string;
}

export interface ComparableProperty {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  soldDate: string;
  daysOnMarket: number;
  pricePerSqFt: number;
}

export interface NeighborhoodData {
  overview: string;
  demographics: {
    population: number;
    medianAge: number;
    medianIncome: number;
    homeOwnershipRate: number;
  };
  schools: SchoolData[];
  amenities: string[];
  transportation: string[];
  safety: {
    crimeRate: string;
    safetyRating: number;
  };
}

export interface FinancingData {
  estimatedMonthlyPayment: number;
  downPaymentOptions: {
    percent: number;
    amount: number;
    monthlyPayment: number;
  }[];
  interestRates: {
    conventional: number;
    fha: number;
    va: number;
  };
  closingCosts: number;
  propertyTax: number;
  insurance: number;
}

export interface PropertyReport {
  marketAnalysis: string;
  investmentPotential: string;
  rentalAnalysis: string;
  propertyCondition: string;
  recommendations: string[];
}

// Generate real school data using ATTOM API
export const generateSchoolData = async (address: string, propertyPrice: number): Promise<SchoolData[]> => {
  try {
    // Import ATTOM service function
    const { getNearbySchools } = await import('./attomDataService');
    
    // Get real school data from ATTOM API
    const attomSchools = await getNearbySchools(address, 1.0);
    
    if (attomSchools && attomSchools.length > 0) {
      return attomSchools.map(school => ({
        name: school.name,
        type: school.type as 'Elementary' | 'Middle' | 'High',
        rating: parseInt(school.rating || '7'),
        distance: school.distance,
        enrollment: school.enrollment || 500,
        description: `${school.type} school located ${school.distance} away with ${school.enrollment || 500} students`
      }));
    }
  } catch (error) {
    console.error('Error fetching real school data:', error);
  }
  
  // Fallback to mock data if API fails
  return [
    {
      name: "Springfield Elementary School",
      type: "Elementary" as const,
      rating: 8,
      distance: "0.3 miles",
      enrollment: 450,
      description: "Highly rated elementary school with strong academic programs and dedicated teachers."
    },
    {
      name: "Oakwood Middle School",
      type: "Middle" as const,
      rating: 7,
      distance: "0.8 miles",
      enrollment: 680,
      description: "Well-regarded middle school with excellent extracurricular activities and sports programs."
    },
    {
      name: "Springfield High School",
      type: "High" as const,
      rating: 9,
      distance: "1.2 miles",
      enrollment: 1200,
      description: "Top-rated high school with advanced placement programs and college preparation focus."
    }
  ];
};

// Generate mock property history
export const generatePropertyHistory = async (address: string, currentPrice: number): Promise<PropertyHistory[]> => {
  return [
    {
      date: "2024-01-15",
      event: "Listed for Sale",
      price: currentPrice,
      description: "Property listed on the market with recent updates and improvements."
    },
    {
      date: "2023-06-10",
      event: "Kitchen Renovation",
      description: "Complete kitchen remodel with new cabinets, countertops, and appliances."
    },
    {
      date: "2020-03-15",
      event: "Previous Sale",
      price: currentPrice * 0.85,
      description: "Property sold to current owner with original features."
    },
    {
      date: "2018-05-20",
      event: "Roof Replacement",
      description: "New asphalt shingle roof installed with 30-year warranty."
    },
    {
      date: "2015-08-12",
      event: "Property Built",
      description: "Original construction completed by local builder with quality materials."
    }
  ];
};

// Generate mock amenities data
export const generateAmenitiesData = async (address: string, propertyType: string): Promise<AmenityData[]> => {
  return [
    {
      category: "Interior Features",
      items: ["Hardwood floors", "Granite countertops", "Stainless steel appliances", "Walk-in closet", "Fireplace"],
      description: "Modern interior features with high-quality finishes throughout."
    },
    {
      category: "Exterior Features",
      items: ["Fenced backyard", "Patio", "Garden", "Two-car garage", "Mature landscaping"],
      description: "Beautiful exterior with private outdoor space and parking."
    },
    {
      category: "Appliances",
      items: ["Refrigerator", "Dishwasher", "Microwave", "Washer/Dryer", "Garbage disposal"],
      description: "All major appliances included and in excellent condition."
    },
    {
      category: "Utilities",
      items: ["Central air conditioning", "Forced air heating", "High-speed internet", "Security system"],
      description: "Modern utilities with energy-efficient systems."
    }
  ];
};

// Generate real neighborhood data using ATTOM API
export const generateNeighborhoodData = async (address: string): Promise<NeighborhoodData> => {
  try {
    // Import ATTOM service functions
    const { getNeighborhoodData, getNearbySchools, getPointsOfInterest } = await import('./attomDataService');
    
    // Get real neighborhood data from ATTOM API
    const neighborhoodData = await getNeighborhoodData(address);
    const schools = await getNearbySchools(address);
    const pointsOfInterest = await getPointsOfInterest(address);
    
    if (neighborhoodData) {
      return {
        overview: `Located in ${neighborhoodData.locality || 'a desirable neighborhood'} with excellent amenities and strong community spirit.`,
        demographics: {
          population: neighborhoodData.demographics?.population || 8500,
          medianAge: neighborhoodData.demographics?.medianAge || 42,
          medianIncome: neighborhoodData.demographics?.medianIncome || 85000,
          homeOwnershipRate: neighborhoodData.demographics?.homeOwnershipRate || 0.75
        },
        schools: schools.map(school => ({
          name: school.name,
          type: school.type as 'Elementary' | 'Middle' | 'High',
          rating: parseInt(school.rating || '7'),
          distance: school.distance,
          enrollment: school.enrollment || 500,
          description: `${school.type} school located ${school.distance} away`
        })),
        amenities: pointsOfInterest
          .filter(poi => ['restaurant', 'shopping', 'entertainment', 'healthcare'].includes(poi.business_category.toLowerCase()))
          .map(poi => `${poi.name} (${poi.distance})`)
          .slice(0, 10),
        transportation: pointsOfInterest
          .filter(poi => poi.business_category.toLowerCase().includes('transport'))
          .map(poi => `${poi.name} (${poi.distance})`)
          .slice(0, 5),
        safety: {
          crimeRate: neighborhoodData.safety?.crimeRate || "Low",
          safetyRating: neighborhoodData.safety?.safetyRating || 8.5
        }
      };
    }
  } catch (error) {
    console.error('Error fetching real neighborhood data:', error);
  }
  
  // Fallback to mock data if API fails
  return {
    overview: "Desirable family-friendly neighborhood with excellent schools, parks, and shopping. Known for its quiet streets and strong community spirit.",
    demographics: {
      population: 8500,
      medianAge: 42,
      medianIncome: 85000,
      homeOwnershipRate: 0.75
    },
    schools: [
      {
        name: "Springfield Elementary",
        type: "Elementary" as const,
        rating: 8,
        distance: "0.3 miles",
        enrollment: 450,
        description: "Highly rated elementary school"
      }
    ],
    amenities: ["Shopping center", "Public library", "Community center", "Parks", "Restaurants"],
    transportation: ["Bus routes", "Highway access", "Bike trails", "Walking paths"],
    safety: {
      crimeRate: "Low",
      safetyRating: 8.5
    }
  };
};

// Generate mock financing data
export const generateFinancingData = async (propertyPrice: number): Promise<FinancingData> => {
  const monthlyPayment = propertyPrice * 0.005; // Rough estimate
  return {
    estimatedMonthlyPayment: monthlyPayment,
    downPaymentOptions: [
      {
        percent: 20,
        amount: propertyPrice * 0.2,
        monthlyPayment: monthlyPayment * 0.8
      },
      {
        percent: 10,
        amount: propertyPrice * 0.1,
        monthlyPayment: monthlyPayment * 0.9
      },
      {
        percent: 5,
        amount: propertyPrice * 0.05,
        monthlyPayment: monthlyPayment * 0.95
      }
    ],
    interestRates: {
      conventional: 6.5,
      fha: 6.2,
      va: 6.0
    },
    closingCosts: propertyPrice * 0.03,
    propertyTax: propertyPrice * 0.012,
    insurance: 1200
  };
};

// Generate real comparable properties using ATTOM API
export const generateComparableProperties = async (address: string, propertyPrice: number, bedrooms: number, bathrooms: number): Promise<ComparableProperty[]> => {
  try {
    // Import ATTOM service function
    const { getComparableProperties } = await import('./attomDataService');
    
    // Get real comparable properties from ATTOM API
    const attomComparables = await getComparableProperties(address, 0.5);
    
    if (attomComparables && attomComparables.length > 0) {
      return attomComparables.map(comp => ({
        address: comp.address.oneLine,
        price: comp.sale.amount,
        bedrooms: comp.building.rooms.beds,
        bathrooms: comp.building.rooms.bathstotal,
        squareFootage: comp.building.size.livingsize,
        soldDate: comp.sale.date,
        daysOnMarket: Math.floor(Math.random() * 30) + 5, // Mock DOM since not in API
        pricePerSqFt: Math.round(comp.sale.amount / comp.building.size.livingsize)
      }));
    }
  } catch (error) {
    console.error('Error fetching real comparable properties:', error);
  }
  
  // Fallback to mock data if API fails
  const basePrice = propertyPrice;
  return [
    {
      address: "456 Oak Street",
      price: basePrice * 0.95,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      squareFootage: 1850,
      soldDate: "2024-01-10",
      daysOnMarket: 15,
      pricePerSqFt: Math.round((basePrice * 0.95) / 1850)
    },
    {
      address: "789 Pine Avenue",
      price: basePrice * 1.05,
      bedrooms: bedrooms + 1,
      bathrooms: bathrooms,
      squareFootage: 2100,
      soldDate: "2024-01-05",
      daysOnMarket: 8,
      pricePerSqFt: Math.round((basePrice * 1.05) / 2100)
    },
    {
      address: "321 Elm Street",
      price: basePrice * 0.98,
      bedrooms: bedrooms,
      bathrooms: bathrooms - 0.5,
      squareFootage: 1750,
      soldDate: "2023-12-20",
      daysOnMarket: 22,
      pricePerSqFt: Math.round((basePrice * 0.98) / 1750)
    }
  ];
};

// Generate mock property report
export const generatePropertyReport = async (address: string, propertyPrice: number, description: string): Promise<PropertyReport> => {
  return {
    marketAnalysis: "This property is well-positioned in a desirable neighborhood with strong market fundamentals. Recent comparable sales indicate stable pricing with slight appreciation trends.",
    investmentPotential: "Good investment potential with solid rental income possibilities. Property condition and location support long-term value appreciation.",
    rentalAnalysis: "Estimated monthly rental income: $2,800-$3,200. Positive cash flow potential with 20% down payment. Strong rental demand in this area.",
    propertyCondition: "Well-maintained property with recent updates. Minor cosmetic improvements could enhance value. Overall condition is good to excellent.",
    recommendations: [
      "Consider minor kitchen updates to maximize value",
      "Property is well-priced for current market conditions",
      "Strong potential for rental income",
      "Good long-term investment opportunity"
    ]
  };
};

// Main function to generate all property data
export const generateAllPropertyData = async (
  address: string,
  propertyPrice: number,
  bedrooms: number,
  bathrooms: number,
  propertyType: string = "Single Family Home",
  description: string = ""
) => {
  try {
    const [
      schools,
      history,
      amenities,
      neighborhood,
      financing,
      comparables,
      report
    ] = await Promise.all([
      generateSchoolData(address, propertyPrice),
      generatePropertyHistory(address, propertyPrice),
      generateAmenitiesData(address, propertyType),
      generateNeighborhoodData(address),
      generateFinancingData(propertyPrice),
      generateComparableProperties(address, propertyPrice, bedrooms, bathrooms),
      generatePropertyReport(address, propertyPrice, description)
    ]);

    return {
      schools,
      history,
      amenities,
      neighborhood,
      financing,
      comparables,
      report
    };
  } catch (error) {
    console.error('Error generating property data:', error);
    throw error;
  }
}; 