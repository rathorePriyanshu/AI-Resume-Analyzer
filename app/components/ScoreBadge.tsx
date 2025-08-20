interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColour = "";
  let badgeText = "";

  if (score > 70) {
    badgeColour = "bg-badge-green text-green-600";
    badgeText = "Strong";
  } else if (score > 49) {
    badgeColour = "bg-badge-yellow text-yellow-600";
    badgeText = "Good Start";
  } else {
    badgeColour = "bg-badge-red text-red-600";
    badgeText = "Needs Work";
  }

  return (
    <div className={`px-3 py-1 rounded-full ${badgeColour}`}>
      <p className="text-sm font-medium">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;
