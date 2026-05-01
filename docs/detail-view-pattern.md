# Detail View Pattern Implementation Guide

This guide explains how to implement consistent detail view pages across the application using the generic detail view system.

## Overview

The detail view system consists of three main components:

1. **`DetailView`** - Generic rendering component that displays detail sections
2. **`buildDetailSections`** - Utility function that converts section configurations to rendered sections
3. **Entity-specific builder** (e.g., `buildDoctorDetailSections`) - Configures data for a specific entity type

## File Structure

```
src/components/admin/
├── detail-view.tsx                    # Generic DetailView component
├── build-detail-sections.tsx          # Configuration interfaces and builder utility
├── build-doctor-sections.tsx          # Doctor-specific section configurations
├── build-hospital-sections.tsx        # (To be created for hospitals)
└── ...
```

## Step-by-Step Implementation

### Step 1: Create Entity-Specific Section Builder

Create a new file `src/components/admin/build-[entity]-sections.tsx` (e.g., `build-hospital-sections.tsx`):

```typescript
"use client";

import { Mail, Phone, MapPin, Building2, Users } from "lucide-react";
import { HospitalDetailsResponse } from "@/types/hospitals";
import {
	buildDetailSections,
	SectionConfig,
	PropertyConfig,
} from "./build-detail-sections";
import { DetailSection } from "./detail-view";

export function buildHospitalDetailSections(
	hospital: HospitalDetailsResponse
): DetailSection[] {
	// Step 1: Create properties arrays for each section
	const basicProperties: PropertyConfig[] = [
		{ label: "Name", value: hospital.name || "N/A" },
		{ label: "Bengali Name", value: hospital.bnName || "N/A" },
		{
			label: "Email",
			value: hospital.email || "N/A",
			icon: <Mail className="h-4 w-4" />,
		},
		{
			label: "Phone",
			value: hospital.phone || "N/A",
			icon: <Phone className="h-4 w-4" />,
		},
		{
			label: "District",
			value: hospital.district?.name || "N/A",
			icon: <MapPin className="h-4 w-4" />,
		},
		{ label: "Type", value: hospital.hospitalType?.banglaName || "N/A" },
	];

	// Step 2: Create section configurations
	const sections: SectionConfig[] = [
		{
			id: "basic",
			title: "Basic Information",
			icon: <Building2 className="h-5 w-5" />,
			properties: basicProperties,
		},
		// Add more sections as needed
	];

	// Step 3: Return transformed sections
	return buildDetailSections(sections);
}
```

### Step 2: Update Your View Page

Update `src/app/(admin)/admin/[entity]/[id]/view/page.tsx`:

```typescript
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchHospitalDetailsById } from "@/api/hospitals";
import { DetailView } from "@/components/admin/detail-view";
import { buildHospitalDetailSections } from "@/components/admin/build-hospital-sections";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDestructive } from "@/components/common/alerts";

export default function HospitalViewPage() {
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;

	const {
		data: hospital,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["hospital", id],
		queryFn: () => fetchHospitalDetailsById(id),
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-12 w-32" />
				<Skeleton className="h-96" />
			</div>
		);
	}

	if (error) {
		return (
			<AlertDestructive
				title="Error"
				message="Failed to load hospital details"
			/>
		);
	}

	return (
		<div className="space-y-6">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => router.back()}
				className="gap-2"
			>
				<ArrowLeft className="h-4 w-4" />
				Back
			</Button>

			<DetailView sections={buildHospitalDetailSections(hospital)} />
		</div>
	);
}
```

## Configuration Types

### PropertyConfig

Represents a single property to display:

```typescript
interface PropertyConfig {
	label: string; // Display label for the property
	value: ReactNode; // Can be string, number, JSX, or React component
	icon?: ReactNode; // Optional icon to display alongside the value
}
```

### SectionConfig

Represents a section that contains properties or custom content:

```typescript
interface SectionConfig {
	id: string; // Unique identifier
	title: string; // Section title
	icon?: ReactNode; // Optional section icon
	properties?: PropertyConfig[]; // Simple key-value properties
	customContent?: ReactNode; // Complex custom JSX rendering
	emptyMessage?: string; // Message shown when no data available
}
```

