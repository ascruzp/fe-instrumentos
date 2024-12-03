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
import { updateInventario } from "../../../../src/store/reducer";
import { VerFactura } from "./components/VerFactura";
interface DetalleFactura {
	numero_factura: string;
	direccion_proveedor: string;
    RUC_proveedor: string;
	nombre_proveedor: string;
	nombre_metodo_pago: string;
	fecha_factura: string;
	total_factura: string;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
	Disponible: "success",
	No_Disponible: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["numero_factura", "nombre_proveedor", "nombre_metodo_pago", "fecha_factura", "total_factura", "actions"];

export default function ContentInventario() {
	const { facturas } = useSelector((state: RootState) => state.inventario);
	type Producto = (typeof facturas)[0];
	const [seleccionarProducto, setSeleccionarProducto] = useState({
        numero_factura: "",
        direccion_proveedor: "",
        RUC_proveedor: "",
        nombre_proveedor: "",
        nombre_metodo_pago: "",
        fecha_factura: "",
        total_factura: ""
	});
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [filterValue, setFilterValue] = useState("");
	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [statusFilter, setStatusFilter] = useState<Selection>("all");
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "numero_factura",
		direction: "ascending",
	});
	const [page, setPage] = useState(1);
	const hasSearchFilter = Boolean(filterValue);
	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...facturas];

		if (hasSearchFilter) {
			filteredUsers = filteredUsers.filter((producto) => producto.nombre_proveedor.toLowerCase().includes(filterValue.toLowerCase()));
		}
		if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
			filteredUsers = filteredUsers.filter((producto) => {
				console.log(producto.nombre_metodo_pago);
				return Array.from(statusFilter).includes(producto.nombre_metodo_pago);
			});
		}
		return filteredUsers;
	}, [hasSearchFilter, statusFilter, filterValue, facturas]);

	const pages = Math.ceil(filteredItems.length / rowsPerPage);

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return filteredItems.slice(start, end);
	}, [page, filteredItems, rowsPerPage]);

	const sortedItems = useMemo(() => {
		return [...items].sort((a: Producto, b: Producto) => {
			const first = a[sortDescriptor.column as keyof Producto] as string;
			const second = b[sortDescriptor.column as keyof Producto] as string;
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, items]);

	const renderCell = useCallback((producto: Producto, columnKey: Key) => {
		const cellValue = producto[columnKey as keyof Producto];
		switch (columnKey) {
			case "numero_factura":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.numero_factura}</p>
					</div>
				);
			case "nombre_proveedor":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.nombre_proveedor}</p>
					</div>
				);
			case "total_factura":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">S/. {producto.total_factura}</p>
					</div>
				);
			case "fecha_factura":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">
							{new Date(producto.fecha_factura).toLocaleDateString("es-ES", {
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
			case "actions":
				return (
					<div className="relative flex justify-center items-center gap-2">
						<span
							className="cursor-pointer text-lg text-default-400 active:opacity-50"
							onClick={() => verBoleta(producto)}
						>
							<EyeIcon />
						</span>
						{/* <span className="text-lg text-danger cursor-pointer active:opacity-50"
							onClick={() => eliminarProducto(producto)}>
							<DeleteIcon />
						</span> */}
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

	const agregarNuevaCompra = () => {
		window.location.href = "/";
		window.location.href = "/compras";
	};
	const verBoleta = (boleta: DetalleFactura) => {
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
						placeholder="Busca una compra..."
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
							onClick={agregarNuevaCompra}
						>
							Agregar Nuevo
						</Button>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-small text-default-400">Total {facturas.length} compras</span>
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
				<VerFactura registrarVenta={seleccionarProducto} />
			</Modal>
			<section className="flex flex-col bg-white rounded-md">
				<header className="bg-pink-50 p-4 rounded-tl-md rounded-tr-md ">
					<h2 className="text-pink-500 font-bold uppercase">Historial de compras</h2>
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
							emptyContent={"No se encontraron compras"}
							items={sortedItems}
						>
							{(item) => <TableRow key={item.numero_factura}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
						</TableBody>
					</Table>
				</article>
			</section>
		</>
	);
}
