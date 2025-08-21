import NavBar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumes, setResume] = useState<Resume[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      setResumeLoading(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResume = resumes.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      console.log("parsedResume", parsedResume);

      setResume(parsedResume || []);
      setResumeLoading(false);
    };

    loadResume();
  }, []);

  return (
    <main className="bg-[url('./images/bg-main.svg')] bg-cover">
      <NavBar />
      <section className="main-section ">
        <div className="page-heading py-16">
          <h1>Track Your Application & Resume Ratings</h1>
          {!resumeLoading && resumes.length === 0 ? (
            <h2>No Resume Found. Upload your first resume to get feedback</h2>
          ) : (
            <h2>Review your submissions & check AI-powered feedback</h2>
          )}
        </div>
        {resumeLoading && (
          <div className="flex flex-col items-center justify-center">
            <img
              src="/public/images/resume-scan-2.gif"
              alt="scanner"
              className="w-[200px]"
            />
          </div>
        )}
        {!resumeLoading && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((res) => (
              <ResumeCard key={res.id} resume={res} />
            ))}
          </div>
        )}
        {!resumeLoading && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
