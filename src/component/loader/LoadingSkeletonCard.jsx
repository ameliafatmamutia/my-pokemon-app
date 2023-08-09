import SkeletonLoadingCard from "./SkeletonLoadingCard";

const LoadingSkeletonCard = () => {
    const numberOfCards = 12;
  
    const cards = [];
    for (let i = 0; i < numberOfCards; i++) {
      cards.push(<SkeletonLoadingCard key={`${i}-skeleton-loading-card`} />);
    }
  
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6 mt-4">
        {cards}
      </div>
    );
};

export default LoadingSkeletonCard;