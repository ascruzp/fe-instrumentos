"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { SearchIcon } from "../components/SearchIcon";
import { useRef } from "react";
import * as XLSX from "xlsx";

export default function ContentReportes() {
	const { inventario, boletas, clientes, proveedores, facturas, subcategorias, empleados, marcas } = useSelector((state: RootState) => state.inventario);

	const [selectedSection, setSelectedSection] = useState<string | null>(null);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [page, setPage] = useState(1);
	const [filterValue, setFilterValue] = useState("");
	const tableRef = useRef<HTMLDivElement>(null);

	const handleDownloadExcel = () => {
		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(currentPageData);
		XLSX.utils.book_append_sheet(wb, ws, "Reporte");
		XLSX.writeFile(wb, `${selectedSection}.xlsx`);
	};

	const getFilteredData = () => {
		if (!selectedSection) return [];
		let data: any[] = [];

		switch (selectedSection) {
			case "clientes":
				data = clientes;
				break;
			case "boletas":
				data = boletas;
				break;
			case "facturas":
				data = facturas;
				break;
			case "inventario":
				data = inventario.map(({ url_producto, descripcion_producto, id_categoria, id_marca, ...rest }) => rest);
				break;
			case "proveedores":
				data = proveedores;
				break;
			case "subcategorias":
				data = subcategorias.map(({ id_categoria, ...rest }) => rest);
				break;
			case "empleados":
				data = empleados;
				break;
			case "marcas":
				data = marcas;
				break;
			default:
				break;
		}
		return data;
	};
	const filteredData = useMemo(() => {
		const data = getFilteredData();

		if (!filterValue.trim()) return data;

		return data.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(filterValue.toLowerCase())));
	}, [selectedSection, filterValue]);

	const pages = Math.ceil(filteredData.length / rowsPerPage);

	const currentPageData = useMemo(() => {
		const startIndex = (page - 1) * rowsPerPage;
		return filteredData.slice(startIndex, startIndex + rowsPerPage);
	}, [page, rowsPerPage, filteredData]);

	// Función para renderizar la tabla con los datos filtrados y paginados
	const renderTable = (data: any[]) => {
		if (data.length === 0) return <p className="flex w-full text-center justify-center">No hay datos disponibles</p>;

		return (
			<Table
				aria-label="Tabla de reportes"
				isHeaderSticky
				classNames={{
					wrapper: "max-h-[382px]",
				}}
			>
				<TableHeader>
					{Object.keys(data[0]).map((key) => (
						<TableColumn key={key}>{key}</TableColumn>
					))}
				</TableHeader>
				<TableBody>
					{data.map((item, index) => (
						<TableRow key={index}>
							{Object.values(item).map((value, idx) => (
								<TableCell key={idx}>{value as any}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	};

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
			setPage(1); // Volver a la primera página cuando se hace una búsqueda
		} else {
			setFilterValue("");
		}
	}, []);
	const onClear = React.useCallback(() => {
		setFilterValue("");
		setPage(1);
	}, []);
	return (
		<section className="flex flex-col rounded-md bg-white">
			<header className="rounded-tl-md rounded-tr-md bg-pink-50 p-4">
				<h2 className="font-bold uppercase text-pink-500">Control de Reportes</h2>
			</header>
			<article className="flex flex-col gap-4 p-4">
				<div className="flex gap-4">
					{["clientes", "boletas", "facturas", "inventario", "proveedores", "subcategorias", "empleados", "marcas"].map((section) => (
						<Button
							key={section}
							variant={selectedSection === section ? "solid" : "flat"}
							color={selectedSection === section ? "secondary" : "default"}
							onPress={() => {
								setSelectedSection(section);
								setPage(1);
							}}
						>
							{section.charAt(0).toUpperCase() + section.slice(1)}
						</Button>
					))}
				</div>
				<div className="mt-4 flex justify-between items-center">
					<Input
						isClearable
						className="w-full sm:w-[30%]"
						placeholder="Busca un dato..."
						startContent={<SearchIcon />}
						value={filterValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>
					<Pagination
						page={page}
						total={pages}
						onChange={setPage}
						showControls
					/>
					<div className="flex items-center justify-between gap-4">
						<span className="text-small text-default-400">Total {filteredData.length} datos</span>
						<label className="flex items-center text-small text-default-400">
							Filas por página:
							<select
								className="bg-transparent text-small text-default-400 outline-none"
								onChange={(e) => {
									setRowsPerPage(Number(e.target.value));
									setPage(1);
								}}
							>
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="20">20</option>
								<option value="50">50</option>
								<option value="100">100</option>
							</select>
						</label>
					</div>
				</div>
				<div
					className="mt-4"
					ref={tableRef}
				>
					{renderTable(currentPageData)}
				</div>
				{selectedSection && (
					<div className="flex gap-4">
						<Button
							className="font-bold"
							variant="flat"
							color="success"
							onPress={handleDownloadExcel}
						>
							Descargar Excel
						</Button>
						{/* <Button
							className="font-bold"
							variant="flat"
							color="primary"
							onPress={() => {}}
						>
							Imprimir
						</Button> */}
					</div>
				)}
			</article>
		</section>
	);
}
