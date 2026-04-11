import { baseUrl } from "@/config/config";
import { DocumentType, FileUploadResponse } from "@/types/file";
import { getAuthHeader } from "@/lib/auth-client";

/**
 * Upload a file for a specific document type and entity.
 *
 * @param documentType - The DocumentType (determines bucket and folder automatically)
 * @param entityId     - The ID of the entity this file belongs to (e.g. profile ID)
 * @param file         - The file to upload
 * @param token        - Optional token for server-side requests
 * @returns FileUploadResponse with photoUrl (store in DB) and accessUrl (use for display)
 */
export const uploadFile = async (
	documentType: DocumentType,
	entityId: number,
	file: File,
	token?: string
): Promise<FileUploadResponse> => {
	const formData = new FormData();
	formData.append("file", file);

	const headers: Record<string, string> = {};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	} else if (typeof window !== "undefined") {
		const authHeaders = getAuthHeader();
		Object.assign(headers, authHeaders);
	}

	const response = await fetch(
		`${baseUrl}/files/${documentType}/id/${entityId}`,
		{
			method: "POST",
			headers,
			body: formData,
		}
	);

	if (!response.ok) {
		throw new Error(
			`Failed to upload file: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * Upload multiple files for a specific document type and entity.
 *
 * @param documentType - The DocumentType
 * @param entityId     - The ID of the entity this file belongs to
 * @param files        - Array of files to upload
 * @param token        - Optional token for server-side requests
 * @returns Array of FileUploadResponse objects
 */
export const uploadFiles = async (
	documentType: DocumentType,
	entityId: number,
	files: File[],
	token?: string
): Promise<FileUploadResponse[]> => {
	const uploadPromises = files.map((file) =>
		uploadFile(documentType, entityId, file, token)
	);

	return Promise.all(uploadPromises);
};

/**
 * Upload a file with progress tracking.
 *
 * @param documentType - The DocumentType (determines bucket and folder automatically)
 * @param entityId     - The ID of the entity this file belongs to
 * @param file         - The file to upload
 * @param onProgress   - Callback function for progress updates (0-100)
 * @param token        - Optional token for server-side requests
 * @returns FileUploadResponse with photoUrl (store in DB) and accessUrl (use for display)
 */
export const uploadFileWithProgress = async (
	documentType: DocumentType,
	entityId: number,
	file: File,
	onProgress: (progress: number) => void,
	token?: string
): Promise<FileUploadResponse> => {
	const formData = new FormData();
	formData.append("file", file);

	const headers: Record<string, string> = {};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	} else if (typeof window !== "undefined") {
		const authHeaders = getAuthHeader();
		Object.assign(headers, authHeaders);
	}

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable) {
				const percentComplete = (event.loaded / event.total) * 100;
				onProgress(percentComplete);
			}
		});

		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					const response = JSON.parse(xhr.responseText);
					resolve(response);
				} catch {
					reject(new Error("Failed to parse upload response"));
				}
			} else {
				reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
			}
		});

		xhr.addEventListener("error", () => {
			reject(new Error("Upload request failed"));
		});

		xhr.addEventListener("abort", () => {
			reject(new Error("Upload cancelled"));
		});

		xhr.open("POST", `${baseUrl}/files/${documentType}/id/${entityId}`);

		Object.entries(headers).forEach(([key, value]) => {
			xhr.setRequestHeader(key, value);
		});

		xhr.send(formData);
	});
};

/**
 * Get a fresh access URL for a stored file.
 * Call this when a presigned URL has expired (private files only).
 *
 * @param documentType - The DocumentType of the file
 * @param objectName   - The stored object path (photoUrl from upload response)
 * @param token        - Optional token for server-side requests
 * @returns Fresh accessUrl string
 */
export const getFileAccessUrl = async (
	documentType: DocumentType,
	objectName: string,
	token?: string
): Promise<string> => {
	const headers: Record<string, string> = {};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	} else if (typeof window !== "undefined") {
		const authHeaders = getAuthHeader();
		Object.assign(headers, authHeaders);
	}

	const params = new URLSearchParams({ objectName });
	const response = await fetch(
		`${baseUrl}/files/access/${documentType}?${params}`,
		{ headers }
	);

	if (!response.ok) {
		throw new Error(
			`Failed to get file access URL: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();
	return data.accessUrl;
};
