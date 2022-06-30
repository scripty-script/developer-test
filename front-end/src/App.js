import Table from "./components/table";
import { useReducer, useEffect, useId, createContext, useState } from "react";
import { InsertProduct, UpdateProduct, DeleteProduct } from "./components/products";
import useModal, { ACTION as ACTION_MODAL } from './hooks/useModal';
import { Switch } from '@headlessui/react'

export const ACTION = {
    NEW_PRODUCTS: 1,
    INSERT_PRODUCT: 2,
    UPDATE_PRODUCT: 3,
    DELETE_PRODUCT: 4,
    NEW_CATEGORIES: 5,
};

const initReducer = {
    products: [],
    categories: [],
};

function reducer(state, action) {
    switch (action.type) {
        case ACTION.NEW_PRODUCTS:
            state.products = [...action.payload]
            return { ...state };
        case ACTION.INSERT_PRODUCT:
            state.products.push(action.payload)
            return { ...state };
        case ACTION.UPDATE_PRODUCT:
            for (let i = 0; i < state.products.length; i++) {
                if (state.products[i].id == action.payload.id) {
                    state.products[i] = action.payload
                    break;
                }
            }
            return { ...state };
        case ACTION.DELETE_PRODUCT:
            state.products = state.products.filter(({ id }) => id != action.payload.id);
            return { ...state };
        case ACTION.NEW_CATEGORIES:
            state.categories = [...action.payload]
            return { ...state };
        default:
            throw new Error();
    }
}

export const CategoriesContext = createContext();

export default function App() {
    const [state, dispatch] = useReducer(reducer, initReducer);
    const modal = useModal();
    const [query, setQuery] = useState(undefined);
    const [filter, setFilter] = useState(false);

    console.log(filter)

    const insertModal = useId();
    const updateModal = useId();
    const deleteModal = useId();

    const loadProducts = async (query = undefined, filter = false) => {
        try {
            let url = `${process.env.API_URL}/api/products`;
            const params = new URLSearchParams();

            if (query !== undefined) {
                params.append('q', query);
            }

            if (filter) {
                params.append('filter', 'no-stock');
            }

            url += '?' + params.toString();

            const res = await fetch(url);

            if (res.ok) {
                const data = await res.json();
                dispatch({ type: ACTION.NEW_PRODUCTS, payload: data });
            }
        } catch (error) {
            console.log(error.message);
        }

        try {
            const res = await fetch(`${process.env.API_URL}/api/categories`);

            if (res.ok) {
                const data = await res.json();
                dispatch({ type: ACTION.NEW_CATEGORIES, payload: data });
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        loadProducts();
    }, [])

    useEffect(() => {
        if (query === undefined) {
            return
        }
        const handler = setTimeout(() => {
            loadProducts(query, filter);
        }, 700);

        return () => clearTimeout(handler);
    }, [query])

    useEffect(() => {
        loadProducts(query, filter);
    }, [filter])

    return (
        <main>
            <section>
                <div className="container py-6">
                    <header className="text-4xl">Products</header>
                    <div className="flex justify-between">
                        <div className="w-96">
                            <label className="relative block">
                                <span className="sr-only">Search</span>
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    className="input-group block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                    placeholder="Search for anything..."
                                    type="text"
                                    name="search"
                                    onChange={(e) => { setQuery(e.target.value); }} />
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                className="btn"
                                onClick={() => { loadProducts(); setFilter(false); }}>
                                Refresh
                            </button>
                            <button
                                className="btn-fill"
                                onClick={() => { modal.dispatch({ type: ACTION_MODAL.SHOW, payload: { sub: insertModal } }) }}>
                                New Product
                            </button>
                        </div>
                    </div>
                    <div className="py-4">
                        <span className="block">Filter</span>
                        <Switch
                            checked={filter}
                            onChange={setFilter}
                            className={`${filter ? 'bg-sky-700' : ''} inline-flex items-center rounded-full mt-1`}
                        >
                            <span className="sr-only">no stacks</span>
                            <span className={`${filter ? 'btn-fill' : 'btn'} rounded-full`}>No Stacks</span>
                        </Switch>
                    </div>


                    <Table
                        products={state.products}
                        onEdit={(props) => { modal.dispatch({ type: ACTION_MODAL.SHOW, payload: { sub: updateModal, data: props } }); }}
                        onDelete={(id) => { modal.dispatch({ type: ACTION_MODAL.SHOW, payload: { sub: deleteModal, data: id } }); }}
                    />
                </div>
            </section>
            <CategoriesContext.Provider value={state.categories}>
                <InsertProduct
                    open={modal.visible && modal.sub === insertModal}
                    onClose={() => modal.dispatch({ type: ACTION_MODAL.HIDE })}
                    onSubmit={(data) => dispatch({ type: ACTION.INSERT_PRODUCT, payload: data })}
                />
                <UpdateProduct
                    open={modal.visible && modal.sub === updateModal}
                    onClose={() => modal.dispatch({ type: ACTION_MODAL.HIDE })}
                    defaultValue={modal.data}
                    onSubmit={(data) => { dispatch({ type: ACTION.UPDATE_PRODUCT, payload: data }); }}
                />
                <DeleteProduct
                    open={modal.visible && modal.sub === deleteModal}
                    onClose={() => modal.dispatch({ type: ACTION_MODAL.HIDE })}
                    id={modal.data}
                    onDelete={(id) => { dispatch({ type: ACTION.DELETE_PRODUCT, payload: { id } }) }}
                />
            </CategoriesContext.Provider>

        </main>
    )
}