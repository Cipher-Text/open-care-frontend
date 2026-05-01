# Geolocation Management

## Overview

The Geolocation Management feature provides a dedicated interface for managing Bangladesh's administrative divisions data. This admin panel section allows administrators to view divisions, districts, and upazilas in a tabbed interface with frontend pagination and search functionality.

## Features

### ✅ Implemented

- **Tab-based Navigation**: Three tabs for Divisions, Districts, and Upazilas
- **Frontend Pagination**: Client-side pagination with 10 items per page
- **Search Functionality**: Real-time search across all location fields
- **Responsive Design**: Mobile-friendly table layout
- **Data Refresh**: Manual refresh capability for each dataset
- **Hierarchical Display**: Shows parent-child relationships (Division → District → Upazila)
- **External Links**: Clickable government website URLs

### 📋 API Endpoints

1. **Divisions** (`/api/divisions`)

   - Fields: id, name, bnName, url
   - Total: ~8 divisions

2. **Districts** (`/api/districts`)

   - Fields: id, name, bnName, lat, lon, url, division
   - Total: ~64 districts
   - Shows parent division information

3. **Upazilas** (`/api/upazilas`)
   - Fields: id, name, bnName, url, district (with division)
   - Total: ~500+ upazilas
   - Shows parent district and division information

## File Structure

```
src/
├── components/admin/
│   ├── geolocation-management.tsx     # Main component
│   └── geolocation-management.css     # Custom styles
└── app/(admin)/admin/
    └── geolocation/
        └── page.tsx                   # Next.js page
```

## Technical Implementation

### Component Architecture

- **Tab-based Interface**: Clean separation of the three location types
- **Frontend Pagination**: Client-side pagination for better performance
- **TypeScript Interfaces**: Strongly typed data structures
- **Search Integration**: Real-time filtering across all relevant fields
- **Responsive Tables**: Adaptive layouts for different screen sizes

### Data Structures

```typescript
interface Division {
  id: number;
  name: string;
  bnName: string;
  url: string;
}

interface District {
  id: number;
  division: Division;
  name: string;
  bnName: string;
  lat: string;
  lon: string;
  url: string;
}

interface Upazila {
  id: number;
  district: District;
  name: string;
  bnName: string;
  url: string;
}
```

### Pagination Features

- **Items Per Page**: 10 items per page (configurable)
- **Page Navigation**: Previous/Next buttons and numbered pages
- **Smart Page Display**: Shows up to 5 page numbers with intelligent positioning
- **Search Integration**: Pagination resets when searching
- **Status Display**: Shows current page, total pages, and total items

### Search Functionality

- **Multi-field Search**: Searches across name, bnName, and parent locations
- **Real-time Filtering**: Instant results as you type
- **Case Insensitive**: Works with both English and Bengali text
- **Hierarchical Search**: Can search for districts by division name, etc.

## Table Features

### Divisions Table

- **ID**: Unique identifier
- **Name**: English name
- **Bengali Name**: Bengali script name
- **URL**: Government website link

### Districts Table

- **ID**: Unique identifier
- **Name**: English name
- **Bengali Name**: Bengali script name
- **Division**: Parent division (English + Bengali)
- **Coordinates**: Latitude and longitude (formatted to 4 decimal places)
- **URL**: Government website link

### Upazilas Table

- **ID**: Unique identifier
- **Name**: English name
- **Bengali Name**: Bengali script name
- **District**: Parent district (English + Bengali)
- **Division**: Grandparent division (English + Bengali)
- **URL**: Government website link

## Performance Optimizations

### Frontend Pagination Benefits

- **Reduced API Calls**: Data loaded once per tab
- **Faster Navigation**: Instant page switching
- **Better UX**: No loading delays between pages
- **Search Performance**: Instant search results
- **Bandwidth Efficient**: No repeated data fetching

### Memory Management

- **Lazy Loading**: Data loaded only when tab is selected
- **State Management**: Efficient React state handling
- **Search Optimization**: Debounced search (if needed)

## Usage Guide

### Navigation

1. Go to Admin Panel → Geolocation
2. Click on tabs to switch between Divisions, Districts, Upazilas
3. Use search box to filter results
4. Navigate pages using pagination controls
5. Click URLs to visit government websites

### Search Examples

- Search "Dhaka" to find Dhaka division/districts
- Search "ঢাকা" to find using Bengali text
- Search "Chattagram" to find all Chattagram-related locations

### Pagination

- Use Previous/Next buttons for sequential navigation
- Click page numbers for direct navigation
- Page controls automatically adjust based on search results

## Responsive Design

### Desktop (1024px+)

- Full table display with all columns
- Complete pagination controls
- Large search box

### Tablet (768px-1023px)

- Condensed table layout
- Responsive pagination
- Medium search box

### Mobile (< 768px)

- Scrollable tables
- Stacked pagination controls
- Compact display

## Future Enhancements

### Planned Features

- [ ] **Export Functionality**: Export filtered data to CSV/Excel
- [ ] **Map Integration**: Show locations on Bangladesh map
- [ ] **Bulk Operations**: Select multiple locations for operations
- [ ] **Advanced Filters**: Filter by division, coordinates range
- [ ] **Sorting**: Sort by name, ID, or other fields
- [ ] **Bookmarks**: Save frequently accessed locations
- [ ] **Statistics**: Show counts and analytics per division/district

### Data Enhancements

- [ ] **Population Data**: Add population information
- [ ] **Area Information**: Add area in square kilometers
- [ ] **Economic Data**: Add economic indicators
- [ ] **Development Metrics**: Add development scores
- [ ] **Geographic Features**: Add geographic characteristics

## Technical Specifications

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dependencies

- React 18+
- Next.js 13+
- TypeScript 4.9+
- Tailwind CSS 3+
- Lucide React (icons)

### Performance Metrics

- **Initial Load**: < 2 seconds
- **Tab Switching**: < 100ms
- **Search Response**: < 50ms
- **Pagination**: < 50ms

## Data Accuracy

The geolocation data is sourced from official Bangladesh government APIs and includes:

- Official administrative divisions
- Government website URLs
- Accurate coordinates for districts
- Both English and Bengali names
- Hierarchical relationships

This ensures data consistency and reliability for location-based features throughout the OpenCare application.
