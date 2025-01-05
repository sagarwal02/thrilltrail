'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  onSearch: (query: string) => void
}

export default function SearchInput({ onSearch }: SearchInputProps) {
    const [query, setQuery] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    const placeholders = [
        'Where can I find donuts in Austin',
        'Best places to get drunk in NYC',
        "Historical attractions I can't miss in Boston",
        'Bars in San Francisco where I can have fun with friends',
    ];

    useEffect(() => {
        const currentText = placeholders[placeholderIndex];

        if (!isDeleting && charIndex < currentText.length) {
        const timeout = setTimeout(() => {
            setPlaceholder((prev) => prev + currentText[charIndex]);
            setCharIndex((prev) => prev + 1);
        }, 80); // Typing speed
        return () => clearTimeout(timeout);
        }

        if (isDeleting && charIndex > 0) {
        const timeout = setTimeout(() => {
            setPlaceholder((prev) => prev.slice(0, -1));
            setCharIndex((prev) => prev - 1);
        }, 50); // Deleting speed
        return () => clearTimeout(timeout);
        }

        if (!isDeleting && charIndex === currentText.length) {
        const timeout = setTimeout(() => setIsDeleting(true), 2000); // Pause before deleting
        return () => clearTimeout(timeout);
        }

        if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
    }, [charIndex, isDeleting, placeholderIndex, placeholders]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 text-lg rounded-full border border-blue-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-300 ease-in-out"
            aria-label="Search for travel destinations"
        />
        <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
            aria-label="Search"
        >
            <Search className="w-5 h-5" />
        </button>
        </form>
    );
}

