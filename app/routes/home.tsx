import NavBar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useUserStore } from "~/lib/puter";
import { supabase } from "~/lib/supabaseClient";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuMetrics" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, kv } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumes, setResume] = useState<Resume[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate(`/auth?next=${location.pathname}`, { replace: true });
        return;
      }
      setLoading(false);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate(`/auth?next=${location.pathname}`, { replace: true });
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate, location.pathname]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src="/images/resume-scan.gif"
          alt="scanner"
          className="w-[200px]"
        />
      </div>
    );
  }

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
