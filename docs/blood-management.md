# Blood Management System

## Overview

The Blood Management System provides a comprehensive interface for managing blood-related operations including donors, donations, and requisitions. This admin panel section allows administrators to view, search, and manage blood bank operations with server-side pagination and real-time data.

> Status (October 2026): the screen is **read-only** (no create, edit or delete buttons; the backend has write routes but no screen uses them). Needs `manage-blood`. Checked against the code and by type check and lint only; not tried in a browser. The access rules are in `opencare/docs/features/blood-management.md`.

## Features

### ✅ Implemented

- **Three-Tab Interface**: Donors, Requisitions, and Donations
- **Server-side Pagination**: 10 items per page with proper API pagination
- **Search**: a box that filters the rows on the current page only (client side)
- **Real-time Data**: Live data from blood management APIs
- **Plan message**: a 403 on the donors or donations tab shows "The blood donor list is included in the Plus and Pro plans." (or the donations version)
- **Responsive Design**: Mobile-friendly interface
- **Rich Data Display**: Comprehensive information for each entity
- **Contact Information**: Phone numbers and contact persons
- **Location Data**: District and hospital information
- **Status Tracking**: Active/inactive status and urgency indicators

### 📋 API Endpoints

#### 1. Blood Donors (`/api/blood-donors`)

- **Needs a login**: the call goes through `apiGet` and sends the token. Plus and Pro members and staff with `view-blood-donors` can read it
- **Pagination**: `page`, `size`, `sortBy`, `sortDir` parameters
- **Default Sort**: By donation count (descending)
- **Fields** (the interface below lists what the screen can show; the API returns a phone only if the donor shares it and never returns an email): id, name, bnName, phone, email, gender, bloodGroup, address, district, upazila, union, bloodDonationCount, lastBloodDonationDate, imageUrl, isActive

#### 2. Blood Donations (`/api/blood-donations`)

- **Needs a login**: the donations tab sends the token too (it used to send none). Same access rule as the donor list
- **Pagination**: `page`, `size` parameters
- **Fields**: id, donor, hospital, donationDate, bloodGroup, quantityMl, bloodComponent

#### 3. Blood Requisitions (`/api/blood-requisitions`)

- **Public**: this tab sends no token, because requisitions are public
- **Pagination**: `page`, `size` parameters
- **Fields**: id, requester, patientName, patientAge, patientGender, bloodGroup, bloodComponent, quantityBags, neededByDate, hospital, contactPerson, contactPhone, description, district, status, fulfilledDate

## Data Structures

### Blood Donor

```typescript
interface BloodDonor {
  id: number;
  name: string;
  bnName: string;
  phone: string;
  email: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  address: string;
  district: District;
  upazila: LocationUnit | null;
  union: LocationUnit | null;
  bloodDonationCount: number;
  lastBloodDonationDate: string;
  imageUrl: string;
  isActive: boolean;
}
```

### Blood Donation

```typescript
interface BloodDonation {
  id: number;
  donor: DonorInfo;
  hospital: Hospital;
  donationDate: string;
  bloodGroup: BloodGroup;
  quantityMl: number;
  bloodComponent: BloodComponent;
}
```

### Blood Requisition

```typescript
interface BloodRequisition {
  id: number;
  requester: RequesterInfo;
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  bloodGroup: BloodGroup;
  bloodComponent: BloodComponent;
  quantityBags: number;
  neededByDate: string;
  hospital: Hospital;
  contactPerson: string;
  contactPhone: string;
  description: string;
  district: District;
  status: string;
  fulfilledDate: string;
}
```

## File Structure

```
src/
├── components/admin/
│   ├── blood-management.tsx       # Main component
│   └── blood-management.css       # Custom styles
└── app/(admin)/admin/
    └── blood/
        └── page.tsx              # Next.js page
```

## Key Features by Tab

### 1. Donors Tab 🩸

- **Donor Information**: Full name (English & Bengali)
- **Blood Group**: Prominently displayed with red styling
- **Gender**: Visual gender indicator
- **Contact Details**: Phone (only if the donor shares it) and email (the API does not return one, so it normally shows nothing)
- **Location**: District information with map pin icon
- **Donation History**: Count and last donation date
- **Status**: Active/Inactive indicator

### 2. Requisitions Tab 📋

