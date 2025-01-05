'use client'

import { useState } from 'react'
import SearchInput from '@/app/components/SearchInput'
import ThinkingState from '@/app/components/Thinking'
import SearchResults from '@/app/components/SearchResults'
import { Compass } from 'lucide-react'
import { getPlaceData } from './actions'

export interface LocationData {
  name: string,
  address: string,
  photo: string,
  rating: number,
  comment: string,
  commentUrl: string,
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [results, setResults] = useState<LocationData[]>([])
  
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    setIsThinking(true)
    setResults([])

    console.log(process.env.NODE_ENV)

    const search = await fetch("http://127.0.0.1:5000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"query": searchQuery})
    }).then((res) => res.json());

    console.log(search["locations"])

    const locations : LocationData[] = [];
    for (let location of search["locations"]){
      const mapData = await getPlaceData(location.location_name, location.address);
      
      if (mapData){
        locations.push({...mapData, comment: location.comment, commentUrl: location.commentUrl});
      }
      
    }

    setResults(locations)
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
        {results.length > 0 && results.map((location) => (
          <SearchResults place={location}/>
        ))}
      </div>
    </main>
  )
}
