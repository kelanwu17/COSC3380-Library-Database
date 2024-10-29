import React, { useEffect, useState } from 'react';
import axios from 'axios';


function ReserveComponent() {
    const [reserveInfo, setReserveInfo] = useState([]);
    const userId = sessionStorage.getItem('memberId');
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState('books'); // State for category
    const [shortCat, setShortCat] = useState('books');
    const [loading, setLoading] = useState(false); // State to track loading
    const [abortController, setAbortController] = useState(null); // Store the current AbortController

    useEffect(() => {
        const fetchReserveList = async () => {
            try {
                const response = await axios.get(`https://library-database-backend.onrender.com/api/reserve/${userId}`);
                const reserveData = response.data;

                const activeReserveData = reserveData.filter(instance => instance.active === 1);
                console.log(activeReserveData);
                if (activeReserveData.length > 0) {
                    setReserveInfo(activeReserveData.map(item => ({
                        itemId: item.itemId,
                        itemType: item.itemType === 'book' ? 'books' : item.itemType === 'tech' ? 'technology' : item.itemType,
                    })));
                } else {
                    throw new Error('No active reserves found');
                }
            } catch (error) {
                console.error('Error fetching reserve details:', error);
            }
        };

        fetchReserveList();
    }, [userId]);

    useEffect(() => {
        const fetchReserveItems = async () => {
            // Create a new AbortController for the current fetch operation
            const controller = new AbortController();
            setAbortController(controller); // Store the controller

            setLoading(true); // Start loading

            try {
                const newItems = [];

                for (let i = 0; i < reserveInfo.length; i++) {
                    if (reserveInfo[i].itemType === category) {
                        const itemData = await fetchReserveItem(reserveInfo[i].itemId, controller.signal);
                        newItems.push(...itemData); // Collect all fetched items
                    }
                }

                setItems(newItems); // Set items after fetching all
            } catch (error) {
                // Check if the error is due to an aborted request
                if (error.name !== 'AbortError') {
                    console.error('Error fetching item details:', error);
                }
            } finally {
                setLoading(false); // End loading
            }

            // Cleanup function to abort the request if the component unmounts
            return () => {
                controller.abort(); // Abort any ongoing requests
            };
        };

        if (reserveInfo.length > 0) {
            fetchReserveItems();
        }

        // Cleanup: abort the previous fetch if necessary
        return () => {
            if (abortController) {
                abortController.abort(); // Abort any ongoing fetch
            }
        };
    }, [reserveInfo, category]);

    const fetchReserveItem = async (itemId, signal) => {
        try {
            const response = await axios.get(`https://library-database-backend.onrender.com/api/${category}/${itemId}`, { signal });
            const itemData = response.data;

            if (itemData) {
                return itemData.map(item => ({
                    id: item.bookId || item.techId || item.musicId,
                    title: item.title || item.deviceName || item.albumName,
                    imgUrl: item.imgUrl,
                    lead: item.author || item.modelNumber || item.artist
                }));
            } else {
                throw new Error('Item not found');
            }
        } catch (error) {
            // Return an empty array on error to avoid breaking the chain
            console.error('Error fetching item details:', error);
            return []; 
        }
    };

    const handleCategoryChange = (selectedCategory) => {
        // Abort the current request before changing the category
        if (abortController) {
            abortController.abort(); // Cancel the previous request
        }

        setCategory(selectedCategory);
        setShortCat(selectedCategory);
        if(selectedCategory==='technology')
        {
            setShortCat('tech')
        }
        
        setItems([]); // Clear items to prevent showing stale data
    };

    const categories = ['books', 'technology', 'music'];
    const shortCate = ['books', 'tech', 'music'];

    return (
        <div>
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}:</h3>
            <div className="mb-4">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4 py-2 mr-2 rounded ${category === cat ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>
            <div className="overflow-y-auto" style={{ height: '200px' }}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    items.map((item, index) => (
                        <a href={`/${shortCat}/${item.id}`}>
                        <div key={index} className='flex flex-row mb-4 '>
                            <img className='w-40 h-40' src={item.imgUrl} alt={item.title} />
                            <div className='flex flex-col ml-3'>
                                <h3>{item.title}</h3>
                                <p>{item.lead}</p>
                            </div>
                        </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}

export default ReserveComponent;
