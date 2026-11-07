"use client";

import { useRef, useState } from "react";
import { Building2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/api/files";
import { Button } from "@/components/ui/button";
import { coverFileProblem } from "@/lib/cover-upload";
import { qk } from "@/lib/query-keys";
import { DocumentType } from "@/types/file";

/**
 * The main picture of a hospital. The server saves the file on the hospital as soon as it is uploaded, so this works only
 * for a hospital that already exists. JPEG, PNG or WebP, up to 5 MB (the server checks the file's own bytes again).
 */
export function HospitalImageUpload({ hospitalId, imageUrl }: { hospitalId: number | string; imageUrl?: string | null }) {
	const queryClient = useQueryClient();
	const input = useRef<HTMLInputElement>(null);
	const [current, setCurrent] = useState<string | null>(imageUrl ?? null);
	const [uploading, setUploading] = useState(false);

	const choose = async (file: File | undefined) => {
		if (!file) return;
		const problem = coverFileProblem(file);
		if (problem) return toast.error(problem);
		setUploading(true);
		try {
			const result = await uploadFile(DocumentType.HOSPITAL_IMAGE, Number(hospitalId), file);
			setCurrent(result.accessUrl);
			toast.success("Hospital picture uploaded");
			void queryClient.invalidateQueries({ queryKey: [...qk.hospitals] });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not upload the picture");
		} finally {
			setUploading(false);
			if (input.current) input.current.value = "";
		}
	};

	return (
		<div className="space-y-2">
			<p className="text-sm font-medium">Picture (optional)</p>
			<div className="flex items-center gap-4">
				<div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-muted-foreground">
					{current ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={current} alt="" className="size-full object-cover" />
					) : (
						<Building2 className="size-8" aria-hidden="true" />
					)}
				</div>
				<div className="space-y-1">
					<Button type="button" variant="outline" disabled={uploading} onClick={() => input.current?.click()}>
						<Upload className="mr-2 size-4" aria-hidden="true" />
						{uploading ? "Uploading..." : current ? "Change picture" : "Upload picture"}
					</Button>
					<p className="text-xs text-muted-foreground">JPEG, PNG or WebP, up to 5 MB. Saved as soon as it is uploaded.</p>
				</div>
				<input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => void choose(e.target.files?.[0])} />
			</div>
		</div>
	);
}
