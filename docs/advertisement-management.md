# Advertisement Management

## Overview

The Advertisement Management feature allows administrators to manage advertisement types and active advertisements on the OpenCare platform.

## Features

### Advertisement Types Tab

- View all available advertisement types
- Display advertisement type details including:
  - ID
  - Name
  - Description
  - Position (where the ad appears)
  - Base Price
  - Duration in days
- Search functionality to filter advertisement types
- Pagination support
- Refresh data functionality

### Advertisements Tab

- View all active and inactive advertisements
- Display advertisement details including:
  - ID
  - Image preview
  - Title and content
  - Advertisement type
  - Target URL and type (doctor, hospital, institution)
  - Location (district and upazila)
  - Duration (start and end time)
  - Status (active/inactive)
  - Statistics (views and clicks)
- Search functionality to filter advertisements
- Pagination support
- Refresh data functionality

## API Endpoints

### Get Advertisement Types

```
GET /api/advertisement-types?page={page}&size={size}
```

Response structure:

```json
{
  "types": [
    {
      "id": number,
      "name": string,
      "description": string,
      "position": {
        "value": string | null,
        "position": string
      },
      "basePrice": number,
      "durationInDays": number
    }
  ],
  "totalItems": number,
  "totalPages": number,
  "currentPage": number
}
```

### Get Advertisements

```
GET /api/advertisements?page={page}&size={size}
```

Response structure:

```json
{
  "advertisements": [
    {
      "id": number,
      "title": string,
      "content": string,
      "imageUrl": string,
      "targetUrl": string,
      "targetType": string,
      "targetId": number,
      "advTypeId": number,
      "advertisementType": {...},
      "districtId": number,
      "district": {...},
      "upazilaId": number,
      "upazila": {...},
      "unionId": number,
      "union": {...},
      "medSpecialityId": number,
      "medicalSpeciality": {...},
      "ageGroup": {...},
      "gender": {...},
      "startTime": string,
      "endTime": string,
      "isActive": boolean,
      "views": number,
      "clicks": number
    }
  ],
  "totalItems": number,
  "totalPages": number,
  "currentPage": number
}
```

## File Structure

```
src/
├── api/
│   └── advertisements.ts          # API functions for advertisements
├── types/
│   └── advertisements.ts          # TypeScript interfaces
├── components/
│   └── admin/
│       ├── advertisement-management.tsx    # Main component
│       └── advertisement-management.css    # Styles
└── app/
    └── (admin)/
        └── admin/
            └── advertisement/
                └── page.tsx       # Page component
```

## Usage

Navigate to `/admin/advertisement` in the admin panel to access the Advertisement Management interface.

## Features in Detail

### Search

- Real-time search filtering
- Searches across multiple fields (name, description, position, title, content, etc.)
- Works on both tabs independently

### Pagination

- 10 items per page by default
- Previous/Next navigation
- Current page indicator
- Total items count

### Refresh

- Manual refresh button
- Reloads data from the server
- Shows loading spinner during refresh

### Status Badge

- Green badge for active advertisements
- Red badge for inactive advertisements

### Statistics

- View count with eye icon
- Click count with pointer icon
- Displayed for each advertisement

## Styling

The component uses a custom CSS file with responsive design:

- Desktop-optimized layout
- Mobile-responsive tables
- Consistent color scheme matching the admin panel
- Hover effects on table rows
- Badge styling for status indicators

## Future Enhancements

Potential features to add:

- Create new advertisement types
- Create new advertisements
- Edit existing advertisements
- Delete advertisements
- Filter by status (active/inactive)
- Filter by date range
- Export to CSV
- Bulk actions
- Advertisement preview
- Analytics dashboard
