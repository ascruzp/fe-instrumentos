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
import { EditarEmpleado } from "./components/editarEmpleado";
import { AppDispatch } from "../../../../src/store/store";
import { updateEmpleados, updateInventario } from "../../../../src/store/reducer";
import { AgregarNuevoEmpleado } from "./components/nuevoEmpleado";

export interface DetalleEmpleado {
	DNI_empleado: string;
	nombre_empleado: string;
	apellido_empleado: string;
	celular_empleado: string;
	direccion_empleado: string;
	sexo: string
	estado_empleado: string;
	usuario_empleado: string;
	contrasena_empleado: string;
	estado_cargo: string;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
	Activo: "success",
	Inactivo: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["DNI_empleado", "nombre_empleado", "apellido_empleado", "estado_empleado", "actions"];

export default function ContentInventario() {
	const { empleados } = useSelector((state: RootState) => state.inventario);
	type Producto = (typeof empleados)[0];
	const [seleccionarProducto, setSeleccionarProducto] = useState({
		DNI_empleado: "",
		nombre_empleado: "",
		apellido_empleado: "",
		celular_empleado: "",
		direccion_empleado: "",
		sexo: "M",
		estado_empleado: "Activo",
		usuario_empleado: "",
		contrasena_empleado: "",
		estado_cargo: "",
	});
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [filterValue, setFilterValue] = useState("");
	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [statusFilter, setStatusFilter] = useState<Selection>(new Set(["Activo"]));
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "nombre_producto",
		direction: "ascending",
	});
	const [page, setPage] = useState(1);
	const hasSearchFilter = Boolean(filterValue);
	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...empleados];

		if (hasSearchFilter) {
			filteredUsers = filteredUsers.filter((producto) => producto.nombre_empleado.toLowerCase().includes(filterValue.toLowerCase()));
		}
		if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
			filteredUsers = filteredUsers.filter((producto) => {
				return Array.from(statusFilter).includes(producto.estado_empleado);
			});
		}
		return filteredUsers;
	}, [hasSearchFilter, statusFilter, filterValue, empleados]);

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
			case "DNI_empleado":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.DNI_empleado}</p>
					</div>
				);
			case "nombre_empleado":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.nombre_empleado}</p>
					</div>
				);
			case "apellido_empleado":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.apellido_empleado}</p>
					</div>
				);
			case "celular_empleado":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.celular_empleado}</p>
					</div>
				);
			case "direccion_empleado":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.direccion_empleado}</p>
					</div>
				);
			case "sexo":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.sexo}</p>
					</div>
				);
			case "usuario_empleado":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.usuario_empleado}</p>
					</div>
				);
			case "contrasena_empleado":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.contrasena_empleado}</p>
					</div>
				);
			case "estado_cargo":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-small capitalize">{producto.estado_cargo === "1" ? "Empleado":"Administrador"}</p>
					</div>
				);
			case "estado_empleado":
				return (
					<Chip
						className="capitalize"
						color={statusColorMap[producto.estado_empleado]}
						size="sm"
						variant="flat"
					>
						{producto.estado_empleado}
					</Chip>
				);

			case "actions":
				return (
					<div className="relative flex justify-center items-center gap-2">
						<span
							className="text-lg text-default-400 cursor-pointer active:opacity-50"
							onClick={() => editarProducto(producto)}
						>
							<EditIcon />
						</span>
						<span
							className="text-lg text-danger cursor-pointer active:opacity-50"
							onClick={() => eliminarProducto(producto)}
						>
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

	const [isEditProduct, setIsEditProduct] = useState(false);
	const [isNewProduct, setIsNewProduct] = useState(false);

	const agregarNuevoProducto = () => {
		setIsNewProduct(true);
		onOpen();
	};

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-end justify-between gap-3">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Busca un usuario..."
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
					<span className="text-small text-default-400">Total {empleados.length} usuarios</span>
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

	const editarProducto = (producto: DetalleEmpleado) => {
		setSeleccionarProducto(producto);
		setIsEditProduct(true);
		onOpen();
	};
	const dispatch = useDispatch<AppDispatch>();
	const eliminarProducto = async (producto: DetalleEmpleado) => {
		const productoActualizado = {
			DNI_empleado: producto.DNI_empleado,
			nombre_empleado: producto.nombre_empleado,
			apellido_empleado: producto.apellido_empleado,
			celular_empleado: producto.celular_empleado,
			direccion_empleado: producto.direccion_empleado,
			sexo: producto.sexo,
			estado_empleado: "Inactivo",
			usuario_empleado: producto.usuario_empleado,
			contrasena_empleado: producto.contrasena_empleado,
			estado_cargo: producto.estado_cargo,
		};
		try {
			const response = await fetch("/api/empleados/editarEmpleado", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productoActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al editar el empleado");
			}
			const data = await response.json();
			dispatch(updateEmpleados(productoActualizado));
		} catch (error: any) {
			console.error(error.message);
		}
	};

	const defaultProduct = {
        DNI_empleado: "",
		nombre_empleado: "",
		apellido_empleado: "",
		celular_empleado: "",
		direccion_empleado: "",
		sexo: "M",
		estado_empleado: "Activo",
		usuario_empleado: "",
		contrasena_empleado: "",
		estado_cargo: "1",
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
				{isEditProduct && (
					<EditarEmpleado
						seleccionarEmpleado={seleccionarProducto}
						setIsEditEmpleado={setIsEditProduct}
					/>
				)}
				{isNewProduct && (
					<AgregarNuevoEmpleado
						seleccionarEmpleado={defaultProduct}
						setIsNewEmpleado={setIsNewProduct}
					/>
				)}
			</Modal>
			<section className="flex flex-col bg-white rounded-md">
				<header className="bg-pink-500 p-4 rounded-tl-md rounded-tr-md ">
					<h2 className="text-white font-bold uppercase">Registro de Usuarios</h2>
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
							emptyContent={"No se encontraron usuarios"}
							items={sortedItems}
						>
							{(item) => <TableRow key={item.DNI_empleado}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
						</TableBody>
					</Table>
				</article>
			</section>
		</>
	);
}
