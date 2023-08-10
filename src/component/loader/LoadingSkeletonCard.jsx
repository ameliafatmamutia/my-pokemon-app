import SkeletonLoadingCard from "./SkeletonLoadingCard";

const LoadingSkeletonCard = () => {
    const numberOfCards = 20;
  
    const cards = [];
    for (let i = 0; i < numberOfCards; i++) {
      cards.push(<SkeletonLoadingCard key={`${i}-skeleton-loading-card`} />);
    }
  
    return (
      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-5">
        {cards}
      </div>
    );
};

export default LoadingSkeletonCard;