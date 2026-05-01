import React, { useEffect } from "react";
import RegionList from "~/components/RegionList";
import LocationList from "~/components/LocationList";
import ItemTracker from "~/components/ItemTracker";
import QuestTracker from "~/components/QuestTracker";
import SongTracker from "~/components/SongTracker";
import { useRouter } from "next/router";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { idAtom, errorTextAtom, winScreenOpenAtom } from "~/utils/atoms";
import { usePlaythrough, useDownloadLog } from "~/utils/api";
import ErrorBox from "~/components/ErrorBox";

const Trackers = ({
	items,
	knownLocations,
}: {
	items: string[];
	knownLocations: Record<string, string>;
}) => {
	const itemLocations = Object.keys(knownLocations).reduce<
		Record<string, string[]>
	>(
		(a, v) => ({
			...a,
			[knownLocations[v]!]: [...(a[knownLocations[v]!] ?? []), v],
		}),
		{}
	);
	return (
		<div className="flex flex-col items-center justify-around gap-1 bg-gray-700 p-4 sm:flex-row md:gap-4 2xl:flex-col">
			<SongTracker
				items={items}
				itemLocations={itemLocations}
				className="grid grid-flow-row grid-cols-6 sm:grid-flow-col sm:grid-cols-1 sm:grid-rows-6 2xl:grid-flow-row 2xl:grid-cols-6 2xl:grid-rows-1"
			/>
			<ItemTracker items={items} itemLocations={itemLocations} />
			<QuestTracker items={items} itemLocations={itemLocations} />
		</div>
	);
};

const WinScreen = ({
	checked,
	locations,
	createdAt,
	finishedAt,
	closeWinScreen,
	downloadLog,
}: {
	checked: number;
	locations: number;
	createdAt: Date;
	finishedAt: Date;
	closeWinScreen: () => void;
	downloadLog: () => void;
}) => {
	const elapsedMs = finishedAt.getTime() - createdAt.getTime();
	const hours = Math.floor(elapsedMs / 1000 / 60 / 60);
	const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / 1000 / 60);
	const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
	const timeStr = `${hours.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	const errorText = useAtomValue(errorTextAtom);

	return (
		<div className="fixed top-0 z-[998] col-start-1 row-start-1 h-screen w-full bg-black bg-opacity-70 text-center text-white">
			<div className="grid h-full place-items-center">
				<div className="flex flex-col gap-4">
					<h2 className="text-6xl font-bold tracking-wide">You win!</h2>
					<span className="text-xl">
						Locations checked: {checked}/{locations}
					</span>
					<span className="text-xl">Total time: {timeStr}</span>
					<button
						className="text-xl font-semibold underline"
						onClick={() => closeWinScreen()}
					>
						Close
					</button>
					<button
						className="text-xl font-semibold underline"
						onClick={() => downloadLog()}
					>
						Download log
					</button>
					<ErrorBox error={errorText} />
				</div>
			</div>
		</div>
	);
};

const Cojiro = () => {
	const router = useRouter();
	const { id } = router.query;
	const playthroughId = Array.isArray(id) ? id[0] : id;
	const [winScreenOpen, setWinScreenOpen] = useAtom(winScreenOpenAtom);
	const setId = useSetAtom(idAtom);
	const setErrorText = useSetAtom(errorTextAtom);
	const { data: playthrough, isLoading } = usePlaythrough(playthroughId!);
	const downloadLog = useDownloadLog(playthroughId!);

	useEffect(() => {
		setErrorText("");
	}, [id, setErrorText]);

	if (!id || !playthrough || isLoading) {
		if (isLoading) {
			return <div>Loading...</div>;
		} else {
			return <div>Unknown error in Cojiro component.</div>;
		}
	}
	setId(playthroughId!);

	return (
		<div className="flex h-screen flex-col bg-background">
			{/* Header */}
			<header className="bg-stone-950/80 backdrop-blur-md font-serif font-bold tracking-widest uppercase border-stone-800 border-b-[1px] shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex justify-between items-center px-6 h-16 w-full z-50 shrink-0">
				<div className="flex items-center gap-4">
					<span className="text-2xl font-black text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] font-h2 text-h2">
						Hyrule Tracker
					</span>
				</div>
				<nav className="flex items-center gap-6">
					<a
						className="text-stone-400 hover:bg-stone-800/50 hover:text-yellow-200 transition-all px-4 py-2 rounded font-label-caps text-label-caps flex items-center gap-2 border border-outline-variant"
						href={`//github.com/christianlegge/cojiro/issues/new?body=**Describe issue here**%0APlease be as specific as possible!%0A%0A---- DO NOT EDIT BELOW THIS LINE ----%0APlaythrough id: ${playthroughId}`}
						target="_blank"
						rel="noreferrer"
					>
						<span className="material-symbols-outlined text-[16px]">chat</span>
						Feedback
					</a>
				</nav>
			</header>
			{/* Main content */}
			<div
				className="flex flex-1 overflow-hidden"
				style={{ imageRendering: "crisp-edges" }}
			>
				{/* Left Sidebar */}
				<aside className="bg-black font-serif tracking-tight h-full w-64 border-r border-stone-800 flex flex-col overflow-y-auto shrink-0 hidden md:flex">
					<RegionList />
				</aside>
				{/* Center Column (Map) */}
				<main className="flex-1 flex flex-col relative overflow-hidden bg-surface-container-lowest">
					<LocationList />
				</main>
				{/* Right Sidebar (Inventory Grid) */}
				<aside className="w-[320px] lg:w-[380px] bg-surface-container-high border-l border-outline-variant/30 flex flex-col shrink-0 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
					<div className="absolute inset-0 w-full h-full bg-no-repeat bg-right bg-cover opacity-20" style={{ backgroundImage: "url('/images/bg/playing-hyrule-field.png.png')" }} />
					<div className="relative z-10 p-4 overflow-y-auto">
						<Trackers
							items={playthrough.items}
							knownLocations={playthrough.known_locations}
						/>
					</div>
				</aside>
			</div>
			{playthrough.finished && winScreenOpen && (
				<WinScreen
					checked={
						playthrough.checked.filter((el) =>
							playthrough.locations.includes(el)
						).length
					}
					locations={playthrough.locations.length}
					createdAt={playthrough.createdAt}
					finishedAt={playthrough.finishedAt}
					closeWinScreen={() => setWinScreenOpen(false)}
					downloadLog={() => void downloadLog()}
				/>
			)}
		</div>
	);
};

export default Cojiro;
