export type Division = {
	id: number;
	name: string;
	bnName: string;
	url: string;
};

export type District = {
	id: number;
	division: Division;
	name: string;
	bnName: string;
	lat: string;
	lon: string;
	url: string;
};

export type Upazila = {
	id: number;
	district: District;
	name: string;
	bnName: string;
	url: string;
	/** THANA for a metropolitan police station area (for example in Dhaka city), otherwise UPAZILA. */
	type?: "UPAZILA" | "THANA";
};

export type Union = {
	id: number;
	upazila: Upazila;
	name: string;
	bnName: string;
	url: string;
};

export type UnionResponse = Union[];
export type UpazilaResponse = Upazila[];
export type DistrictResponse = District[];
export type DivisionResponse = Division[];
