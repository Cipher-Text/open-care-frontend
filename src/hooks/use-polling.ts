"use client";

import { useEffect, useRef } from "react";

/**
 * Runs `task` now and then every `intervalMs`, but only while the tab is visible. A hidden tab
 * stops polling (it costs the API requests nobody is looking at) and catches up with one call
 * when the user comes back. Cleans up on unmount.
 */
export function usePolling(task: () => void | Promise<void>, intervalMs: number) {
	const taskRef = useRef(task);
	useEffect(() => {
		taskRef.current = task;
	});

	useEffect(() => {
		let timer: ReturnType<typeof setInterval> | undefined;
		let lastRun = 0;

		const run = () => {
			lastRun = Date.now();
			void taskRef.current();
		};
		const start = () => {
			if (timer) return;
			timer = setInterval(run, intervalMs);
		};
		const stop = () => {
			if (timer) clearInterval(timer);
			timer = undefined;
		};
		const onVisibility = () => {
			if (document.visibilityState === "visible") {
				if (Date.now() - lastRun >= intervalMs) run();
				start();
			} else {
				stop();
			}
		};

		run();
		if (document.visibilityState === "visible") start();
		document.addEventListener("visibilitychange", onVisibility);
		return () => {
			stop();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [intervalMs]);
}
