interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg h-full">
      <div className="px-4 py-5 sm:p-6 h-full">{children}</div>
    </div>
  );
};

export default Card;
