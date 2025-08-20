import ScoreBadge from "./ScoreBadge";

const Categories = ({ title, score }: { title: string; score: number }) => {
  const textColour =
    score > 70
      ? "text-green-600"
      : score > 49
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl">
          <span className={textColour}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

export default Categories;
