import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

// b95c1c76-2301-496a-8fd5-f686f5e03938

const resume = () => {
  const { auth, fs, kv, isLoading } = usePuterStore();
  const { id } = useParams();
  const [resumeURL, setResumeURL] = useState("");
  const [imageURL, setImageURl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadresume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeURL = URL.createObjectURL(pdfBlob);
      setResumeURL(resumeURL);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageURL = URL.createObjectURL(imageBlob);
      setImageURl(imageURL);

      setFeedback(data.feedback);
      console.log({ resumeURL, imageURL, feedback });
    };

    loadresume();
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img
            src="/public/icons/back.svg"
            alt="logo"
            className="w-2.5 h-2.5"
          />
          <span className="text-gray-800 font-semibold text-sm">
            Back To Home
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full  max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] sticky bg-cover h-[100vh] top-0 items-center justify-center">
          {imageURL && resumeURL && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-2xl::h-fit w-fit">
              <a href={resumeURL} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageURL}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl font-bold !text-black">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/public/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
