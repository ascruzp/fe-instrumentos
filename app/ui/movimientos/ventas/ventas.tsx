"use client";
import { useState, useEffect, useCallback, ChangeEvent, useMemo, Key } from "react";
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
	Pagination,
	Selection,
	ChipProps,
	SortDescriptor,
	Modal,
	useDisclosure,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import { SearchIcon } from "../../components/SearchIcon";
import { ChevronDownIcon } from "../../components/ChevronDownIcon";
import { PlusIcon } from "../../components/PlusIcon";
import { DeleteIcon } from "../../components/DeleteIcon";
import { EditIcon } from "../../components/EditIcon";
import { EyeIcon } from "../../components/EyeIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../../../src/store/store";
import { AppDispatch } from "../../../../src/store/store";
import { DetalleBoleta, updateInventario } from "../../../../src/store/reducer";
import { VerBoleta } from "./components/VerBoleta";
import { ActualizarEstado } from "./components/actualizarEstado";

export interface BoletaPrincipal {
	numero_boleta: number;
	nombre_cliente: string;
	celular_cliente: string;
	direccion_cliente: string;
	fecha_registro_cliente: string;
	fecha_boleta: string;
	metodo_entrega: string;
	total_boleta: string;
	nombre_metodo_pago: string;
	estado_boleta: number;
	tracking: string;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
	Disponible: "success",
	No_Disponible: "danger",
};

const statusColorMap2: Record<string, ChipProps["color"]> = {
	1: "success",
	2: "secondary",
};

const INITIAL_VISIBLE_COLUMNS = ["numero_boleta", "nombre_cliente", "fecha_boleta", "nombre_metodo_pago", "estado_boleta", "metodo_entrega", "total_boleta", "actions"];