### DetailSection

Output type returned by `buildDetailSections()`:

```typescript
interface DetailSection {
	id: string;
	title: string;
	icon?: ReactNode;
	content: ReactNode;
	emptyMessage?: string;
}
```

## Patterns

### Pattern 1: Simple Properties

Use properties for straightforward key-value data:

```typescript
const basicProperties: PropertyConfig[] = [
	{ label: "Name", value: entity.name || "N/A" },
	{
		label: "Email",
		value: entity.email || "N/A",
		icon: <Mail className="h-4 w-4" />,
	},
	{ label: "Status", value: entity.isActive ? "Active" : "Inactive" },
];

const sections: SectionConfig[] = [
	{
		id: "basic",
		title: "Basic Information",
		properties: basicProperties,
	},
];
```

**Result**: Properties display in a responsive 3-4 column grid layout

### Pattern 2: Complex Data with Custom Content

Use customContent for complex nested structures like lists of items:

```typescript
const sections: SectionConfig[] = [
	{
		id: "items",
		title: "Items",
		customContent:
			items.length > 0 ? (
				<div className="space-y-4">
					{items.map((item) => (
						<div key={item.id} className="border rounded-lg p-4">
							<h4 className="font-semibold">{item.name}</h4>
							<p className="text-sm text-gray-600">{item.description}</p>
						</div>
					))}
				</div>
			) : undefined,
		emptyMessage: "No items found",
	},
];
```

### Pattern 3: Complex Properties (Nested Data)

For complex data within a properties array, use JSX as the value:

```typescript
const itemProperties: PropertyConfig[] = items.map((item) => ({
	label: item.name,
	value: (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<span className="text-sm">{item.description}</span>
			</div>
			{item.metadata && (
				<div className="text-xs text-gray-600">
					{Object.entries(item.metadata).map(([key, val]) => (
						<div key={key}>
							{key}: {val}
						</div>
					))}
				</div>
			)}
		</div>
	),
}));

const sections: SectionConfig[] = [
	{
		id: "items",
		title: "Items",
		properties: itemProperties,
		emptyMessage: "No items found",
	},
];
```

## Best Practices

1. **Always show labels**: Use N/A for missing values instead of conditionally showing properties
2. **Use icons sparingly**: Add icons to important fields like email, phone, location
3. **Keep property values simple**: For complex rendering, use customContent instead
4. **Handle empty states**: Provide meaningful emptyMessage for sections that might be empty
5. **Use utilities**: Reuse icon imports and formatting functions
6. **Type safety**: Always type your data properly for better IDE support

## Icon Usage

Common icons from `lucide-react`:

```typescript
import {
	Mail, // For email
	Phone, // For phone numbers
	MapPin, // For locations
	Calendar, // For dates
	User, // For user/profile info
	Building2, // For institutions/organizations
	Shield, // For security/verification status
	Activity, // For active/inactive status
	Briefcase, // For work/employment
	GraduationCap, // For education
	Users, // For associations/groups
	Stethoscope, // For medical specialties
} from "lucide-react";
```

## Layout Behavior

Properties automatically layout responsively:

- **Desktop**: 3-4 columns per row (250px minimum per column)
- **Tablet**: 2-3 columns per row
- **Mobile**: 1-2 columns per row

The layout adjusts automatically based on available screen width.

## Example: Complete Implementation

See `src/components/admin/build-doctor-sections.tsx` for a complete working example showing:

- Simple property patterns (profile section)
- Complex properties with nested JSX (degrees, workplaces, associations)
- Icon usage
- Date formatting
- Conditional rendering within properties

## Troubleshooting

**Properties not wrapping correctly?**

- Ensure parent container has sufficient width
- Check that `flex-1 min-w-[250px]` is applied

**Icons not showing?**

- Verify icon import from `lucide-react`
- Ensure icon size matches (typically `h-4 w-4`)

**Custom content not rendering?**

- Use `customContent` instead of `properties` for complex layouts
- Make sure to handle empty states with `emptyMessage`

**Type errors?**

- Import PropertyConfig and SectionConfig from `build-detail-sections.tsx`
- Ensure your data types match the interface expectations
