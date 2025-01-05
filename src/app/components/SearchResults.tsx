import {Star} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';
import {LocationData} from "@/app/page"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";

export default function SearchResults({ place }: {place : LocationData}) {

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
      </div>
      <Popover>
      <PopoverTrigger>
        
        <Button variant="outline">Citation</Button>
        
      </PopoverTrigger>
      <PopoverContent>"{place.comment}" - Someone on <a href={place.commentUrl} style={{color: "blue"}}>Reddit</a></PopoverContent>
    </Popover>
    </CardContent>
  </Card>
  )
}

