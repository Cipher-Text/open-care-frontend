/** The file rules of a blog cover image; the server checks the same again from the file's own bytes (`FileUploadPolicy`). */
export const COVER_MAX_BYTES = 5 * 1024 * 1024;
export const COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Null when the file can be uploaded, else what is wrong in plain words. */
export function coverFileProblem(file: { type: string; size: number }): string | null {
	if (!COVER_TYPES.includes(file.type)) return "Use a JPEG, PNG or WebP picture.";
	if (file.size <= 0) return "That file is empty.";
	if (file.size > COVER_MAX_BYTES) return "The picture is bigger than 5 MB. Make it smaller and try again.";
	return null;
}
