import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import { apiSlice } from "../features/api/apiSlice";
import uiReducer from "../features/ui/uiSlice";
import type { RootState } from "../app/store";

type ExtendedRenderOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: Partial<RootState>;
  route?: string;
};

export function setupTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState: preloadedState as RootState,
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    route = "/",
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const store = setupTestStore(preloadedState);

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
