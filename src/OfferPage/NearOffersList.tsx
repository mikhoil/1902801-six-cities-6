import OfferCard from '../MainPage/OfferCard';
import { Offer } from '../types/offer';

export interface NearOffersListProps {
  offers: Offer[];
}

export default function NearOffersList({ offers }: NearOffersListProps) {
  return (
    <div className="near-places__list places__list">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} classNamePrefix="near-places" />
      ))}
    </div>
  );
}
