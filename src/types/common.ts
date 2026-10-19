export interface Response {
	totalItems: number;
	totalPages: number;
	currentPage: number;
}

export interface ICommonEnum {
	banglaName: string;
	englishName: string;
	value?: string;
	displayName?: string;
}

export interface Sort {
	unsorted: boolean;
	sorted: boolean;
	empty: boolean;
}

export interface Pageable {
	unpaged: boolean;
	pageNumber: number;
	paged: boolean;
	pageSize: number;
	offset: number;
	sort: Sort;
}

/** One page of a list. `currentPage` is 1-based. See lib/pagination.ts. */
export interface PageResult<T> {
	content: T[];
	currentPage: number;
	totalItems: number;
	totalPages: number;
}
