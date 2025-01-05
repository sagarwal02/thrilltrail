import {Star} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';
import {LocationData} from "@/app/page"

export default function SearchResults({ place }: {place : LocationData}) {
  // return (
  //   <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
  //     <h2 className="text-xl font-semibold text-blue-800 mb-4">Exciting Destinations</h2>
  //     <ul className="space-y-4">
  //       {results.map((result, index) => (
  //         <li key={index} className="flex items-start space-x-3 bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition duration-300 ease-in-out">
  //           <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
  //           <span className="text-gray-700">{result}</span>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // )

  return (
    <Card className="w-full overflow-hidden">
    <div className="relative h-48">
      <Image
        src={place.photo}
        alt={place.name}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <CardContent className="w-full p-4">
      <h2 className="text-xl font-semibold mb-2">{place.name}</h2>
      <p className="text-sm text-gray-600 mb-2">{place.address}</p>
      <div className="flex items-center">
        {[0,1,2,3,4].map((i) => (
          <Star
            className={`w-5 h-5 ${
              i < Math.round(place.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        {/* <span className="ml-2 text-sm text-gray-600">{place.rating.toFixed(1)}</span> */}
      </div>
    </CardContent>
  </Card>
  )
}

