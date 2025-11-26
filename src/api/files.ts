import { baseUrl } from "@/config/config";
import { DocumentType, FileUploadResponse } from "@/types/file";
import { getAuthHeader } from "@/lib/auth-client";

/**
 * Upload a file to a specific directory (DocumentType)
 * @param directory - The DocumentType directory to upload to
 * @param file - The file to upload
 * @param token - Optional token for server-side requests
 * @returns FileUploadResponse with photoUrl and presignedUrl
 */
export const uploadFile = async (
	directory: DocumentType,
	file: File,
	token?: string
): Promise<FileUploadResponse> => {
	const formData = new FormData();
	formData.append("file", file);

	const headers: Record<string, string> = {};

	// Use provided token or get from client storage
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	} else if (typeof window !== "undefined") {
		const authHeaders = getAuthHeader();
		Object.assign(headers, authHeaders);
	}

	const response = await fetch(`${baseUrl}/files/${directory}`, {
		method: "POST",
		headers,
		body: formData,
	});

	if (!response.ok) {
		throw new Error(
			`Failed to upload file: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * Upload multiple files to a specific directory
 * @param directory - The DocumentType directory to upload to
 * @param files - Array of files to upload
 * @param token - Optional token for server-side requests
 * @returns Array of FileUploadResponse objects
 */
export const uploadFiles = async (
	directory: DocumentType,
	files: File[],
	token?: string
): Promise<FileUploadResponse[]> => {
	const uploadPromises = files.map((file) =>
		uploadFile(directory, file, token)
	);

	return Promise.all(uploadPromises);
};

/**
 * Upload a file with progress tracking
 * @param directory - The DocumentType directory to upload to
 * @param file - The file to upload
 * @param onProgress - Callback function for progress updates (0-100)
 * @param token - Optional token for server-side requests
 * @returns FileUploadResponse with photoUrl and presignedUrl
 */
export const uploadFileWithProgress = async (
	directory: DocumentType,
	file: File,
	onProgress: (progress: number) => void,
	token?: string
): Promise<FileUploadResponse> => {
	const formData = new FormData();
	formData.append("file", file);

	const headers: Record<string, string> = {};

	// Use provided token or get from client storage
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	} else if (typeof window !== "undefined") {
		const authHeaders = getAuthHeader();
		Object.assign(headers, authHeaders);
	}

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		// Track upload progress
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

		xhr.open("POST", `${baseUrl}/files/${directory}`);

		// Add authorization header
		Object.entries(headers).forEach(([key, value]) => {
			xhr.setRequestHeader(key, value);
		});

		xhr.send(formData);
	});
};
