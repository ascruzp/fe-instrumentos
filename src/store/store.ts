import { configureStore } from "@reduxjs/toolkit";
import inventarioReducer from "./reducer"; // Asegúrate de importar tu reductor correctamente

const store = configureStore({
	reducer: {
		inventario: inventarioReducer, // Aquí se asigna el reductor
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
