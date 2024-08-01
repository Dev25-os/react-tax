import React, { useState, useEffect } from 'react';
import Category from './data/data.json';

const App = () => {
    const [selectedOption, setSelectedOption] = useState('flat');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [flatPayout, setFlatPayout] = useState('');

    // Handle radio button change
    const handleRadioChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);

        if (value === 'flat') {
            setSelectedItems(prev => prev.map(item => ({
                ...item,
                percentage: flatPayout
            })));
        }
    };

    // Handle checkbox change
    const handleCheckboxChange = (event, item) => {
        const { checked } = event.target;

        if (checked) {
            setSelectedItems(prev => {
                const updatedItems = [...prev, { id: item.id, percentage: flatPayout }];
                return updatedItems;
            });
        } else {
            setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
        }
    };

    // Handle select all checkbox
    const handleSelectAllChange = (event) => {
        const { checked } = event.target;
        setSelectAll(checked);

        if (checked) {
            setSelectedItems(Category.map(item => ({ id: item.id, amount: selectedItems.find(sel => sel.id === item.id)?.amount || '' })));
        } else {
            setSelectedItems([]);
        }
    };

    // Handle input field change for each item
    const handleInputChange = (event, itemId) => {
        const { value } = event.target;
        setSelectedItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, percentage: value } : item
        ));
    };

    // Handle flat payout input change
    const handleFlatPayoutChange = (event) => {
        const newValue = event.target.value;
        setFlatPayout(newValue);

        if (selectedOption === 'flat') {
            setSelectedItems(prev => prev.map(item => ({
                ...item,
                amount: newValue
            })));
        }
    };

    useEffect(() => {
        setSelectAll(selectedItems.length === Category.length);
        console.log('selectedItems', selectedItems)
    }, [selectedItems]);



    return (
        <div className='max-w-screen-sm mx-auto p-5'>
            <div className="heading w-full text-center mb-5">
                <h1 className='border-b pb-2'>LOAN</h1>
            </div>

            {/* Radio input */}
            <div className="condition flex flex-col gap-2 mb-5">
                <div className='flex items-center gap-x-2'>
                    <input
                        type="radio"
                        id="flat"
                        name="loan-type"
                        value="flat"
                        checked={selectedOption === 'flat'}
                        onChange={handleRadioChange}
                    />
                    <label className='text-sm' htmlFor="flat">Set flat payout % for all sub-products</label>
                </div>
                <div className='flex items-center gap-x-2'>
                    <input
                        type="radio"
                        id="payout"
                        name="loan-type"
                        value="payout"
                        checked={selectedOption === 'payout'}
                        onChange={handleRadioChange}
                    />
                    <label className='text-sm' htmlFor="payout">Set  payout % per sub-product</label>
                </div>
            </div>

            {/* Input for taking flat payout value */}
            {selectedOption === 'flat' && (
                <div className='flex items-center justify-between mb-4'>
                    <p>Enter Flat payout</p>
                    <div className='flex items-center gap-x-1'>
                        <input
                            type="number"
                            value={flatPayout}
                            onChange={handleFlatPayoutChange}
                            className='border-gray-400 border-2 max-w-24 rounded outline-none p-1'
                        />
                        <p>%</p>
                    </div>
                </div>
            )}

            {/* Render all categories with checkboxes and input fields */}
            <div className='my-4'>
                <div className="title flex items-center justify-between text-gray-600 text-sm mb-2">
                    <p>Sub Product</p>
                    <p>Payout %</p>
                </div>

                <div className="container">
                    <div className='flex items-center gap-x-2 mb-4'>
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                        />
                        <p>Select All</p>
                    </div>

                    <div className="checkbox-group">
                        {Category.map(item => {
                            const selectedItem = selectedItems.find(sel => sel.id === item.id);
                            return (
                                <div className='flex items-center justify-between space-y-2 mb-2' key={item.id}>
                                    <div className='flex items-center gap-x-2'>
                                        <input
                                            type="checkbox"
                                            checked={!!selectedItem}
                                            onChange={(event) => handleCheckboxChange(event, item)}
                                        />
                                        <p>{item.category_name}</p>
                                    </div>
                                    <div className='flex items-center gap-x-1'>

                                        <input
                                            type="number"
                                            className={` ${selectedOption === 'flat' ? 'max-w-24 border-2 rounded p-1 pointer-events-none text-gray-400' : 'max-w-24 border-2 rounded p-1'} `}
                                            disabled={selectedOption === 'flat'}
                                            value={selectedOption === 'flat' ? flatPayout : selectedItem?.percentage || ''}
                                            onChange={(e) => handleInputChange(e, item.id)}
                                        />
                                        <p>%</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <button className='bg-violet-600/50 text-white w-full py-1 my-4 rounded-full'>Submit</button>
        </div>
    );
};

export default App;
