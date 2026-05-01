import React, { useState } from "react";
import Link from "next/link";
import { FiExternalLink, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="bg-stone-950/80 backdrop-blur-md font-serif font-bold tracking-widest uppercase border-stone-800 border-b-[1px] shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex justify-between items-center px-6 h-16 w-full z-50 shrink-0">
			<div className="flex items-center gap-4">
				<Link href="/" onClick={() => setMenuOpen(false)}>
					<span className="text-2xl font-black text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] font-h2 text-h2">
						Hyrule Tracker
					</span>
				</Link>
			</div>
			{/* Desktop nav */}
			<div className="hidden sm:flex h-full items-center justify-center gap-12">
				<Link href="/play" className="text-stone-400 hover:text-yellow-200 transition-colors">
					Play
				</Link>
				<a
					href="https://github.com/christianlegge/cojiro"
					className="flex items-center gap-2 text-stone-400 hover:text-yellow-200 transition-colors"
					target="_blank"
					rel="noreferrer"
				>
					Source on GitHub
					<FiExternalLink />
				</a>
			</div>
			{/* Mobile hamburger */}
			<button
				className="sm:hidden flex items-center text-stone-400"
				onClick={() => setMenuOpen(!menuOpen)}
				aria-label="Toggle menu"
			>
				{menuOpen ? <FiX className="h-8 w-8" /> : <FiMenu className="h-8 w-8" />}
			</button>
			{/* Mobile menu */}
			{menuOpen && (
				<div className="absolute top-16 left-0 w-full bg-stone-950 shadow-lg flex flex-col items-center gap-6 py-6 sm:hidden z-[998] border-t border-stone-800">
					<Link href="/play" onClick={() => setMenuOpen(false)} className="text-xl text-stone-400 hover:text-yellow-200">
						Play
					</Link>
					<a
						href="https://github.com/christianlegge/cojiro"
						className="flex items-center gap-2 text-xl text-stone-400 hover:text-yellow-200"
						target="_blank"
						rel="noreferrer"
						onClick={() => setMenuOpen(false)}
					>
						Source on GitHub
						<FiExternalLink />
					</a>
				</div>
			)}
		</header>
	);
};

export default Header;
