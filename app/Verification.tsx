"use client";
import { useEffect } from "react";
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
	const router = useRouter();
	const pathname = usePathname();
	const isAdmin = localStorage.getItem("isAdmin");

	useEffect(() => {
		if (isAdmin === "0" || isAdmin === null) {
			if (pathname !== "/login") {
				router.replace("/login");
			}
		}
	}, [isAdmin, pathname, router]);

	if (isAdmin === "0" || isAdmin === null) {
		return <Login />;
	}

	return (
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
