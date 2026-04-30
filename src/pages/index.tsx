import Link from "next/link";
import React from "react";
import Layout from "../components/Layout";

const LandingPage = () => {
	return (
		<Layout mainClass="text-xl">
			<section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 px-4 text-center sm:min-h-[calc(100vh-5rem)]">
				<div className="absolute inset-0 bg-[url('/images/bg/cojiro.jpg')] bg-cover bg-fixed bg-center opacity-20 mix-blend-overlay" />
				<div className="relative z-10 grid place-items-center space-y-6 px-2 py-12 sm:space-y-8 sm:px-4 sm:py-0 animate-[fadeIn_0.8s_ease-out]">
					<div className="space-y-3 sm:space-y-4">
						<p className="text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-300 sm:text-sm sm:tracking-[0.2em]">
							Based on the original work by Christian Legge
						</p>
						<h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-5xl xl:text-7xl">
							Route the game.
							<br />
							<span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
								Flout the tedium.
							</span>
						</h1>
					</div>
					<p className="max-w-[65ch] text-sm leading-relaxed text-emerald-100 sm:text-lg sm:text-xl">
						Cojiro is the fastest way to learn the logic, practice
						routing, and beat seeds faster — all without loading up the game.
					</p>
					<Link href="/play">
						<button className="group relative overflow-hidden rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-emerald-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:px-8 sm:py-3 sm:text-sm xl:px-10 xl:py-4 xl:text-lg">
							<span className="relative z-10">Play now</span>
							<div className="absolute inset-0 -translate-x-full bg-emerald-300 transition-transform duration-300 group-hover:translate-x-0" />
						</button>
					</Link>
				</div>
			</section>

			<section className="grid place-items-center space-y-4 bg-gradient-to-b from-slate-50 to-white px-4 py-12 sm:space-y-6 sm:py-20">
				<h1 className="font-heading text-2xl font-semibold text-slate-800 sm:text-3xl xl:text-4xl">
					Why not just play the game?
				</h1>
				<div className="max-w-2xl space-y-3 text-sm text-slate-600 sm:space-y-4 sm:text-base">
					<p className="leading-relaxed">
						Cojiro is not and will never be a replacement for Ocarina of
						Time Randomizer. It doesn&apos;t help you with execution, but more
						importantly,{" "}
						<strong className="font-bold text-slate-900">
							it&apos;s just not as fun
						</strong>
						.
					</p>
					<p className="leading-relaxed">
						Cojiro is a{" "}
						<strong className="font-bold text-slate-900">supplement</strong> for those
						who want to learn or improve faster than they otherwise might.
					</p>
				</div>
				<h2 className="mt-2 text-lg font-semibold text-slate-700 sm:mt-4 sm:text-xl">
					Here&apos;s why you might want to give Cojiro a shot:
				</h2>
				<ul
					className="max-w-[90vw] pb-2 text-left text-sm text-slate-600 sm:max-w-none sm:text-base"
					style={{ listStyleImage: "url('images/cojiro.png')" }}
				>
					<li className="ml-6 sm:ml-8">
						Seeing the checks on the map helps you{" "}
						<strong className="font-bold">learn</strong> the game
					</li>
					<li className="ml-6 sm:ml-8">
						Routing helps you{" "}
						<strong className="font-bold">get good</strong> at the
						game
					</li>
					<li className="ml-6 sm:ml-8">
						Using Cojiro to practice{" "}
						<strong className="font-bold">
							gets it done faster
						</strong>
					</li>
				</ul>
				<p className="text-sm text-slate-500 sm:text-base">
					You can also play just for fun, if you want. We don&apos;t discriminate.
				</p>
			</section>

			<section className="grid place-items-center space-y-4 bg-slate-900 px-4 py-12 text-slate-300 sm:space-y-6 sm:py-20">
				<h1 className="font-heading text-2xl font-semibold text-white sm:text-3xl xl:text-4xl">
					About this project
				</h1>
				<div className="max-w-2xl space-y-3 text-sm sm:space-y-4 sm:text-base">
					<p className="leading-relaxed">
						This version of Cojiro is an update by{" "}
						<span className="font-medium text-emerald-600">
							Simpl Pixl
						</span>{" "}
						based on the original code by{" "}
						<a
							href="https://github.com/christianlegge"
							className="font-medium text-emerald-600 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-700"
						>
							Christian Legge
						</a>{" "}
						(scatter), built on the shoulders of giants who created NextJS, the
						rest of the tech stack, and of course{" "}
						<a
							href="https://ootrandomizer.com/"
							className="font-medium text-emerald-600 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-700"
						>
							Ocarina of Time Randomizer
						</a>{" "}
						itself.
					</p>
					<p className="leading-relaxed">
						Cojiro is{" "}
						<a
							href="https://github.com/christianlegge/cojiro"
							className="font-medium text-emerald-600 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-700"
						>
							fully open source
						</a>{" "}
						and built using the t3 stack (React, NextJS, TypeScript, TailwindCSS,
						Prisma, tRPC).
					</p>
				</div>
			</section>
		</Layout>
	);
};

export default LandingPage;