- **Patient Information**: Name, age, gender, and description
- **Requester Details**: Who requested the blood with contact info
- **Hospital Information**: Where blood is needed
- **Blood Requirements**: Component type and quantity in bags
- **Urgency Indicator**: Days remaining until needed date
- **Contact Person**: Direct contact for coordination

### 3. Donations Tab 🎁

- **Donor Information**: Who donated with contact details
- **Hospital**: Where donation took place
- **Donation Date**: When the donation occurred
- **Blood Component**: What was donated (whole blood, plasma, etc.)
- **Quantity**: Amount in milliliters

## Search Functionality

### Donors Search

- Donor name (English & Bengali)
- Phone number
- Blood group display name

### Donations Search

- Donor name
- Hospital name
- Blood component name

### Requisitions Search

- Patient name
- Requester name
- Hospital name
- Contact person name

## Pagination System

- **Server-side Pagination**: True pagination with API calls
- **10 Items Per Page**: Optimal viewing experience
- **Page Navigation**: Previous/Next + numbered pages
- **Smart Page Display**: Shows up to 5 page numbers
- **Status Information**: Current page and total items

## Visual Design Elements

### Color Coding

- **Red Theme**: Primary color for blood-related elements
- **Blood Group Badges**: Red background for prominence
- **Component Badges**: Blue background for differentiation
- **Status Indicators**: Green for active, gray for inactive

### Icons Usage

- **Droplets**: Main blood management icon
- **Phone**: Contact information
- **Calendar**: Dates and deadlines
- **User**: Gender and person indicators
- **MapPin**: Location information

### Table Features

- **Hover Effects**: Row highlighting on mouse over
- **Responsive**: Adapts to different screen sizes
- **Information Density**: Compact yet readable layout
- **Status Badges**: Clear visual status indicators

## Performance Features

### Optimization

- **Server-side Pagination**: Reduces data transfer
- **Client-side Search**: Filters the current page only
- **Lazy Loading**: Data is loaded only for the active tab
- **Efficient State Management**: Minimal re-renders

### Error Handling

- **API Error States**: Graceful error messaging
- **Loading Indicators**: Spinner animations during data fetch
- **Retry Capability**: Refresh button for failed requests
- **No row actions**: there is no Add, Edit, View or Delete button on any tab

## Usage Guide

### Navigation

1. Go to Admin Panel → Blood
2. Use tabs to switch between Donors, Requisitions, Donations
3. Search within current page data
4. Navigate pages using pagination controls

### Search Examples

- **Donors**: Search "Dr." to find doctor donors
- **Donations**: Search hospital names to find donations
- **Requisitions**: Search patient names for specific cases

### Data Insights

- **Donation Tracking**: Monitor donation counts and frequency
- **Urgent Requests**: Identify time-sensitive requisitions
- **Contact Management**: Quick access to phone numbers
- **Location Analysis**: See geographic distribution

## Integration with Base URL

The calls use `baseUrl` from `src/config/config.ts` (`NEXT_PUBLIC_API_BASE_URL`; local development defaults to `http://localhost:6700/api`, and a production build fails without the variable), making it easy to:

- **Environment Configuration**: Switch between dev/staging/prod
- **API Versioning**: Update endpoints as needed
- **Local Development**: Test with local backend

## Future Enhancements

### Planned Features

- [ ] **Blood Bank Inventory**: Track available blood stock
- [ ] **Matching System**: Auto-match donors to requisitions
- [ ] **Notification System**: Alerts for urgent requests
- [ ] **Export Functionality**: Export data to CSV/Excel
- [ ] **Advanced Filters**: Filter by blood group, location, date ranges
- [ ] **Dashboard Analytics**: Charts and statistics
- [ ] **Mobile App Integration**: API for mobile applications

### Data Enhancements

- [ ] **Medical History**: Link to donor medical records
- [ ] **Appointment Scheduling**: Schedule donation appointments
- [ ] **Inventory Tracking**: Real-time blood stock levels
- [ ] **Quality Assurance**: Track blood testing results
- [ ] **Emergency Protocols**: Priority handling for emergencies

## Technical Specifications

### API Integration

- **RESTful APIs**: Standard HTTP methods
- **Pagination**: Server-side with page/size parameters
- **Sorting**: Configurable sort parameters
- **Error Handling**: Proper HTTP status codes

### Performance and browser support

Not measured. No timing targets or browser matrix have been tested for this screen.

This Blood Management System provides a comprehensive solution for managing blood bank operations with excellent user experience, real-time data, and scalable architecture.
