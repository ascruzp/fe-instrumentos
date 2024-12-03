"use client";
import { RootState } from "@/src/store/store";
import React from "react";
import { useSelector } from "react-redux";
export default function Layout({ children }: { children: React.ReactNode }) {
	const { isOpenSideBar } = useSelector((state: RootState) => state.inventario);
	return (
		<main className={`p-4 ${isOpenSideBar && "sm:ml-64"} overflow-y-auto flex flex-col`}>
			{children}
		</main>
	);
}
