/* eslint-disable @next/next/no-img-element */

import { setIsOpenSidebar } from "@/src/store/reducer";
import { AppDispatch, RootState } from "@/src/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export function NavBar() {
	const { isOpenSideBar } = useSelector((state: RootState) => state.inventario);
	// const dispatch = useDispatch<AppDispatch>();

	return (
		<nav
			className={`sticky top-0 ${isOpenSideBar && "sm:ml-64"} bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
			style={{
				width: "-webkit-fill-available",
			}}>
			<div className="px-3 py-3 lg:px-5 lg:pl-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center justify-start rtl:justify-end">
						<button
							data-drawer-target="logo-sidebar"
							data-drawer-toggle="logo-sidebar"
							aria-controls="logo-sidebar"
							type="button"
							// onClick={() => dispatch(setIsOpenSidebar(!isOpenSideBar))}
							className="inline-flex items-center text-sm text-gray-500 rounded-sm focus:outline-none">
							<svg
								className="w-6 h-6"
								aria-hidden="true"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path
									clipRule="evenodd"
									fillRule="evenodd"
									d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
							</svg>
						</button>
					</div>
					<div className="flex items-center">
						<div className="flex items-center ms-3">
							<div>
								<button
									type="button"
									className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
									aria-expanded="false"
									data-dropdown-toggle="dropdown-user">
									<img
										className="w-8 h-8 rounded-full"
										src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
										alt="user photo"
									/>
								</button>
							</div>
							<div
								className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
								id="dropdown-user">
								<div className="px-4 py-3" role="none">
									<p
										className="text-sm text-gray-900 dark:text-white"
										role="none">
										Neil Sims
									</p>
									<p
										className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
										role="none">
										neil.sims@flowbite.com
									</p>
								</div>
								<ul className="py-1" role="none">
									<li>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
											role="menuitem">
											Dashboard
										</a>
									</li>
									<li>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
											role="menuitem">
											Settings
										</a>
									</li>
									<li>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
											role="menuitem">
											Earnings
										</a>
									</li>
									<li>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
											role="menuitem">
											Sign out
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
