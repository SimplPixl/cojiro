import React, { useEffect, useState } from "react";
import ErrorBox from "~/components/ErrorBox";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAtom } from "jotai";
import { useSetAtom } from "jotai";
import { ageAtom, regionAtom, errorTextAtom } from "~/utils/atoms";
import Layout from "~/components/Layout";
import { useSession } from "next-auth/react";
import { MdWarningAmber } from "react-icons/md";
import { formatFilename } from "~/utils/filename";
import Image from "next/image";

interface UploadResponse {
  id: string;
  token?: string;
}

const InProgressPlaythroughCard = ({
	medallions,
	startTime,
	checked,
	locations,
}: {
	medallions: string[];
	startTime: Date;
	checked: number;
	locations: number;
}) => {
	const seconds = (Date.now() - startTime.getTime()) / 1000;
	const rtf = new Intl.RelativeTimeFormat();
	const relTimeString =
		seconds < 60
			? rtf.format(-seconds, "second")
			: seconds < 60 * 60
			? rtf.format(-seconds / 60, "minute")
			: seconds < 60 * 60 * 24
			? rtf.format(-seconds / 60 / 60, "hour")
			: seconds < 60 * 60 * 24 * 7
			? rtf.format(-seconds / 60 / 60 / 24, "day")
			: seconds < 60 * 60 * 24 * 30
			? rtf.format(-seconds / 60 / 60 / 24 / 7, "week")
			: seconds < 60 * 60 * 24 * 365
			? rtf.format(-seconds / 60 / 60 / 24 / 30, "month")
			: rtf.format(-seconds / 60 / 60 / 24 / 365, "year");
	return (
		<div className="w-40 cursor-pointer rounded-lg border shadow-md">
			<div className="flex relative">
				{medallions.map((el) => (
					<Image
						objectFit="contain"
						key={el}
						width={0}
						height={0}
						className="h-full w-auto"
						sizes="100vw"
						src={`/images/${formatFilename(el)}.png`}
						alt={el}
					/>
				))}
			</div>

			{`${checked}/${locations}`}
			<br />
			{relTimeString}
		</div>
	);
};

const StartForm = () => {
	const router = useRouter();
	const [error, setError] = useAtom(errorTextAtom);
	const [uploading, setUploading] = useState(false);
	const [jwt, setJwt] = useState<string | null>(null);

	const setAge = useSetAtom(ageAtom);
	const setRegion = useSetAtom(regionAtom);

	const { status } = useSession();

	const jwtPlaythroughs = api.jwt.getPlaythroughs.useQuery(
		{ token: jwt! },
		{
			enabled: jwt !== null,
			onSuccess({ newToken }) {
				localStorage.setItem("playthroughsJwt", newToken);
			},
			onError(err) {
				console.error(err);
				localStorage.removeItem("playthroughsJwt");
				setJwt(null);
			},
		}
	);

	const userPlaythroughs = api.user.getPlaythroughs.useQuery();

	useEffect(() => {
		setJwt(localStorage.getItem("playthroughsJwt"));
	}, []);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploading(true);
		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;

			fetch("/api/upload-spoiler", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ spoilerLog: content }),
			})
				.then(async (response) => {
					if (!response.ok) {
						const errorData = await response.json() as { error?: string };
						throw new Error(errorData.error ?? "Upload failed");
					}

					const data = await response.json() as UploadResponse;

					// Save JWT token if provided
					if (data.token) {
						localStorage.setItem("playthroughsJwt", data.token);
					}

					// Redirect to the playthrough
					setAge("child");
					setRegion("Kokiri Forest");
					void router.push(`/play/${data.id}`);
				})
				.catch((err: unknown) => {
					if (err instanceof Error) {
						setError(err.message);
					} else {
						setError("Upload failed");
					}
				})
				.finally(() => {
					setUploading(false);
				});
		};
		reader.readAsText(file);
	};

	const inProgressPlaythroughs = (
		jwtPlaythroughs.data?.playthroughs ?? []
	).concat(userPlaythroughs.data ?? []);

	return (
		<Layout>
			<div className="grid h-full place-items-center bg-[url('/images/bg/hyrule-field-mountain.png')] bg-cover bg-center">
				<div className="grid place-items-center gap-4 rounded-lg bg-gray-300 bg-opacity-50 p-8 backdrop-blur-md">
					{status === "unauthenticated" && (
						<div className="flex w-[65ch] items-center justify-center gap-1 rounded-lg bg-amber-200 p-2">
							<MdWarningAmber className="w-8" />
							You are not signed in. You may play as a guest, but the game will
							be deleted after 3 days, will not be tracked for stats, and can be
							claimed by anyone with the URL.
						</div>
					)}
					<h2 className="text-2xl font-semibold">Upload Spoiler Log</h2>
					<p className="w-[65ch] text-center text-sm text-gray-700">
						Generate a seed at{" "}
						<a
							href="https://ootrandomizer.com/"
							className="text-blue-600 underline"
							target="_blank"
							rel="noreferrer"
						>
							ootrandomizer.com
						</a>{" "}
						with &quot;Create Spoiler Log&quot; enabled, then upload the JSON file here.
					</p>
					<div className="flex flex-col items-center gap-4">
						<input
							type="file"
							accept=".json"
							onChange={handleFileUpload}
							disabled={uploading}
							className="file:mr-4 file:rounded-lg file:border file:bg-indigo-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:shadow-md hover:file:bg-indigo-800"
						/>
						{uploading && (
							<div className="flex items-center gap-2">
								<span className="inline-block animate-spin">.</span>
								<span>Uploading...</span>
							</div>
						)}
					</div>
					<ErrorBox error={error} />
					<h2>In progress games</h2>
					<ul className="flex max-w-4xl flex-wrap justify-center gap-4">
						{inProgressPlaythroughs.length === 0 ? (
							<span>None!</span>
						) : (
							inProgressPlaythroughs.map((el) => (
								<Link key={el.id} href={`/play/${el.id}`}>
									<li>
										<InProgressPlaythroughCard
											medallions={el.medallions}
											startTime={el.startTime}
											checked={el.checked}
											locations={el.locations}
										/>
									</li>
								</Link>
							))
						)}
					</ul>
				</div>
			</div>
		</Layout>
	);
};

export default StartForm;
