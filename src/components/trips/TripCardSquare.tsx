import type { City } from '@/types'

interface TripCardSquareProps {
  city: City
}

export default function TripCardSquare({ city }: TripCardSquareProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="w-full aspect-square bg-[#F3F4F6] overflow-hidden">
        {city.imageUrl ? (
          <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-sm">
            {city.name[0]}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-[#1E1E1E] text-sm">{city.name}</p>
        <p className="text-xs text-[#6B7280]">{city.country}</p>
      </div>
    </div>
  )
}
