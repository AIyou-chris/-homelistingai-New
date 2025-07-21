// Sample Apify data for testing
import { ApifyPropertyData } from './apifyService';

export const sampleApifyData: ApifyPropertyData = {
  "listingDataSource": "Phoenix",
  "zpid": 85972778,
  "city": "Wenatchee",
  "state": "WA",
  "homeStatus": "FOR_SALE",
  "address": {
    "streetAddress": "1423 Springwater Ave",
    "city": "Wenatchee",
    "state": "WA",
    "zipcode": "98801",
    "neighborhood": undefined,
    "community": undefined,
    "subdivision": "Wenatchee"
  },
  "isListingClaimedByCurrentSignedInUser": false,
  "isCurrentSignedInAgentResponsible": false,
  "bedrooms": 4,
  "bathrooms": 2,
  "price": 875000,
  "yearBuilt": 1946,
  "streetAddress": "1423 Springwater Ave",
  "zipcode": "98801",
  "isCurrentSignedInUserVerifiedOwner": false,
  "propertyUpdatePageLink": null,
  "moveHomeMapLocationLink": null,
  "propertyEventLogLink": null,
  "editPropertyHistorylink": null,
  "collections": {
    "modules": [
      {
        "name": "Similar homes",
        "placement": "NEIGHBORHOOD",
        "propertyDetails": [
          {
            "miniCardPhotos": [
              {
                "url": "https://photos.zillowstatic.com/fp/d4f79e282a328aca533eff84a024ae35-p_c.jpg"
              }
            ],
            "price": 799900,
            "currency": "USD",
            "bedrooms": 4,
            "bathrooms": 3,
            "livingArea": 2739,
            "livingAreaValue": 2739,
            "livingAreaUnits": "Square Feet",
            "livingAreaUnitsShort": "sqft",
            "listingMetadata": {
              "comminglingCategoryIsRulesApplicable": true
            },
            "lotSize": 12632,
            "lotAreaValue": 0.29,
            "lotAreaUnits": "Acres",
            "address": {
              "streetAddress": "1535 Elmwood Street",
              "city": "Wenatchee",
              "state": "WA",
              "zipcode": "98801"
            },
            "parentRegion": {
              "name": "98801"
            },
            "formattedChip": {
              "location": [
                {
                  "fullValue": "1535 Elmwood Street"
                },
                {
                  "fullValue": "Wenatchee, WA 98801"
                }
              ]
            },
            "latitude": 47.44506,
            "longitude": -120.34376,
            "zpid": 85979750,
            "homeStatus": "FOR_SALE",
            "homeType": "SINGLE_FAMILY",
            "hdpUrl": "/homedetails/1535-Elmwood-St-Wenatchee-WA-98801/85979750_zpid/",
            "hdpTypeDimension": "ForSale",
            "propertyTypeDimension": "Single Family",
            "listingTypeDimension": "For Sale by Agent",
            "listing_sub_type": {
              "is_newHome": false,
              "is_forAuction": false,
              "is_bankOwned": false,
              "is_foreclosure": false,
              "is_FSBO": false,
              "is_comingSoon": false,
              "is_FSBA": true
            },
            "providerListingID": null,
            "attributionInfo": {
              "mlsId": "2379673",
              "mlsName": "NWMLS"
            }
          }
        ]
      }
    ]
  }
}; 