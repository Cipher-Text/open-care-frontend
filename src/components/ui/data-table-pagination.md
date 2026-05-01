# DataTablePagination Component

A responsive, reusable pagination component built on top of Shadcn UI components.

## Features

- ✅ **Responsive Design**: Different layouts for mobile and desktop
- ✅ **Smart Page Display**: Shows relevant page numbers with ellipsis
- ✅ **Reusable**: Can be used in any table/list component
- ✅ **Accessible**: Proper ARIA labels and semantic HTML
- ✅ **Page Size Selector**: Optional dropdown to change items per page
- ✅ **First/Last Navigation**: Quick jump to first and last pages

## Usage

### Basic Usage

```tsx
import { DataTablePagination } from "@/components/ui/data-table-pagination";

function MyTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;

	// Your data fetching logic here...

	return (
		<div>
			{/* Your table content */}

			<DataTablePagination
				currentPage={currentPage}
				totalPages={Math.ceil(totalItems / pageSize)}
				totalItems={totalItems}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
```

### With Page Size Selector

```tsx
<DataTablePagination
	currentPage={currentPage}
	totalPages={totalPages}
	totalItems={totalItems}
	pageSize={pageSize}
	onPageChange={setCurrentPage}
	onPageSizeChange={setPageSize}
	showPageSizeSelector={true}
	pageSizeOptions={[10, 25, 50, 100]}
/>
```

## Props

| Prop                   | Type                     | Default             | Description                             |
| ---------------------- | ------------------------ | ------------------- | --------------------------------------- |
| `currentPage`          | `number`                 | -                   | Current active page (1-indexed)         |
| `totalPages`           | `number`                 | -                   | Total number of pages                   |
| `totalItems`           | `number`                 | -                   | Total number of items                   |
| `pageSize`             | `number`                 | -                   | Number of items per page                |
| `onPageChange`         | `(page: number) => void` | -                   | Callback when page changes              |
| `onPageSizeChange`     | `(size: number) => void` | `undefined`         | Optional callback for page size changes |
| `showPageSizeSelector` | `boolean`                | `false`             | Whether to show page size dropdown      |
| `pageSizeOptions`      | `number[]`               | `[10, 20, 50, 100]` | Available page size options             |
| `className`            | `string`                 | `undefined`         | Additional CSS classes                  |

## Responsive Behavior

### Desktop (≥768px)

- Shows full pagination with page numbers
- Includes Previous/Next buttons with text
- Shows First/Last page navigation buttons
- Displays ellipsis for large page ranges

### Mobile (<768px)

- Simplified pagination with icon-only buttons
- Shows "X of Y" format
- First/Previous/Next/Last navigation buttons
- More compact layout

## Examples

### Users Table

```tsx
function UsersTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(25);

	return (
		<div>
			{/* Users table content */}

			<DataTablePagination
				currentPage={currentPage}
				totalPages={usersData.totalPages}
				totalItems={usersData.totalItems}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
				showPageSizeSelector={true}
				className="mt-6"
			/>
		</div>
	);
}
```

### Orders Table

```tsx
function OrdersTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 20;

	return (
		<div>
			{/* Orders table content */}

			<DataTablePagination
				currentPage={currentPage}
				totalPages={ordersData.totalPages}
				totalItems={ordersData.totalItems}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				className="border-t pt-4 mt-4"
			/>
		</div>
	);
}
```

## Styling

The component uses Tailwind CSS classes and is fully customizable. You can:

- Add custom `className` for additional styling
- Modify the component directly for specific use cases
- Override styles using CSS custom properties

## Dependencies

- `@/components/ui/pagination` - Shadcn UI pagination components
- `@/components/ui/button` - Shadcn UI button component
- `lucide-react` - Icons
- `tailwindcss` - Styling
