import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'

const API_URL = 'https://fakestoreapi.com/products';

export const Route = createFileRoute('/$id')({
    component: RouteComponent,
    loader: async ({ params }) => {
        const id = params.id;
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw Error();

        const data = await response.json();
        return { data };
    },
    pendingComponent: LoadingSpinner,
    errorComponent: ErrorMessage
})

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-12 h-12 border-4 border-stone-700 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

function ErrorMessage() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-red-600 bg-red-100 border border-red-400 rounded p-4">
                Failed to fetch data. Please try again.
            </div>
        </div>
    );
}

function RouteComponent() {
    const { data } = useLoaderData({ from: "/$id" })

    return (
        <div className='px-10 py-8'>
            <div className='flex justify-between'>
                <div className='text-3xl font-extrabold'>Product Detail</div>
                <Link to='/' className='text-xl font-semibold hover:text-2xl'>BACK</Link>
            </div>
            <div className='border-2 rounded-lg border-gray-100 shadow-sm flex mt-12 p-14 flex-col lg:flex-row'>
                <img
                    src={data.image}
                    alt="Product"
                    width={300}
                />
                <div className='lg:ml-12 mt-4 lg:mt-0 w-full'>
                    <div className='flex justify-end text-lg mb-2'>
                        {data.category}
                    </div>
                    <div className='pr-10'>
                        <div className='text-2xl font-semibold'>{data.title}</div>
                        <div className='bg-[#fef7d5] py-1 px-3 text-[#d89c22] rounded-lg inline-block mt-3 text-sm'>
                            {data.rating.rate} ({data.rating.count} rating)
                        </div>
                        <div className='text-4xl my-4'>${data.price}</div>
                        <div className='text-gray-500'>Description</div>
                        <div className='mt-1 text-sm'>{data.description}</div>
                    </div>
                </div>
            </div>
        </div>)
}
