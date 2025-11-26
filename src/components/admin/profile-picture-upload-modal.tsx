"use client";

import React, { useState, useRef } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { uploadFileWithProgress } from "@/api/files";
import { DocumentType } from "@/types/file";
import { Upload, X, AlertCircle } from "lucide-react";

interface ProfilePictureUploadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: (photoUrl?: string, presignedUrl?: string) => void;
	token?: string;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes
const ASPECT_RATIO = 1; // 1:1 ratio

export const ProfilePictureUploadModal: React.FC<
	ProfilePictureUploadModalProps
> = ({ isOpen, onClose, onSuccess, token }) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string>("");
	const [imageDimensions, setImageDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Validate image dimensions
	const validateAspectRatio = (
		file: File
	): Promise<{ valid: boolean; width: number; height: number }> => {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					const aspectRatio = img.width / img.height;
					const valid = Math.abs(aspectRatio - ASPECT_RATIO) < 0.05; // Allow 5% tolerance
					resolve({ valid, width: img.width, height: img.height });
				};
				img.src = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		});
	};

	// Handle file selection
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setError("");
		const file = event.target.files?.[0];

		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			setError("Please select an image file (JPG, PNG, WebP, etc.)");
			return;
		}

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			setError(
				`File size exceeds 1 MB. Your file is ${(
					file.size /
					1024 /
					1024
				).toFixed(2)} MB`
			);
			return;
		}

		// Validate aspect ratio
		const { valid, width, height } = await validateAspectRatio(file);
		if (!valid) {
			setError(
				`Image must have a 1:1 aspect ratio (square). Your image is ${width}×${height}`
			);
			return;
		}

		setImageDimensions({ width, height });
		setSelectedFile(file);

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	// Handle file input click
	const handleChooseFile = () => {
		fileInputRef.current?.click();
	};

	// Handle upload
	const handleUpload = async () => {
		if (!selectedFile) return;

		setUploading(true);
		setProgress(0);

		try {
			const response = await uploadFileWithProgress(
				DocumentType.PROFILE_PICTURE,
				selectedFile,
				(progressPercent) => setProgress(progressPercent),
				token
			);

			// Show the uploaded image
			setUploadedImageUrl(response.presignedUrl);
			onSuccess(response.photoUrl, response.presignedUrl);

			// Auto-close after 2 seconds
			setTimeout(() => {
				handleClose();
			}, 2000);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to upload profile picture"
			);
		} finally {
			setUploading(false);
			setProgress(0);
		}
	};

	// Handle close
	const handleClose = () => {
		setSelectedFile(null);
		setPreview(null);
		setError("");
		setProgress(0);
		setImageDimensions(null);
		setUploadedImageUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		onClose();
	};

	const getFileSizeDisplay = (bytes: number): string => {
		return (bytes / 1024).toFixed(2);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Profile Picture</DialogTitle>
					<DialogDescription>
						Choose a square image (JPG, PNG, WebP) up to 1 MB
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Success Message with Uploaded Image */}
					{uploadedImageUrl ? (
						<div className="text-center space-y-4">
							<div className="flex justify-center">
								<div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-green-200 flex items-center justify-center bg-green-50">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={uploadedImageUrl}
										alt="Uploaded"
										className="w-full h-full object-cover"
									/>
								</div>
							</div>
							<div className="bg-green-50 border border-green-200 rounded-lg p-3">
								<p className="text-sm font-medium text-green-900">
									✓ Upload Successful!
								</p>
								<p className="text-xs text-green-800 mt-1">
									Your profile picture has been updated
								</p>
							</div>
						</div>
					) : preview ? (
						<div className="relative mx-auto">
							<div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-50">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={preview}
									alt="Preview"
									className="w-full h-full object-cover"
								/>
							</div>
							<button
								onClick={() => {
									setPreview(null);
									setSelectedFile(null);
									setImageDimensions(null);
									if (fileInputRef.current) {
										fileInputRef.current.value = "";
									}
								}}
								className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
								disabled={uploading}
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					) : (
						<div
							className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
							onClick={handleChooseFile}
						>
							<Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
							<p className="text-sm font-medium text-gray-900">
								Click to upload or drag and drop
							</p>
							<p className="text-xs text-gray-500 mt-1">
								JPG, PNG, WebP (1:1 ratio, max 1 MB)
							</p>
						</div>
					)}

					{/* File Input */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
					/>

					{/* Error Alert */}
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{/* File Info */}
					{selectedFile && !error && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
							<p className="text-sm font-medium text-blue-900">File Details</p>
							<p className="text-xs text-blue-800">Name: {selectedFile.name}</p>
							<p className="text-xs text-blue-800">
								Size: {getFileSizeDisplay(selectedFile.size)} KB
							</p>
							{imageDimensions && (
								<p className="text-xs text-blue-800">
									Dimensions: {imageDimensions.width}×{imageDimensions.height}px
								</p>
							)}
						</div>
					)}

					{/* Progress Bar */}
					{uploading && (
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-gray-700">
									Uploading...
								</span>
								<span className="text-sm text-gray-600">
									{Math.round(progress)}%
								</span>
							</div>
							<Progress value={progress} className="h-2" />
						</div>
					)}
				</div>

				<DialogFooter className="flex gap-2">
					<Button variant="outline" onClick={handleClose} disabled={uploading}>
						Cancel
					</Button>
					<Button
						onClick={handleChooseFile}
						disabled={uploading || !!preview}
						variant="outline"
					>
						Choose File
					</Button>
					<Button
						onClick={handleUpload}
						disabled={!selectedFile || uploading || !!error}
					>
						{uploading ? "Uploading..." : "Upload"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
