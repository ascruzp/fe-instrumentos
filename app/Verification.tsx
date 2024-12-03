"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Login from "./ui/login/login";
import {
	FetchMetodosPago,
	FetchInventario,
	FetchBoletaGeneral,
	FetchFacturaGeneral,
	FetchCategorias,
	FetchMarcas,
	FetchSubCategorias,
	FetchClientes,
	FetchProveedores,
	FetchEmpleados,
} from "./DataFetcher";
import { NextUIProvider } from "@nextui-org/react";
import { MultiLevelSidebar } from "./ui/structure/sidebar";
import { NavBar } from "./ui/structure/navbar";

interface VerificationProps {
	children: React.ReactNode;
}

const Verification: React.FC<VerificationProps> = ({ children }) => {
	const [isAdmin, setIsAdmin] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const storedAdmin = localStorage.getItem("isAdmin");

		if (storedAdmin === "0" || storedAdmin === null) {
			if (pathname !== "/login") {
				router.replace("/login");
			}
		}
		setIsAdmin(storedAdmin);
	}, [pathname, router]);

	return isAdmin === "0" || isAdmin === null ? (
		<Login />
	) : (
		<>
			<FetchMetodosPago />
			<FetchInventario />
			<FetchBoletaGeneral />
			<FetchFacturaGeneral />
			<FetchCategorias />
			<FetchMarcas />
			<FetchSubCategorias />
			<FetchClientes />
			<FetchProveedores />
			<FetchEmpleados />
			<NextUIProvider>
				<MultiLevelSidebar />
				<NavBar />
				{children}
			</NextUIProvider>
		</>
	);
};

export default Verification;
