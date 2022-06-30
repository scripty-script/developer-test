export const Success = ({ message }) => {
    return (
        <p className='display mt-2 px-4 py-3 bg-green-100 rounded-md text-sm font-semibold text-green-700 text-justify'>
            {message}
        </p>
    )
}

export const Danger = ({ message }) => {
    return (
        <p className='display mt-2 px-4 py-3 bg-red-100 rounded-md text-sm font-semibold text-red-700 text-justify'>
            {message}
        </p>
    )
}