import { MapPin } from 'lucide-react'

interface SearchResultsProps {
  results: string[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Exciting Destinations</h2>
      <ul className="space-y-4">
        {results.map((result, index) => (
          <li key={index} className="flex items-start space-x-3 bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition duration-300 ease-in-out">
            <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <span className="text-gray-700">{result}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

