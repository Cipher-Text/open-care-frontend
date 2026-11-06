"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProfilePictureUploadModal } from "@/components/admin/profile-picture-upload-modal";
import { BloodDonorChoice } from "@/components/account/blood-donor-choice";
import { ProfileDetailsForm } from "@/components/account/profile-details-form";
import { HealthDataConsent } from "@/components/account/health-data-consent";
import { MessageLanguageChoice } from "@/components/account/message-language-choice";
import { PublicPhoneChoice } from "@/components/account/public-phone-choice";
import { VerificationCard } from "@/components/account/verification-card";
import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { fetchMyVerifications } from "@/api/verification";
import { SocialLinksForm } from "@/components/account/social-links-form";
import { getSelfProfile } from "@/api/profile";
import { UserProfile } from "@/types/profile";
import {
	Phone,
	Mail,
	Droplets,
	Heart,
	Shield,
	ExternalLink,
	Edit,
	Camera,
} from "lucide-react";
import { format } from "date-fns";
import { SafeLink } from "@/components/common/SafeLink";

const OTHER_LINKS = [
	{ key: "facebookPageUrl", label: "Facebook page" },
	{ key: "instagramProfileUrl", label: "Instagram" },
	{ key: "youtubeChannelUrl", label: "YouTube" },
	{ key: "websiteUrl", label: "Website" },
	{ key: "blogUrl", label: "Blog" },
] as const;

export default function ProfilePage() {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [uploadModalOpen, setUploadModalOpen] = useState(false);

	// A doctor is verified when one of their requests has been approved; the badge stays through a renewal
	const myVerifications = useQuery({ queryKey: [...qk.myVerifications], queryFn: fetchMyVerifications, retry: false, enabled: profile?.userType?.value === "DOCTOR" });
	const doctorVerified = (myVerifications.data ?? []).some((c) => c.subjectType === "DOCTOR" && c.status === "VERIFIED");

	const fetchProfile = async () => {
		try {
			const profileData = await getSelfProfile();
			setProfile(profileData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load profile");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	const formatDate = (dateString: string) => {
		try {
			return format(new Date(dateString), "MMM dd, yyyy");
		} catch {
			return "N/A";
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	if (loading) {
		return (
			<div className="flex flex-col">
				<AdminHeader
					title="Profile"
					description="Manage your personal profile and account settings"
				/>
				<div className="flex items-center justify-center min-h-96 p-8">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col">
				<AdminHeader
					title="Profile"
					description="Manage your personal profile and account settings"
				/>
				<div className="flex items-center justify-center min-h-96 p-8">
					<Card className="w-full max-w-md">
						<CardContent className="pt-6">
							<div className="text-center text-destructive">
								<p>Error: {error}</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex flex-col">
				<AdminHeader
					title="Profile"
					description="Manage your personal profile and account settings"
				/>
				<div className="flex items-center justify-center min-h-96 p-8">
					<p>No profile data found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<AdminHeader
				title="Profile"
				description="Manage your personal profile and account settings"
			/>

			<div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
				{/* Header Card */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
							<div className="relative">
								<Avatar className="h-24 w-24">
									<AvatarImage
										src={profile.imageUrl || profile.photoUrl || ""}
										alt={profile.name}
									/>
									<AvatarFallback className="text-lg">
										{getInitials(profile.name)}
									</AvatarFallback>
								</Avatar>
								<Button
									size="sm"
									variant="outline"
									className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
									onClick={() => setUploadModalOpen(true)}
								>
									<Camera className="h-4 w-4" />
								</Button>
							</div>

							<div className="flex-1 space-y-2">
								<div className="flex flex-col md:flex-row md:items-center gap-2">
									<h1 className="text-2xl font-bold">{profile.name}</h1>
									<Badge variant="secondary" className="w-fit">
										{profile.userType.displayName}
									</Badge>
									{!profile.isActive && <Badge variant="outline" className="w-fit">Inactive</Badge>}
								</div>
								<p className="text-muted-foreground">@{profile.username}</p>
								<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<Mail className="h-4 w-4" />
										{profile.email}
									</div>
									<div className="flex items-center gap-1">
										<Phone className="h-4 w-4" />
										{profile.phone}
									</div>
									{profile.bloodGroup && (
										<div className="flex items-center gap-1">
											<Droplets className="h-4 w-4 text-destructive" />
											{profile.bloodGroup.displayName}
										</div>
									)}
								</div>
							</div>

							<Button
								className="flex items-center gap-2"
								onClick={() => document.getElementById("profile-details")?.scrollIntoView({ behavior: "smooth", block: "start" })}
							>
								<Edit className="h-4 w-4" />
								Edit Profile
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* The person's own details: name, phone, date of birth, gender, address and place */}
				<div id="profile-details" className="scroll-mt-20">
					<ProfileDetailsForm profile={profile} onSaved={(next) => setProfile(next)} />
				</div>

				{/* Blood donor choice (the person's own) */}
				<BloodDonorChoice profile={profile} onSaved={(next) => setProfile({ ...profile, ...next })} />

				{/* Public phone (doctors only, their own choice) */}
				{profile.userType?.value === "DOCTOR" && (
					<PublicPhoneChoice profile={profile} onSaved={(next) => setProfile({ ...profile, ...next })} />
				)}

				{/* Verification (doctors only) */}
				{profile.userType?.value === "DOCTOR" && <VerificationCard verified={doctorVerified} />}

				{/* Language of text messages (the person's own) */}
				<MessageLanguageChoice profile={profile} onSaved={(next) => setProfile({ ...profile, ...next })} />

				{/* Health data consent (the person's own) */}
				<HealthDataConsent profile={profile} onSaved={(next) => setProfile({ ...profile, ...next })} />

				{/* Blood Donation & Volunteer Status */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Heart className="h-5 w-5 text-destructive" />
								Blood Donation
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{profile.isBloodDonor && (
								<>
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">Donation Count</span>
										<span className="font-semibold">
											{profile.bloodDonationCount}
										</span>
									</div>
									{profile.lastBloodDonationDate && (
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">Last Donation</span>
											<span className="text-sm">
												{formatDate(profile.lastBloodDonationDate)}
											</span>
										</div>
									)}
								</>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-primary" />
								Other Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Volunteer</span>
								<Badge variant={profile.isVolunteer ? "default" : "secondary"}>
									{profile.isVolunteer ? "Yes" : "No"}
								</Badge>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Social links (the person's own) */}
				<SocialLinksForm profile={profile} onSaved={(next) => setProfile(next)} />

				{/* Other links on the record, shown but not editable here */}
				{OTHER_LINKS.some(({ key }) => profile[key]?.trim()) && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ExternalLink className="h-5 w-5" />
								Other links
							</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{OTHER_LINKS.filter(({ key }) => profile[key]?.trim()).map(({ key, label }) => (
								<div key={key}>
									<span className="text-sm font-medium text-muted-foreground">{label}</span>
									<p className="mt-1">
										<SafeLink href={profile[key]} className="text-primary hover:underline flex items-center gap-1">
											View
											<ExternalLink className="h-3 w-3" />
										</SafeLink>
									</p>
								</div>
							))}
						</CardContent>
					</Card>
				)}
			</div>

			{/* Profile Picture Upload Modal */}
			{profile && (
				<ProfilePictureUploadModal
					isOpen={uploadModalOpen}
					onClose={() => setUploadModalOpen(false)}
					onSuccess={() => {
						setUploadModalOpen(false);
						fetchProfile();
					}}
					entityId={profile.id}
				/>
			)}
		</div>
	);
}
