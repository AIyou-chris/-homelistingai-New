# Build AI Listing Testing Guide

## 🧪 **Testing Plan: 5 Property URLs**

### **Test 1: Zillow Single Family Home**
- **URL:** `https://www.zillow.com/homedetails/123-Main-St-Beverly-Hills-CA-90210/20533071_zpid/`
- **Expected:** Single family home, 3-4 bedrooms, high-end property
- **Test Focus:** Basic scraping functionality

### **Test 2: Zillow Condo/Townhouse**
- **URL:** `https://www.zillow.com/homedetails/456-Oak-Ave-Los-Angeles-CA-90028/2077536_zpid/`
- **Expected:** Condo/townhouse, 2-3 bedrooms, mid-range property
- **Test Focus:** Different property types

### **Test 3: Zillow Luxury Property**
- **URL:** `https://www.zillow.com/homedetails/789-Sunset-Blvd-West-Hollywood-CA-90069/20533072_zpid/`
- **Expected:** High-end property, multiple features, high price
- **Test Focus:** Complex data scraping

### **Test 4: Realtor.com Property**
- **URL:** `https://www.realtor.com/realestateandhomes-detail/321-Pine-St_Manhattan-Beach_CA_90266`
- **Expected:** Different source scraping capabilities
- **Test Focus:** Multi-platform support

### **Test 5: Different State Property**
- **URL:** `https://www.zillow.com/homedetails/987-Elm-St-Austin-TX-78701/308478034_zpid/`
- **Expected:** Non-California property, different market
- **Test Focus:** Geographic diversity

## 📋 **Testing Checklist (Per URL)**

### **Step 1: Initial Setup**
- [ ] Go to https://homelistingai.com/build-ai-listing
- [ ] Make sure you're logged in as admin
- [ ] Clear browser cache if needed

### **Step 2: Property URL Input**
- [ ] Paste the test URL
- [ ] Click "Next" to proceed
- [ ] Verify scraping starts

### **Step 3: Agent Information**
- [ ] Fill in agent name: "Test Agent"
- [ ] Fill in phone: "555-123-4567"
- [ ] Fill in agency: "Test Realty"
- [ ] Fill in title: "Senior Agent"
- [ ] Add custom prompt: "Create professional listing"

### **Step 4: Review & Deploy**
- [ ] Verify scraped data appears correctly
- [ ] Check that all fields are populated
- [ ] Click "Build & Deploy"
- [ ] Wait for completion

### **Step 5: Verification**
- [ ] No database errors in console
- [ ] Listing created successfully
- [ ] Data saved to Supabase
- [ ] AI assistant preview works

## 📊 **Results Tracking Template**

```
TEST #: ___
URL: _______________
DATE: _______________
TIME: _______________

SCRAPING RESULTS:
✅/❌ Title extracted
✅/❌ Address extracted  
✅/❌ Price extracted
✅/❌ Bedrooms extracted
✅/❌ Bathrooms extracted
✅/❌ Square feet extracted
✅/❌ Images extracted (count: ___)
✅/❌ Features extracted
✅/❌ Description extracted

DATABASE RESULTS:
✅/❌ No console errors
✅/❌ Listing created in Supabase
✅/❌ All required fields populated
✅/❌ UUID format correct
✅/❌ Status enum correct

AI ASSISTANT:
✅/❌ Preview loads
✅/❌ Responds to questions
✅/❌ Uses property data correctly

NOTES:
___________________
```

## 🔍 **What to Look For**

### **Success Indicators:**
- No red errors in browser console
- All form fields populated automatically
- Images appear in the preview
- Property details are accurate
- AI assistant responds with property info

### **Common Issues to Watch:**
- Missing price data ("Price not available")
- Empty image arrays
- Incomplete address parsing
- Database constraint errors
- UUID format problems

## 🚀 **Alternative Test URLs (Backup)**

If any of the main URLs fail, try these:

1. `https://www.zillow.com/homedetails/1234-Example-Dr-Los-Angeles-CA-90210/123456_zpid/`
2. `https://www.realtor.com/realestateandhomes-detail/5678-Test-Ave_Beverly-Hills_CA_90210`
3. `https://www.zillow.com/homedetails/9876-Demo-St-San-Francisco-CA-94102/987654_zpid/`

## 📝 **After Testing**

1. **Document Results:** Fill out the tracking template for each test
2. **Check Supabase:** Verify listings appear in your database
3. **Test AI Chat:** Try asking the AI about each property
4. **Report Issues:** Note any problems or missing data

## ⚡ **Quick Test (If Short on Time)**

Pick 2-3 URLs and focus on:
- Basic scraping works
- No database errors  
- AI assistant responds
- Data saves correctly

Good luck with testing! 🎉 