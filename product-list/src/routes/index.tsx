import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { useState } from 'react';

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
}

const SORT_ORDER_KEY = 'sort';
const DEFAULT_SORT_ORDER = 'asc';
const API_URL = 'https://fakestoreapi.com/products';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async ({ location }) => {
    const searchParams = new URLSearchParams(location.search);
    const sortOrder = searchParams.get(SORT_ORDER_KEY) || DEFAULT_SORT_ORDER;

    const response = await fetch(`${API_URL}?sort=${sortOrder}`);
    if (!response.ok) throw Error();

    const data = await response.json() as Product[];
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
  const { data } = useLoaderData({ from: "/" })

  function getInitialSortOrder() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(SORT_ORDER_KEY) || DEFAULT_SORT_ORDER;
  }

  const [sortOrder, setSortOrder] = useState(getInitialSortOrder);

  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    window.history.replaceState(null, '', `?${SORT_ORDER_KEY}=${newSortOrder}`);
  };

  return (
    <div className='px-10 py-8'>
      <div className='flex justify-between'>
        <div className='text-3xl font-extrabold'>Product List</div>
        <button
          onClick={handleSortChange}
          className="flex items-center border-2 rounded-lg border-gray-200 py-1 px-4"
        >
          <span className='text-sm'>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          <div className="rotate-180 ml-3 mb-1">^</div>
        </button>
      </div>
      <div className='flex flex-wrap mt-12 mb-6 gap-5 justify-center'>
        {data.map((item) =>
          <div key={item.id} className='w-64 border-2 rounded-lg border-gray-100 shadow-sm hover:shadow-2xl'>
            <Link to='/$id' params={{ id: item.id.toString() }}>
              <img
                src={item.image}
                alt="Product"
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                }}
              />
              <div className='p-4'>
                <div className='font-semibold'>{item.title}</div>
                <div className='text-sm text-gray-500 mt-2'>Category: {item.category}</div>
                <div className='text-sm text-gray-500 mt-2'>Price: ${item.price}</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>)
}
