import { memo, useCallback, useState } from 'react';
import { Offer } from '../types/offer';
import OfferCard from './OfferCard';

interface OfferListProps {
  offers: Offer[];
  activeOfferId: string | null;
  onActiveChange?: (id: string | null) => void;
}

export default function OfferList({
  offers,
  onActiveChange,
  activeOfferId,
}: OfferListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleEnter = useCallback(
    (id: string) => {
      setActiveId(id);
      onActiveChange?.(id);
    },
    [onActiveChange],
  );

  const handleLeave = useCallback(() => {
    setActiveId(null);
    onActiveChange?.(null);
  }, [onActiveChange]);

  const MemoizedOfferCard = memo(OfferCard);

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <div key={offer.id} data-active={activeId === offer.id}>
          <MemoizedOfferCard
            offer={offer}
            isActive={activeOfferId === offer.id}
            onMouseEnter={() => handleEnter(offer.id)}
            onMouseLeave={handleLeave}
            onFocus={() => handleEnter(offer.id)}
            onBlur={handleLeave}
          />
        </div>
      ))}
    </div>
  );
}
