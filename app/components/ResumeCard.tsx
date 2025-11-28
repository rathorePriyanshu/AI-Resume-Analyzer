import { Link } from "react-router";
import ScoreTracker from "./ScoreTracker";
import { useEffect, useState } from "react";
import { useUserStore } from "~/lib/State";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePaths },
}: {
  resume: Resume;
}) => {
  const { fs } = useUserStore();
  const [resumeURL, setResumeURL] = useState("");
  const imagePath = imagePaths?.[0];

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      setResumeURL(url);
    };

    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header flex justify-between items-start gap-4">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {companyName && (
            <h2 className="!text-black font-bold break-words whitespace-normal overflow-hidden">
              {companyName}
            </h2>
          )}
          {jobTitle && (
            <h3 className="text-lg text-gray-500 break-words whitespace-normal overflow-hidden line-clamp-1">
              {jobTitle}
            </h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreTracker score={feedback.overallScore} />
        </div>
      </div>
      {resumeURL && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeURL}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[250px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
