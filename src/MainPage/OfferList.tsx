import { useState } from 'react';
import { Offer } from '../mocks/offers';
import OfferCard from './OfferCard';

interface OfferListProps {
  offers: Offer[];
}

export default function OfferList({ offers }: OfferListProps) {
  const [activeCardId, setActiveCardId] = useState<string | undefined>(
    undefined,
  );

  const handleCardHover = (id: string | undefined) => {
    setActiveCardId(id);
  };

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} onHover={handleCardHover} />
      ))}
    </div>
  );
}
