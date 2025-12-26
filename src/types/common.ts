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
