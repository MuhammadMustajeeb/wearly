'use client'
import { useState } from 'react';
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {
    const { products } = useAppContext();
    
    // Filter states
    const [sortBy, setSortBy] = useState('featured');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        size: true,
        price: true,
        color: true
    });

    // Available options
    const categories = ['all', 'plain', 'graphic', 'polo', 'hoodies'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#ffffff' },
        { name: 'Red', value: '#e63946' },
        { name: 'Blue', value: '#0077ff' },
        { name: 'Gray', value: '#6c757d' },
        { name: 'Green', value: '#28a745' },
        { name: 'Pink', value: '#e83e8c' },
        { name: 'Yellow', value: '#ffc107' }
    ];

    // Filter and sort logic (keeping existing logic intact)
    const filteredProducts = products.filter(product => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
        
        // Size filter
        if (selectedSizes.length > 0 && !selectedSizes.some(size => product.availableSizes?.includes(size))) return false;
        
        // Color filter
        if (selectedColors.length > 0 && !selectedColors.some(color => product.availableColors?.includes(color))) return false;
        
        // Price filter
        if (product.offerPrice < priceRange[0] || product.offerPrice > priceRange[1]) return false;
        
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
    const toggleSize = (size) => {
        setSelectedSizes(prev => 
            prev.includes(size) 
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const toggleColor = (color) => {
        setSelectedColors(prev => 
            prev.includes(color) 
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedSizes([]);
        setSelectedColors([]);
        setPriceRange([0, 500]);
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 500;

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
                            <button
                                onClick={() => toggleSection('category')}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide">Category</h3>
                                <svg 
                                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedSections.category && (
                                <div className="px-6 pb-4 space-y-2">
                                    {categories.map(category => (
                                        <label key={category} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={category}
                                                checked={selectedCategory === category}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-4 h-4 border-2 border-gray-300 text-red-500 focus:ring-red-500"
                                            />
                                            <span className="text-sm text-gray-700 capitalize">
                                                {category === 'all' ? 'All Categories' : category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Size Filter */}
                        <div className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection('size')}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide">Size</h3>
                                <svg 
                                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.size ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedSections.size && (
                                <div className="px-6 pb-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        {sizes.map(size => (
                                            <label key={size} className="flex items-center justify-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={size}
                                                    checked={selectedSizes.includes(size)}
                                                    onChange={() => toggleSize(size)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-12 h-12 flex items-center justify-center border-2 rounded transition-all ${
                                                    selectedSizes.includes(size)
                                                        ? 'border-red-500 bg-red-500 text-white'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}>
                                                    <span className="text-sm font-medium">{size}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price Filter */}
                        <div className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection('price')}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide">Price</h3>
                                <svg 
                                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedSections.price && (
                                <div className="px-6 pb-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="500"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Color Filter */}
                        <div className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection('color')}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide">Color</h3>
                                <svg 
                                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.color ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedSections.color && (
                                <div className="px-6 pb-4">
                                    <div className="grid grid-cols-4 gap-3">
                                        {colors.map(color => (
                                            <label key={color.value} className="flex items-center justify-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={color.value}
                                                    checked={selectedColors.includes(color.value)}
                                                    onChange={() => toggleColor(color.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                    selectedColors.includes(color.value)
                                                        ? 'border-red-500 ring-2 ring-red-500 ring-offset-2'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                    {selectedCategory !== 'all' && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                            {selectedCategory}
                                        </span>
                                    )}
                                    {selectedSizes.map(size => (
                                        <span key={size} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                            {size}
                                        </span>
                                    ))}
                                    {selectedColors.map(color => (
                                        <span key={color} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                            {colors.find(c => c.value === color)?.name}
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
                                                type="radio"
                                                name="mobile-category"
                                                value={category}
                                                checked={selectedCategory === category}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-4 h-4 border-2 border-gray-300 text-red-500 focus:ring-red-500"
                                            />
                                            <span className="text-sm text-gray-700 capitalize">
                                                {category === 'all' ? 'All Categories' : category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Size */}
                            <div>
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-4">Size</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {sizes.map(size => (
                                        <label key={size} className="flex items-center justify-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={size}
                                                checked={selectedSizes.includes(size)}
                                                onChange={() => toggleSize(size)}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-12 flex items-center justify-center border-2 rounded transition-all ${
                                                selectedSizes.includes(size)
                                                    ? 'border-red-500 bg-red-500 text-white'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}>
                                                <span className="text-sm font-medium">{size}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-4">Price</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-4">Color</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {colors.map(color => (
                                        <label key={color.value} className="flex items-center justify-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={color.value}
                                                checked={selectedColors.includes(color.value)}
                                                onChange={() => toggleColor(color.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                selectedColors.includes(color.value)
                                                    ? 'border-red-500 ring-2 ring-red-500 ring-offset-2'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                            />
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
