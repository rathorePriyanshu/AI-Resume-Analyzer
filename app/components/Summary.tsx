import ScoreGauge from "./ScoreGauge";
import Categories from "./Categories";

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row p-4 gap-8 items-center">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col gap-2 ">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-gray-500 text-sm">
            This score is calculated based on variables listed below
          </p>
        </div>
      </div>
      <Categories title="Tone & Style" score={feedback.toneAndStyle.score} />
      <Categories title="Content" score={feedback.content.score} />
      <Categories title="Structure" score={feedback.structure.score} />
      <Categories title="Skills" score={feedback.skills.score} />
    </div>
  );
};

export default Summary;
