import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../../types';
import { MapPinIcon, CurrencyDollarIcon, HomeIcon, ArrowsPointingOutIcon, PencilSquareIcon } from '@heroicons/react/24/outline'; // Changed BedIcon to HomeIcon for general purpose
import Button from '../shared/Button';

interface ListingCardProps {
  listing: Listing;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onEdit, onDelete }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-sky-500/30 transform hover:-translate-y-1">
      <div className="relative h-56 w-full">
        <img 
          src={listing.image_urls[0] || `https://via.placeholder.com/400x250/777/fff?text=${listing.title.split(' ').join('+')}`} 
          alt={listing.title} 
          className="w-full h-full object-cover" 
        />
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded
          ${listing.status === 'active' ? 'bg-green-500' : listing.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-100 mb-1 truncate" title={listing.title}>
          {listing.title}
        </h3>
        <p className="text-sm text-gray-400 flex items-center mb-3 truncate" title={listing.address}>
          <MapPinIcon className="h-4 w-4 mr-1.5 text-sky-400 shrink-0" />
          {listing.address}
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300 mb-4">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-1.5 text-sky-400" />
            <span className="font-semibold text-lg">{formatPrice(listing.price)}</span>
          </div>
           <div className="flex items-center">
            <ArrowsPointingOutIcon className="h-5 w-5 mr-1.5 text-sky-400" />
            {listing.square_footage} sqft
          </div>
          <div className="flex items-center col-span-1">
            <HomeIcon className="h-5 w-5 mr-1.5 text-sky-400" /> {/* Using HomeIcon more broadly */}
            <div className="flex items-center text-gray-600">
              <span className="mr-2">{listing.bedrooms} bds</span>
              <span className="mr-2">|</span>
              <span className="mr-2">{listing.bathrooms} ba</span>
              <span className="mr-2">|</span>
              <span>{listing.square_footage} sqft</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-grow">
          {listing.description}
        </p>

        <div className="mt-auto pt-3 border-t border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <Link to={`/listings/${listing.id}`} className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <div className="flex space-x-2 w-full sm:w-auto">
            {onEdit && (
              <Button onClick={() => onEdit(listing.id)} variant="ghost" size="sm" className="flex-1 sm:flex-initial" aria-label="Edit listing">
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
            )}
            {onDelete && (
               <Button onClick={() => onDelete(listing.id)} variant="danger" size="sm" className="bg-red-700/50 hover:bg-red-600 flex-1 sm:flex-initial" aria-label="Delete listing">
                 Delete {/* Consider using an icon for delete too */}
               </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
