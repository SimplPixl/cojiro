export interface SeedReturnType {
	":version": string;
	file_hash: string[];
	":seed": string;
	":settings_string": string;
	settings: {
		starting_items: Record<string, number>;
		[key: string]: unknown;
	};
	locations: Record<string, string | { item: string; price: number }>;
	gossip_stones: Record<string, { text: string; colors: string[] }>;
	[key: string]: unknown;
}

export interface ParsedSeed {
	locations: Record<
		string,
		{
			item: string;
			price?: number;
		}
	>;
	gossip_stones: Record<string, string>;
	seedValue: string;
	settingsString: string;
}

function parseSeed(seed: SeedReturnType): ParsedSeed {
	const locations: ParsedSeed["locations"] = Object.keys(seed.locations).reduce(
		(acc, el) => {
			const loc = seed.locations[el];
			return {
				...acc,
				[el]: {
					item: typeof loc === "string" ? loc : loc!.item,
					price: typeof loc === "string" ? undefined : loc!.price,
				},
			};
		},
		{}
	);
	const gossip_stones: ParsedSeed["gossip_stones"] = Object.keys(
		seed.gossip_stones
	).reduce((acc, el) => ({ ...acc, [el]: seed.gossip_stones[el]!.text }), {});

	return {
		locations,
		gossip_stones,
		seedValue: seed[":seed"],
		settingsString: seed[":settings_string"],
	};
}

export default parseSeed;
