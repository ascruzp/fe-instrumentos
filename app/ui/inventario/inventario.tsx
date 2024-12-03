"use client";
import React, { useState, useEffect } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Input,
	Button,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Chip,
	User,
	Pagination,
	Selection,
	ChipProps,
	SortDescriptor,
} from "@nextui-org/react";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import { SearchIcon } from "../components/SearchIcon";
import { ChevronDownIcon } from "../components/ChevronDownIcon";
import { PlusIcon } from "../components/PlusIcon";
import { EyeIcon } from "../components/EyeIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../../src/store/store";
export interface DetalleProducto {
	nombre_producto: string;
	precio_unitario: string;
	stock_disponible: number;
	estado_producto: string;
	nombre_categoria: string;
	nombre_marca: string;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
	Disponible: "success",
	No_Disponible: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
	"nombre_producto",
	"precio_unitario",
	"stock_disponible",
	"estado_producto",
	"nombre_categoria",
	"nombre_marca",
];


export default function ContentInventario() {
	const { inventario } = useSelector((state: RootState) => state.inventario);
	type User = (typeof inventario)[0];
	const [filterValue, setFilterValue] = React.useState("");
	const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);
	const [statusFilter, setStatusFilter] = React.useState<Selection>(new Set(["Disponible"]));
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
		column: "nombre_producto",
		direction: "ascending",
	});
	const [page, setPage] = React.useState(1);
	const hasSearchFilter = Boolean(filterValue);
	const headerColumns = React.useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const filteredItems = React.useMemo(() => {
		let filteredUsers = [...inventario];

		if (hasSearchFilter) {
			filteredUsers = filteredUsers.filter((user) =>
				user.nombre_producto
					.toLowerCase()
					.includes(filterValue.toLowerCase())
			);
		}
		if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
			filteredUsers = filteredUsers.filter((user) => {
				console.log(user.estado_producto);
				return Array.from(statusFilter).includes(user.estado_producto);
			});
		}
		return filteredUsers;
	}, [hasSearchFilter, statusFilter, filterValue]);

	const pages = Math.ceil(filteredItems.length / rowsPerPage);

	const items = React.useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = React.useMemo(() => {
		return [...items].sort((a: User, b: User) => {
			const first = a[sortDescriptor.column as keyof User] as number;
			const second = b[sortDescriptor.column as keyof User] as number;
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, items]);

	const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
		const cellValue = user[columnKey as keyof User];

		switch (columnKey) {
			case "nombre_producto":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">
							{user.nombre_producto}
						</p>
					</div>
				);
			case "precio_unitario":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">
							S/. {user.precio_unitario}
						</p>
					</div>
				);
			case "stock_disponible":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">
							{cellValue}
						</p>
					</div>
				);
			case "estado_producto":
				return (
					<Chip
						className="capitalize"
						color={statusColorMap[user.estado_producto]}
						size="sm"
						variant="flat">
						{user.estado_producto.replace("_", " ")}
					</Chip>
				);
			default:
				return cellValue;
		}
	}, []);

	const onNextPage = React.useCallback(() => {
		if (page < pages) {
			setPage(page + 1);
		}
	}, [page, pages]);

	const onPreviousPage = React.useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const onRowsPerPageChange = React.useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number(e.target.value));
			setPage(1);
		},
		[]
	);

	const onSearchChange = React.useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
			setPage(1);
		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = React.useCallback(() => {
		setFilterValue("");
		setPage(1);
	}, []);

	const topContent = React.useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-end justify-between gap-3">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Busca un producto..."
						startContent={<SearchIcon />}
						value={filterValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>
					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={
										<ChevronDownIcon className="text-small" />
									}
									variant="flat">
									Estado
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={statusFilter}
								selectionMode="multiple"
								onSelectionChange={setStatusFilter}>
								{statusOptions.map((status) => (
									<DropdownItem
										key={status.uid}
										className="capitalize">
										{capitalize(status.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={
										<ChevronDownIcon className="text-small" />
									}
									variant="flat">
									Columnas
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								onSelectionChange={setVisibleColumns}>
								{columns.map((column) => (
									<DropdownItem
										key={column.uid}
										className="capitalize">
										{capitalize(column.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-small text-default-400">
						Total {inventario.length} productos
					</span>
					<label className="flex items-center text-small text-default-400">
						Filas por página:
						<select
							className="bg-transparent text-small text-default-400 outline-none"
							onChange={onRowsPerPageChange}>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="15">15</option>
						</select>
					</label>
				</div>
			</div>
		);
	}, [
		filterValue,
		onSearchChange,
		statusFilter,
		visibleColumns,
		onRowsPerPageChange,
		onClear,
	]);

	const bottomContent = React.useMemo(() => {
		return (
			<div className="flex items-center justify-between px-2 py-2">
				<Pagination
					isCompact
					showControls
					showShadow
					color="danger"
					page={page}
					total={pages}
					onChange={setPage}
				/>
				<div className="hidden w-[30%] justify-end gap-2 sm:flex">
					<Button
						isDisabled={pages === 1}
						size="sm"
						variant="flat"
						onPress={onPreviousPage}>
						Anterior
					</Button>
					<Button
						isDisabled={pages === 1}
						size="sm"
						variant="flat"
						onPress={onNextPage}>
						Siguiente
					</Button>
				</div>
			</div>
		);
	}, [page, pages, onPreviousPage, onNextPage]);

	return (
		<section className="flex flex-col rounded-md bg-white">
			<header className="rounded-tl-md rounded-tr-md bg-pink-50 p-4 ">
				<h2 className="font-bold uppercase text-pink-500">
					Control de Inventario
				</h2>
			</header>
			<article className="flex flex-col gap-4 p-4">
				<Table
					aria-label="Example table with custom cells, pagination and sorting"
					isHeaderSticky
					bottomContent={bottomContent}
					bottomContentPlacement="outside"
					classNames={{
						wrapper: "max-h-[382px]",
					}}
					sortDescriptor={sortDescriptor}
					topContent={topContent}
					topContentPlacement="outside"
					onSortChange={setSortDescriptor}>
					<TableHeader columns={headerColumns}>
						{(column) => (
							<TableColumn
								key={column.uid}
								align="start"
								allowsSorting={column.sortable}>
								{column.name}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody
						emptyContent={"No se encontraron productos"}
						items={sortedItems}>
						{(item) => (
							<TableRow key={item.nombre_producto}>
								{(columnKey) => (
									<TableCell>
										{renderCell(item, columnKey)}
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</article>
		</section>
	);
}
