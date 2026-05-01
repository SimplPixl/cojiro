import React from "react";
import CheckSquare from "./CheckSquare";
import { FiExternalLink } from "react-icons/fi";
import ErrorBox from "./ErrorBox";
import { usePlaythrough, api } from "~/utils/api";
import { useAtomValue } from "jotai";
import {
	idAtom,
	ageAtom,
	regionAtom,
	mapHeaderTextAtom,
	errorTextAtom,
} from "../utils/atoms";
import regions from "../utils/regions";
import { fetchingAtom } from "../utils/atoms";
import { formatFilename } from "../utils/filename";
import Image from "next/image";
import { selectedCheckAtom } from "../utils/atoms";

function locationDisplayName(name: string, region: string): string {
	const parensMatch = /\(([^)]+)\)/.exec(name);
	if (parensMatch) {
		return `${parensMatch[1]} Gossip Stone`;
	}
	if (name.startsWith(region)) {
		return name.slice(region.length);
	}
	if (/^[A-Z]+ /.test(name) || name.startsWith("Kak ")) {
		return name.slice(name.indexOf(" ") + 1);
	} else {
		return name;
	}
}

const checkTypes = ["locations", "gossip_stones", "entrances"] as const;

const LocationList = () => {
	const id = useAtomValue(idAtom);
	const { data: playthrough, error, status } = usePlaythrough(id);

	const age = useAtomValue(ageAtom);
	const region = useAtomValue(regionAtom);

	const fetching = useAtomValue(fetchingAtom);
	const headerText = useAtomValue(mapHeaderTextAtom);
	const errorText = useAtomValue(errorTextAtom);

	const { data: freestandingItems } =
		api.playthrough.getFreestandingItems.useQuery({
			id: id,
			locations: Object.keys(regions[region]!.locations).filter((loc) =>
				loc.includes("Freestanding")
			),
		});

	if (!playthrough) {
		if (status === "loading") {
			return <div>Loading...</div>;
		} else {
			return (
				<div>
					Error in ItemTracker: {error ? error.message : "Unknown error"}
				</div>
			);
		}
	}
	const pathTo = playthrough.known_paths[region];

	if (!(region in regions)) {
		return <div>Error! region not set correctly</div>;
	}
	
	const selectedCheckName = useAtomValue(selectedCheckAtom);
	
	// Derive the display name and item from the selected check
	const selectedCheckDisplay = selectedCheckName ? (() => {
		// Find the check in the current region's locations
		for (const checkType of checkTypes) {
			if (checkType === "locations" && selectedCheckName in regions[region]![checkType]) {
				const displayName = checkType === "entrances" 
					? `To ${regions[selectedCheckName]!.name}`
					: locationDisplayName(selectedCheckName, region);
				const item = playthrough.known_locations[selectedCheckName] ?? 
					(freestandingItems ? freestandingItems[selectedCheckName] : undefined) ??
					"Unknown";
				return { name: displayName, item };
			}
		}
		return null;
	})() : null;
	
	return (
		<div className="relative flex h-full flex-col bg-surface-container-lowest text-on-surface">
			{/* Map with overlay */}
			<div className="relative flex-1 overflow-hidden flex items-center justify-center p-6">
				{/* Wrapper that maintains image aspect ratio */}
				<div className="relative w-full">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						src={`/images/maps/${formatFilename(region)}.jpg`}
						alt=""
						className="mx-auto h-full w-full object-contain opacity-80"
					/>
					<div className="absolute inset-0 bg-background/20 mix-blend-multiply" />
				
					{/* Map markers - positioned INSIDE the image wrapper so they align with the image */}
					{checkTypes.flatMap((checkType) =>
						Object.keys(regions[region]![checkType])
							.filter(
								(el) =>
									regions[region]![checkType][el]![age] &&
										(regions[region]![checkType][el]!.always! ||
											checkType === "gossip_stones" ||
											checkType === "entrances" ||
											playthrough.locations.includes(el) ||
											el.includes("GS"))
							)
							.map((el) => (
								<CheckSquare
									type={checkType}
									key={el}
									check={el}
									coords={{
										top: `${regions[region]![checkType][el]!.top}%`,
										left: `${regions[region]![checkType][el]!.left}%`,
									}}
									displayName={
										checkType === "entrances"
											? `To ${regions[el]!.name}`
											: locationDisplayName(el, region)
									}
									checked={el !== "Ganon" && playthrough.checked.includes(el)}
									item={
										checkType === "locations"
											? playthrough.known_locations[el] ??
											  (freestandingItems ? freestandingItems[el] : undefined)
											: undefined
									}
								/>
							))
					)}
				</div>
			
			{/* CENTER overlay - shows selected check info - positioned in center of map area */}
			{selectedCheckDisplay && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
					<div className="glass-panel px-8 py-6 rounded-2xl text-center pointer-events-auto border-2 border-tertiary/50">
						<div className="font-h2 text-h2 text-primary mb-2">{selectedCheckDisplay.name}</div>
						<div className="font-stat-num text-stat-num text-tertiary text-xl">
							{selectedCheckDisplay.item}
						</div>
					</div>
				</div>
			)}
			</div>
			
			{/* Top-left overlay: Region name + stats + zoom controls */}
			<div className="absolute inset-0 z-10 flex flex-col pointer-events-none p-6">
				<div className="flex justify-between items-start">
					<div className="glass-panel p-4 rounded-lg pointer-events-auto">
						<h1 className="font-h1 text-h1 text-primary drop-shadow-md">{region}</h1>
						<div className="flex items-center gap-4 mt-2">
							<div className="flex items-center gap-1 text-tertiary">
								<span className="material-symbols-outlined fill text-[16px]">star</span>
								<span className="font-stat-num text-stat-num">3/3</span>
							</div>
							<div className="flex items-center gap-1 text-on-surface-variant">
								<span className="material-symbols-outlined text-[16px]">favorite</span>
								<span className="font-stat-num text-stat-num">1/2</span>
							</div>
						</div>
					</div>
					<div className="glass-panel p-2 flex gap-2 rounded-lg pointer-events-auto">
						<button className="w-10 h-10 flex items-center justify-center rounded bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant">
							<span className="material-symbols-outlined">zoom_in</span>
						</button>
						<button className="w-10 h-10 flex items-center justify-center rounded bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant">
							<span className="material-symbols-outlined">zoom_out</span>
						</button>
					</div>
				</div>
					
				{/* Bottom: Progress bar */}
				<div className="mt-auto flex justify-center">
					<div className="glass-panel px-6 py-3 rounded-full flex items-center gap-4 pointer-events-auto">
						<span className="font-label-caps text-label-caps text-on-surface-variant">Area Progress</span>
						<div className="w-48 h-[4px] bg-surface-variant rounded-full overflow-hidden">
							<div className="h-full progress-gradient w-2/3"></div>
						</div>
						<span className="font-stat-num text-stat-num text-tertiary">66%</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LocationList;
