import DetailsBadge from "./DetailsBadge";

const DetailsHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-2xl font-semibold">{title}</p>
      <DetailsBadge score={categoryScore} />
    </div>
  );
};

export default DetailsHeader;
