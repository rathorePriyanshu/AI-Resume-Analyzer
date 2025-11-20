import NavBar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useUserStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuMetrics" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { kv } = useUserStore();
  const user = useUserStore((s) => s.auth.user);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumes, setResume] = useState<Resume[]>([]);

  useEffect(() => {
    if (!user) {
      setResume([]);
      return;
    }

    const loadResume = async () => {
      setResumeLoading(true);

      const items = (await kv.list("resume:*", true)) as string[];
      const parsed = items.map((r) => JSON.parse(r) as Resume);

      setResume(parsed || []);
      setResumeLoading(false);
    };

    loadResume();
  }, [user]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
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
              src="/images/resume-scan-2.gif"
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
              className="primary-button w-full text-xl font-semibold"
            >
              Upload
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
