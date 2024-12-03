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
import { EditarProducto } from "./components/editarProducto";
import {  AppDispatch } from "../../../../src/store/store";
import { updateInventario } from "../../../../src/store/reducer";
import { AgregarNuevoProducto } from "./components/nuevoProducto";

export interface DetalleProducto {
	id_producto: number;
	id_categoria: number;
	id_marca: number;
	nombre_producto: string;
	precio_unitario: string;
	stock_disponible: number;
	stock_alerta: number;
	estado_producto: string;
	nombre_categoria: string;
	url_producto: string;
	descripcion_producto: string;
	nombre_marca: string;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
	Disponible: "success",
	No_Disponible: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
	"id_producto",
	"nombre_producto",
	"precio_unitario",
	"stock_disponible",
	"stock_alerta",
	"estado_producto",
	"actions",
];


export default function ContentInventario() {
	const { inventario } = useSelector((state: RootState) => state.inventario);
	type Producto = (typeof inventario)[0];
	const [seleccionarProducto, setSeleccionarProducto] = useState({
		id_producto: 0,
		id_categoria: 0,
		id_marca: 0,
		nombre_producto: "",
		precio_unitario: "",
		stock_disponible: 0,
		stock_alerta: 0,
		estado_producto: "",
		nombre_categoria: "",
		url_producto: "",
		descripcion_producto: "",
		nombre_marca: "",
	  });
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [filterValue, setFilterValue] = useState("");
	const [visibleColumns, setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);
	const [statusFilter, setStatusFilter] = useState<Selection>(new Set(["Disponible"]));
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "nombre_producto",
		direction: "ascending",
	});
	const [page, setPage] = useState(1);
	const hasSearchFilter = Boolean(filterValue);
	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...inventario];

		if (hasSearchFilter) {
			filteredUsers = filteredUsers.filter((producto) =>
				producto.nombre_producto
					.toLowerCase()
					.includes(filterValue.toLowerCase())
				);
			}
		if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
			filteredUsers = filteredUsers.filter((producto) => {
				return Array.from(statusFilter).includes(producto.estado_producto);
			});
		}
		return filteredUsers;
	}, [hasSearchFilter, statusFilter, filterValue, inventario]);

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
			case "id_producto":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">
							{producto.id_producto}
						</p>
					</div>
				);
			case "nombre_producto":
				return (
					<div className="flex flex-row gap-4 items-center">
						<img 
							className="w-14 aspect-square object-cover rounded-xl"
							alt="imagen-producto"
							src={producto.url_producto}
						/>
						<p className="text-bold text-small capitalize">
							{producto.nombre_producto}
						</p>
					</div>
				);
			case "precio_unitario":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">
							S/. {producto.precio_unitario}
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
			case "stock_alerta":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-tiny capitalize text-default-400">
							{cellValue}
						</p>
					</div>
				);
			case "estado_producto":
				return (
					<Chip
						className="capitalize"
						color={statusColorMap[producto.estado_producto]}
						size="sm"
						variant="flat">
						{producto.estado_producto.replace("_", " ")}
					</Chip>
				);
			case "actions":
				return (
					<div className="relative flex justify-center items-center gap-2">
						<span
							className="text-lg text-default-400 cursor-pointer active:opacity-50"
							onClick={() => editarProducto(producto)}>
							<EditIcon />
						</span>
						<span className="text-lg text-danger cursor-pointer active:opacity-50"
							onClick={() => eliminarProducto(producto)}>
							<DeleteIcon />
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

	const onRowsPerPageChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			setRowsPerPage(Number(e.target.value));
			setPage(1);
		},
		[]
	);

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

	const [isEditProduct, setIsEditProduct] = useState(false);
	const [isNewProduct, setIsNewProduct] = useState(false);

	const agregarNuevoProducto = () => {
		setIsNewProduct(true);
		onOpen();
	}

	const topContent = useMemo(() => {
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
						<Button
							color="danger"
							endContent={
								<PlusIcon size={24} width={24} height={24} />
							}
							onClick={agregarNuevoProducto}>
							Agregar Nuevo
						</Button>
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

	const editarProducto = (producto: DetalleProducto) => {
		setSeleccionarProducto(producto);
		setIsEditProduct(true);
		onOpen();
	};
	const dispatch = useDispatch<AppDispatch>();
	const eliminarProducto = async (producto: any) => {
		const productoActualizado = {
			id_producto:  producto.id_producto,
			nombre_producto: producto.nombre_producto,
			precio_unitario: producto.precio_unitario,
			stock_disponible: producto.stock_disponible,
			stock_alerta: producto.stock_alerta,
			estado_producto: "No Disponible",
			id_categoria: producto.id_categoria,
			nombre_categoria: producto.nombre_categoria,
			nombre_marca: producto.nombre_marca,
			url_producto: producto.url_producto,
			descripcion_producto: producto.descripcion_producto,
			id_marca: producto.id_marca,
		};
		try {
			const response = await fetch("/api/inventario/editarProducto", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productoActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al editar el producto");
			}
			const data = await response.json();
			dispatch(updateInventario(productoActualizado));
		} catch (error: any) {
			console.error(error.message);
		}
	};

	const defaultProduct = {
		id_categoria: inventario[0]?.id_categoria,
		id_marca: inventario[0]?.id_marca,
		nombre_producto: "",
		precio_unitario: "",
		stock_disponible: undefined,
		stock_alerta: undefined,
		estado_producto: "",
		nombre_categoria: inventario[0]?.nombre_categoria,
		nombre_marca: inventario[0]?.nombre_marca,
		descripcion_producto: "",
		url_producto: "",
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
				scrollBehavior="inside">
				{isEditProduct && <EditarProducto seleccionarProducto={seleccionarProducto} setIsEditProduct={setIsEditProduct}/>}
				{isNewProduct && <AgregarNuevoProducto seleccionarProducto={defaultProduct} setIsNewProduct={setIsNewProduct}/>}
			</Modal>
			<section className="flex flex-col bg-white rounded-md">
				<header className="bg-pink-500 p-4 rounded-tl-md rounded-tr-md ">
					<h2 className="text-white font-bold uppercase">
						Registro de Productos
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
									align={
										column.uid === "actions"
											? "center"
											: "start"
									}
									allowsSorting={column.sortable}>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody
							emptyContent={"No se encontraron productos"}
							items={sortedItems}>
							{(item) => (
								<TableRow key={item.id_producto}>
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
		</>
	);
}