export default function ContentInventario() {
	const { boletas } = useSelector((state: RootState) => state.inventario);
	type Producto = (typeof boletas)[0];
	const [seleccionarProducto, setSeleccionarProducto] = useState({
		numero_boleta: 0,
		nombre_cliente: "",
		celular_cliente: "",
		direccion_cliente: "",
		fecha_registro_cliente: "",
		metodo_entrega: "",
		nombre_metodo_pago: "",
		fecha_boleta: "",
		total_boleta: "",
		estado_boleta: 0,
		tracking: "",
	});
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [filterValue, setFilterValue] = useState("");
	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [statusFilter, setStatusFilter] = useState<Selection>("all");
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "numero_boleta",
		direction: "ascending",
	});
	const [page, setPage] = useState(1);
	const hasSearchFilter = Boolean(filterValue);
	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...boletas];

		if (hasSearchFilter) {
			filteredUsers = filteredUsers.filter((producto) => producto.nombre_cliente.toLowerCase().includes(filterValue.toLowerCase()));
		}
		if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
			filteredUsers = filteredUsers.filter((producto) => {
				console.log(producto.nombre_metodo_pago);
				return Array.from(statusFilter).includes(producto.nombre_metodo_pago);
			});
		}
		return filteredUsers;
	}, [hasSearchFilter, statusFilter, filterValue, boletas]);

	const pages = Math.ceil(filteredItems.length / rowsPerPage);

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = useMemo(() => {
		return [...items].sort((a: Producto, b: Producto) => {
			const first = a[sortDescriptor.column as keyof Producto] as number;
			const second = b[sortDescriptor.column as keyof Producto] as number;
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, items]);

	const renderCell = useCallback((producto: Producto, columnKey: Key) => {
		const cellValue = producto[columnKey as keyof Producto];
		switch (columnKey) {
			case "numero_boleta":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.numero_boleta}</p>
					</div>
				);
			case "nombre_cliente":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.nombre_cliente}</p>
					</div>
				);
			case "total_boleta":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">S/. {producto.total_boleta}</p>
					</div>
				);
			case "fecha_boleta":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">
							{new Date(producto.fecha_boleta).toLocaleDateString("es-ES", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
					</div>
				);
			case "metodo_entrega":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-tiny capitalize text-default-400">{cellValue}</p>
					</div>
				);
			case "nombre_metodo_pago":
				return (
					<Chip
						className="capitalize"
						color={statusColorMap[producto.nombre_metodo_pago]}
						size="sm"
						variant="flat"
					>
						{producto.nombre_metodo_pago}
					</Chip>
				);
			case "estado_boleta":
				return (
					<Chip
						className="capitalize"
						color={statusColorMap2[producto.estado_boleta]}
						size="sm"
						variant="flat"
					>
						{producto.estado_boleta === 1 ? "Completado" : "En Proceso"}
					</Chip>
				);
			case "tracking":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-tiny capitalize text-default-400">{producto.tracking}</p>
					</div>
				);
			case "actions":
				return (
					<div className="relative flex justify-center items-center gap-2">
						<span
							className="text-lg text-default-400 cursor-pointer active:opacity-50"
							onClick={() => editarVenta(producto)}
						>
							<EditIcon />
						</span>
						<span
							className="cursor-pointer text-lg text-default-400 active:opacity-50"
							onClick={() => verBoleta(producto)}
						>
							<EyeIcon />
						</span>
					</div>
				);
			default:
				return cellValue;
		}
	}, []);

	const onNextPage = useCallback(() => {
		if (page < pages) {
			setPage(page + 1);
		}
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setRowsPerPage(Number(e.target.value));
		setPage(1);
	}, []);

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
			setPage(1);
		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = useCallback(() => {
		setFilterValue("");
		setPage(1);
	}, []);

	const agregarNuevoProducto = () => {
		window.location.href = "/";
		window.location.href = "/ventas";
	};
	const verBoleta = (boleta: BoletaPrincipal) => {
		setSeleccionarProducto(boleta);
		onOpen();
	};

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-end justify-between gap-3">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Busca una venta..."
						startContent={<SearchIcon />}
						value={filterValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>
					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={<ChevronDownIcon className="text-small" />}
									variant="flat"
								>
									Estado
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={statusFilter}
								selectionMode="multiple"
								onSelectionChange={setStatusFilter}
							>
								{statusOptions.map((status) => (
									<DropdownItem
										key={status.uid}
										className="capitalize"
									>
										{capitalize(status.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={<ChevronDownIcon className="text-small" />}
									variant="flat"
								>
									Columnas
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								aria-label="Table Columns"
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								onSelectionChange={setVisibleColumns}
							>
								{columns.map((column) => (
									<DropdownItem
										key={column.uid}
										className="capitalize"
									>
										{capitalize(column.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
						<Button
							color="danger"
							endContent={
								<PlusIcon
									size={24}
									width={24}
									height={24}
								/>
							}
							onClick={agregarNuevoProducto}
						>
							Agregar Nuevo
						</Button>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-small text-default-400">Total {boletas.length} ventas</span>
					<label className="flex items-center text-small text-default-400">
						Filas por página:
						<select
							className="bg-transparent text-small text-default-400 outline-none"
							onChange={onRowsPerPageChange}
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="15">15</option>
						</select>
					</label>
				</div>
			</div>
		);
	}, [filterValue, onSearchChange, statusFilter, visibleColumns, onRowsPerPageChange, onClear]);

	const bottomContent = useMemo(() => {
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
						onPress={onPreviousPage}
					>
						Anterior
					</Button>
					<Button
						isDisabled={pages === 1}
						size="sm"
						variant="flat"
						onPress={onNextPage}
					>
						Siguiente
					</Button>
				</div>
			</div>
		);
	}, [page, pages, onPreviousPage, onNextPage]);

	const [isEditProduct, setIsEditProduct] = useState(false);
	const editarVenta = (producto: DetalleBoleta) => {
		setSeleccionarProducto(producto);
		setIsEditProduct(true);
		onOpen();
	};
	

	return (
		<>
			<Modal
				hideCloseButton
				isOpen={isOpen}
				size="xl"
				onOpenChange={onOpenChange}
				isDismissable={false}
				isKeyboardDismissDisabled={true}
				placement="center"
				scrollBehavior="inside"
			>
				{isEditProduct ? (
					<ActualizarEstado
						seleccionarProducto={seleccionarProducto}
						setIsEditProduct={setIsEditProduct}
					/>
				) : (
					<VerBoleta registrarVenta={seleccionarProducto} />
				)}
			</Modal>
			<section className="flex flex-col bg-white rounded-md">
				<header className="bg-pink-50 p-4 rounded-tl-md rounded-tr-md ">
					<h2 className="text-pink-500 font-bold uppercase">Historial de ventas</h2>
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
						onSortChange={setSortDescriptor}
					>
						<TableHeader columns={headerColumns}>
							{(column) => (
								<TableColumn
									key={column.uid}
									align={column.uid === "actions" ? "center" : "start"}
									allowsSorting={column.sortable}
								>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody
							emptyContent={"No se encontraron ventas"}
							items={sortedItems}
						>
							{(item) => <TableRow key={item.numero_boleta}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
						</TableBody>
					</Table>
				</article>
			</section>
		</>
	);
}
function updateBoleta(productoActualizado: { numero_boleta: number; estado_boleta: number; tracking: string }): any {
	throw new Error("Function not implemented.");
}
