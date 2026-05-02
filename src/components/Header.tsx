import React, { useState } from "react";
import Link from "next/link";
import { FiExternalLink, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);

		return (
		<header className="bg-white/90 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full z-50 shrink-0 border-b border-gray-200 shadow-sm">
			<div className="flex items-center gap-4">
				<Link href="/" onClick={() => setMenuOpen(false)}>
					<span className="text-2xl font-black text-gray-900 font-heading">
						Cojiro
					</span>
				</Link>
			</div>
			{/* Desktop nav */}
			<div className="hidden sm:flex h-full items-center justify-center gap-12">
				<Link href="/play" className="text-gray-600 hover:text-gray-900 transition-colors">
					Play
				</Link>
				<a
					href="https://github.com/christianlegge/cojiro"
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
					target="_blank"
					rel="noreferrer"
				>
					Source on GitHub
					<FiExternalLink />
				</a>
			</div>
			{/* Mobile hamburger */}
			<button
				className="sm:hidden flex items-center text-gray-600"
				onClick={() => setMenuOpen(!menuOpen)}
				aria-label="Toggle menu"
			>
				{menuOpen ? <FiX className="h-8 w-8" /> : <FiMenu className="h-8 w-8" />}
			</button>
			{/* Mobile menu */}
			{menuOpen && (
				<div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-center gap-6 py-6 sm:hidden z-[998] border-t border-gray-200">
					<Link href="/play" onClick={() => setMenuOpen(false)} className="text-xl text-gray-600 hover:text-gray-900">
						Play
					</Link>
					<a
						href="https://github.com/christianlegge/cojiro"
						className="flex items-center gap-2 text-xl text-gray-600 hover:text-gray-900"
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
