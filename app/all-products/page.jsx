'use client'
import { useState } from 'react';
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {
    const { products } = useAppContext();
    
    // Filter states
    const [sortBy, setSortBy] = useState('featured');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Available options
    const categories = ['plain', 'graphic', 'polo', 'hoodies'];

    // Filter and sort logic
    const filteredProducts = products.filter(product => {
        // Category filter - if no categories selected, show all
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
        
        return true;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseFloat(a.offerPrice) - parseFloat(b.offerPrice);
            case 'price-high':
                return parseFloat(b.offerPrice) - parseFloat(a.offerPrice);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0; // featured
        }
    });

    // Toggle functions
    const toggleCategory = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
    };

    const hasActiveFilters = selectedCategories.length > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="site-container py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-black text-black uppercase tracking-tight">
                                All Products
                            </h1>
                            <div className="w-16 h-1 bg-red-500 mt-2" />
                        </div>
                        
                        {/* Filter and Sort Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-black text-sm hover:border-red-500 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                                </svg>
                                Filters
                                {hasActiveFilters && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                            
                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 bg-white text-black text-sm focus:outline-none focus:border-red-500 transition-colors"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Desktop Filter Sidebar */}
                <div className="hidden lg:block w-80 flex-shrink-0">
                    <div className="bg-white border-r border-gray-200 min-h-screen sticky top-20">
                        {/* Filter Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black text-black uppercase tracking-tight">Filters</h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="border-b border-gray-200">
                            <div className="px-6 py-4">
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-4">Category</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <label key={category} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={category}
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                                className="w-4 h-4 border-2 border-gray-300 text-red-500 focus:ring-red-500"
                                            />
                                            <span className="text-sm text-gray-700 capitalize">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>



                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1">
                    <div className="site-container py-12">
                        {/* Active Filters Display */}
                        {hasActiveFilters && (
                            <div className="mb-8 p-4 bg-white border border-gray-200 rounded-lg">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                                    {selectedCategories.map(category => (
                                        <span key={category} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                            {category}
                                        </span>
                                    ))}
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                            {sortedProducts.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                        </div>
                        
                        {/* No Products Message */}
                        {sortedProducts.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-xl text-gray-600">No products found with these filters.</p>
                                <button 
                                    onClick={clearFilters}
                                    className="mt-4 text-red-500 hover:text-red-600 font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsFilterOpen(false)}
                    />
                    
                    {/* Filter Panel */}
                    <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black text-black uppercase tracking-tight">Filters</h2>
                                <div className="flex items-center gap-4">
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filter Content */}
                        <div className="p-6 space-y-6">
                            {/* Category */}
                            <div>
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-4">Category</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <label key={category} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={category}
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                                className="w-4 h-4 border-2 border-gray-300 text-red-500 focus:ring-red-500"
                                            />
                                            <span className="text-sm text-gray-700 capitalize">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-red-500 transition-all duration-300"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProducts;
