'use client'

import { useState } from 'react'
import SearchInput from '@/app/components/SearchInput'
import ThinkingState from '@/app/components/Thinking'
import SearchResults from '@/app/components/SearchResults'
import { Compass } from 'lucide-react'
import {getAllComments} from "@/app/comments"

export default function Home() {
  const [query, setQuery] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [results, setResults] = useState<string[]>([])


interface RedditChild {
  kind: string;
  data: {
    body?: string;
    author?: string;
    id?: string;
    parent_id?: string;
    count?: number;
    children?: string[];
  };
}



  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    setIsThinking(true)
    setResults([])

    // Simulate API call

    // getAllComments("lmj453").then((comments) => {
    //   console.log(comments);
    // });
    console.log(process.env.NODE_ENV)

    const search = await fetch("http://127.0.0.1:5000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"query": searchQuery})
    }).then((res) => res.json());

    console.log(search["locations"])

    // Mock results
    const mockResults = [
      'Eiffel Tower, Paris: Iconic landmark with stunning city views',
      'Machu Picchu, Peru: Ancient Incan city in the Andes Mountains',
      'Great Barrier Reef, Australia: World\'s largest coral reef system',
    ]

    setResults(mockResults)
    setIsThinking(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-blue-50">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center justify-center space-x-2">
          <Compass className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-semibold text-center text-blue-800">ThrillTrail</h1>
        </div>
        <p className="text-center text-gray-600">Discover fun and exciting places to visit</p>
        <SearchInput onSearch={handleSearch} />
        {isThinking && <ThinkingState />}
        {results.length > 0 && <SearchResults results={results} />}
      </div>
    </main>
  )
}

