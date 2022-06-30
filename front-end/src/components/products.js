import { Dialog, Transition, Listbox } from "@headlessui/react";
import { Fragment, useState, useEffect, useContext } from "react";
import useAlert, { ALERT_TYPE } from "~/src/hooks/useAlert";
import { CategoriesContext } from "../App";
import { Success, Danger } from "./alerts";

export const InsertProduct = ({ open, onClose, onSubmit }) => {
    const { message, type, dispatch } = useAlert();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        try {
            const res = await fetch(`${process.env.API_URL}/api/products`, {
                method: 'POST',
                body: data
            });

            if (res.status === 201) {
                const data = await res.json();
                dispatch({ type: ALERT_TYPE.SUCCESS, payload: { message: data.message } });
                onSubmit(data.data)
                e.target.reset();
            } else {
                throw new Error();
            }
        } catch (error) {
            dispatch({ type: ALERT_TYPE.ERROR, payload: { message: 'Something went wrong!' } });
            return
        }
    }

    useEffect(() => {
        dispatch({ type: ALERT_TYPE.RESET });
    }, [open])

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => onClose(true)}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

                    <Transition.Child as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom my-8 w-full max-w-2xl text-left transition-all transform shadow-xl sm:align-middle sm:max-w-md sm:w-full">
                            <form onSubmit={handleSubmit} >
                                <div className="bg-white px-4 pt-5 pb-4 rounded-t-lg sm:p-6 sm:pb-4">
                                    <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">New Product</Dialog.Title>
                                    <span className='text-sm'>Only provide information that is true and correct.</span>
                                    {
                                        type &&
                                        (
                                            type === ALERT_TYPE.SUCCESS
                                                ? <Success message={message} />
                                                : type === ALERT_TYPE.ERROR && <Danger message={message} />
                                        )
                                    }
                                    <UserInputs />
                                </div>
                                <div className="bg-gray-50 px-4 py-3 rounded-b-lg sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button className="btn-fill w-full inline-flex justify-center sm:ml-3 sm:w-auto">Submit</button>
                                    <button className="btn mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto" type="button" onClick={() => onClose(true)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export const UpdateProduct = ({ open, onClose, defaultValue, onSubmit }) => {
    const { message, type, dispatch } = useAlert();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        try {
            const res = await fetch(`${process.env.API_URL}/api/products/${defaultValue.id}?_method=PUT`, {
                method: 'POST',
                body: data
            });
            if (res.ok) {
                const data = await res.json();
                dispatch({ type: ALERT_TYPE.SUCCESS, payload: { message: data.message } });
                onSubmit(data.data);
            } else {
                throw new Error();
            }
        } catch (error) {
            dispatch({ type: ALERT_TYPE.ERROR, payload: { message: 'Something went wrong!' } })
            return
        }
    }

    useEffect(() => {
        dispatch({ type: ALERT_TYPE.RESET })
    }, [open])

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => onClose(true)}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

                    <Transition.Child as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom my-8 w-full max-w-2xl text-left transition-all transform shadow-xl sm:align-middle sm:max-w-md sm:w-full">
                            <form onSubmit={handleSubmit} >
                                <div className="bg-white px-4 pt-5 pb-4 rounded-t-lg sm:p-6 sm:pb-4">
                                    <Dialog.Title as="h3" className="text-2xl leading-6 font-medium text-gray-900">Update Product</Dialog.Title>
                                    <span className='text-sm'>Only provide information that is true and correct.</span>
                                    {
                                        type &&
                                        (
                                            type === ALERT_TYPE.SUCCESS
                                                ? <Success message={message} />
                                                : type === ALERT_TYPE.ERROR && <Danger message={message} />
                                        )
                                    }
                                    <UserInputs defaultValue={defaultValue} />
                                </div>
                                <div className="bg-gray-50 px-4 py-3 rounded-b-lg sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button className="btn-fill w-full inline-flex justify-center sm:ml-3 sm:w-auto">Save Changes</button>
                                    <button className="btn mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto" type="button" onClick={() => onClose(true)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export const DeleteProduct = ({ open, onClose, id, onDelete }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.API_URL}/api/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                onDelete(id);
                onClose(true);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log('Something went wrong!');
            return
        }
    }

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => onClose(true)}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

                    <Transition.Child as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom my-8 w-full max-w-2xl text-left transition-all transform shadow-xl sm:align-middle sm:max-w-md sm:w-full">
                            <form onSubmit={handleSubmit} >
                                <div className="bg-white px-4 pt-5 pb-4 rounded-t-lg sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Delete Product
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Are you sure you want to delete this product? This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 rounded-b-lg sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button className="btn-danger w-full inline-flex justify-center sm:ml-3 sm:w-auto">Delete</button>
                                    <button className="btn mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto" type="button" onClick={() => onClose(true)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

const UserInputs = ({ defaultValue }) => {

    return (
        <div className="mt-2 space-y-4">
            <div>
                <label htmlFor="name" className="block font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" className="mt-1 block shadow-sm w-full rounded-md capitalize"
                    defaultValue={defaultValue?.name} required />
            </div>
            <div>
                <label htmlFor="description" className="block font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" className="mt-1 block shadow-sm w-full rounded-md min-h-min h-36"
                    defaultValue={defaultValue?.description} required />
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label htmlFor="price" className="block font-medium text-gray-700">Price</label>
                    <input type="number" name="price" id="price" className="mt-1 block shadow-sm w-full rounded-md capitalize"
                        defaultValue={defaultValue?.price} required />
                </div>
                <div>
                    <label htmlFor="qty" className="block font-medium text-gray-700">Qty</label>
                    <input type="number" name="qty" id="qty" className="mt-1 block shadow-sm w-full rounded-md capitalize"
                        defaultValue={defaultValue?.qty} required />
                </div>
            </div>

            <div>
                <label htmlFor="category_id" className="block font-medium text-gray-700">Category</label>
                <Categories value={defaultValue?.category.id} />
            </div>
        </div>
    )
}

const Categories = ({ value }) => {
    const [selected, setSelected] = useState(value);
    const categories = useContext(CategoriesContext);

    const name = categories.filter(({ id }) => id == selected)[0]?.name;

    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative mt-1 text-sm">
                <input type={"hidden"} name="category_id" defaultValue={selected} />
                <Listbox.Button className="flex item-center w-full py-2 px-3 text-left bg-white border border-gray-300 shadow-sm rounded-lg  cursor-default focus:outline-none focus:border-sky-500">
                    {
                        (selected !== undefined)
                            ? <span className="flex-1 capitalize">{name}</span>
                            : <span className="flex-1 italic text-slate-500">No selected category</span>
                    }
                    <span className="flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </span>
                </Listbox.Button>
                <Transition as={Fragment} leave="transition-opacity ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {
                            categories.map(({ id, name }) => (
                                <Listbox.Option key={id} value={id}
                                    className={({ active }) => `cursor-default select-none relative py-2 pl-10 pr-4 text-sm ${active ? 'bg-sky-100' : 'text-gray-900'}`}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={`block truncate capitalize ${selected ? 'font-medium' : 'font-normal'}`}>{name}</span>
                                            {
                                                selected &&
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                            }
                                        </>
                                    )}
                                </Listbox.Option>
                            ))
                        }
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}