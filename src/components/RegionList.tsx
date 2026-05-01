import React, { useCallback, useState } from "react";
import regions from "../utils/regions";
import Tag from "./Tag";
import { formatFilename } from "~/utils/filename";
import { usePlaythrough } from "~/utils/api";
import { useAtom, useAtomValue } from "jotai";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { idAtom, ageAtom, regionAtom } from "../utils/atoms";
import Image from "next/image";

const RegionList = () => {
	const id = useAtomValue(idAtom);
	const { data: playthrough, error, status } = usePlaythrough(id);
	const age = useAtomValue(ageAtom);
	const [region, setRegion] = useAtom(regionAtom);
	const [collapsed, setCollapsed] = useState(true);
	const smallKeyCount = useCallback(
		(dungeon: string) => {
			if (!playthrough) {
				return 0;
			}
			if (playthrough.items.includes(`Small Key Ring (${dungeon})`)) {
				return {
					"Forest Temple": 5,
					"Fire Temple": 8,
					"Water Temple": 6,
					"Shadow Temple": 5,
					"Spirit Temple": 5,
					"Ganon's Castle": 2,
					"Gerudo Training Ground": 9,
					"Bottom of the Well": 3,
					"Thieves Hideout": 4,
				}[dungeon];
			}
			return playthrough.items.filter(
				(item) => item === `Small Key (${dungeon})`
			).length;
		},
		[playthrough]
	);

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

	const pathRegions = Object.keys(playthrough.known_paths);

	const bosses = {
		"Deku Tree": "Queen Gohma",
		"Dodongos Cavern": "King Dodongo",
		"Jabu Jabus Belly": "Barinade",
		"Forest Temple": "Phantom Ganon",
		"Fire Temple": "Volvagia",
		"Water Temple": "Morpha",
		"Shadow Temple": "Bongo Bongo",
		"Spirit Temple": "Twinrova",
	} as Record<string, string>;
	const regionsWithMedallions = [
		"Deku Tree",
		"Dodongos Cavern",
		"Jabu Jabus Belly",
		"Forest Temple",
		"Fire Temple",
		"Water Temple",
		"Shadow Temple",
		"Spirit Temple",
	];
	const regionsWithBossKeys = [
		"Forest Temple",
		"Fire Temple",
		"Water Temple",
		"Shadow Temple",
		"Spirit Temple",
		"Ganon's Castle",
	];
	const regionsWithKeys = regionsWithBossKeys.concat([
		"Gerudo Training Ground",
		"Bottom of the Well",
		"Thieves Hideout",
	]);

	// Helper to get background class based on region type
	const getRegionBgClass = (regionName: string) => {
		const grassRegions = ["Hyrule Field", "Kokiri Forest", "Lon Lon Ranch", "Sacred Forest Meadow", "Lost Woods"];
		const stoneRegions = ["Kakariko Village", "Hyrule Castle", "Temple of Time", "Market"];
		const fireRegions = ["Death Mountain Crater", "Death Mountain Trail", "Goron City"];
		const waterRegions = ["Zora's River", "Zora's Domain", "Zora's Fountain", "Lake Hylia"];
		const sandRegions = ["Desert Colossus", "Gerudo Valley"];
		const dungeonRegions = ["Deku Tree", "Dodongos Cavern", "Jabu Jabus Belly", "Forest Temple", "Fire Temple", "Water Temple", "Shadow Temple", "Spirit Temple", "Bottom of the Well", "Gerudo Training Ground", "Thieves Hideout", "Ganon's Castle"];
		
		if (grassRegions.includes(regionName)) return "bg-grass";
		if (stoneRegions.includes(regionName)) return "bg-stone";
		if (fireRegions.includes(regionName)) return "bg-fire";
		if (waterRegions.includes(regionName)) return "bg-water";
		if (sandRegions.includes(regionName)) return "bg-sand";
		if (dungeonRegions.includes(regionName)) return "bg-dungeon";
		return "bg-dark";
	};

	return (
		<>
			<div
				className="sticky top-0 z-20 flex cursor-pointer items-center justify-center gap-2 bg-black px-4 py-3 text-center text-lg font-bold text-white shadow-md lg:cursor-default"
				onClick={() => setCollapsed((prev) => !prev)}
			>
				<span>{age === "child" ? "Child" : "Adult"} Link</span>
				<button className="lg:hidden">
					{collapsed ? <FiChevronDown /> : <FiChevronUp />}
				</button>
			</div>
			<nav
				className={`flex-1 flex-col bg-stone-900 ${
					collapsed ? "hidden" : "flex"
				} lg:flex`}
			>
				{Object.keys(regions)
					.filter((el) => regions[el]![age])
					.map((el) => (
						<div
							key={el}
							className={`flex cursor-pointer items-center justify-end gap-2 border-b border-stone-800 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-surface-variant ${
								el === region
									? "border-l-4 border-l-primary bg-surface-variant text-black"
									: "border-l-4 border-l-transparent"
							} ${getRegionBgClass(regions[el]!.name)}`}
							onClick={() => setRegion(el)}
							style={{
								textShadow:
									el === region
										? "none"
										: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
							}}
						>
							{pathRegions.includes(el) && (
								<Tag text="PATH" color="midnightblue" />
							)}
							{playthrough.known_woth.includes(el) && (
								<Tag text="WOTH" color="darkgreen" />
							)}
							{playthrough.known_barren.includes(el) && (
								<Tag text="FOOL" color="firebrick" />
							)}
							<span className="relative z-10">{regions[el]!.name}</span>
							{regionsWithKeys.includes(el) && (
								<span className="relative z-10">
									<Image
										width={0}
										height={0}
										sizes="100vw"
										alt="Small Key"
										className="inline-block h-5 w-auto"
										src="/images/small-key.png"
									/>
									{smallKeyCount(el)}
								</span>
							)}
							{regionsWithBossKeys.includes(el) && (
								<Image
									width={0}
									height={0}
									sizes="100vw"
									alt="Boss Key"
									className={`inline-block h-5 w-auto ${
										playthrough.items.includes(`Boss Key (${el})`)
											? "opacity-100"
											: "opacity-30"
									}`}
									src="/images/boss-key.png"
								/>
							)}
							{regionsWithMedallions.includes(el) && (
								<Image
									width={0}
									height={0}
									sizes="100vw"
									className="relative z-10 h-5 w-auto"
									src={`/images/${
										bosses[el]! in playthrough.known_locations
											? formatFilename(
													playthrough.known_locations[bosses[el]!]!
											  )
											: "unknown-small"
									}.png`}
									alt=""
								/>
							)}
						</div>
					))}
			</nav>
		</>
	);
};

export default RegionList;
