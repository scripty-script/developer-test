export default function Table({ products = [], onEdit, onDelete }) {

    return (
        <div className="mt-4 border rounded-md shadow overflow-auto">
            <table className="border-collapse table-fixed w-full text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="border-b font-medium p-4 pl-8 pb-3 text-left">No.</th>
                        <th className="border-b font-medium p-4 pb-3 text-left">Name</th>
                        <th className="border-b font-medium p-4 pb-3 text-left">Description</th>
                        <th className="border-b font-medium p-4 pb-3 text-left">Price</th>
                        <th className="border-b font-medium p-4 pb-3 text-left">Quantity</th>
                        <th className="border-b font-medium p-4 pb-3 text-left">Category</th>
                        <th className="border-b font-medium p-4 pr-8 pb-3 text-left">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.length > 0
                            ?
                            products.map(({ id, name, description, price, qty, category: { name: catName } }, index) => (
                                <tr className="border-b border-slate-100 last:border-b-0" key={id}>
                                    <td className="p-4 pl-8">{id}</td>
                                    <td className="p-4 capitalize">{name}</td>
                                    <td className="p-4">{description}</td>
                                    <td className="p-4">{price}</td>
                                    <td className="p-4">{qty}</td>
                                    <td className="p-4">{catName}</td>
                                    <td className=" flex space-x-6 p-4 pr-8">
                                        <button
                                            className="font-semibold text-sky-700"
                                            onClick={() => { onEdit(products[index]); }}
                                        >
                                            Edit
                                        </button>
                                        <button className="font-semibold text-rose-500"
                                            onClick={() => { onDelete(id); }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                            :
                            <tr>
                                <td className="py-4 px-8 text-center italic" colSpan={7}>No products yet.</td>
                            </tr>
                    }
                </tbody>
            </table>
        </div >
    )
}