import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import NavBar from "~/components/Navbar";
import { AIResponseFormat, prepareInstructions } from "~/constants";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const Upload = () => {
  const { auth, isLoading, ai, kv, fs } = usePuterStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statustext, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelected = (file: File | null) => setFile(file);

  const handleAnalyze = async ({
    companyname,
    jobtitle,
    jobdescription,
    file,
  }: {
    companyname: string;
    jobtitle: string;
    jobdescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    try {
      // 1️⃣ Upload PDF
      setStatusText("Uploading the file...");
      const uploadFile = await fs.upload([file]);
      console.log("Upload response:", uploadFile);
      if (!uploadFile?.path) {
        setStatusText("ERROR: Unable to upload file");
        return;
      }

      // 2️⃣ Prepare data
      setStatusText("Preparing the data...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumepath: uploadFile.path,
        imagepath: "", // skip image for now
        companyname,
        jobtitle,
        jobdescription,
        Feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // 3️⃣ Call AI feedback safely
      setStatusText("Analyzing the resume...");
      let feedback;
      try {
        feedback = await ai.feedback(
          uploadFile.path,
          prepareInstructions({
            jobTitle: jobtitle,
            jobDescription: jobdescription,
            AIResponseFormat: AIResponseFormat,
          })
        );
        if (!feedback) {
          setStatusText("ERROR: AI feedback returned nothing");
          return;
        }
      } catch (err) {
        console.error("AI feedback failed:", err);
        setStatusText("ERROR: AI analysis failed");
        return;
      }
      let feedbackText: string =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : (feedback.message.content?.[0]?.text ?? "");

      // Hamesha object me convert karo
      let feedbackObject: any;
      try {
        feedbackObject = JSON.parse(feedbackText); // Agar valid JSON string hai
      } catch {
        feedbackObject = { raw: feedbackText }; // fallback object
      }

      // Assign to your data
      data.Feedback = feedbackObject;

      // 5️⃣ Save final data
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analysis complete!");
      console.log("Final data:", data);
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatusText("ERROR: Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a resume first");
      return;
    }

    const formData = new FormData(e.currentTarget);
    handleAnalyze({
      companyname: formData.get("company-name") as string,
      jobtitle: formData.get("job-title") as string,
      jobdescription: formData.get("job-description") as string,
      file,
    });
  };

  return (
    <main className="bg-[url('./images/bg-main.svg')] bg-cover">
      <NavBar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statustext}</h2>
              <img src="/public/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  id="company-name"
                  type="text"
                  name="company-name"
                  placeholder="Company Name..."
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  id="job-title"
                  type="text"
                  name="job-title"
                  placeholder="Job Title..."
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  id="job-description"
                  rows={5}
                  name="job-description"
                  placeholder="Job Description..."
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader file={file} onFileSelect={handleFileSelected} />
              </div>
              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;

// TechSphere Solutions is seeking a passionate Full Stack Developer with expertise in React.js and Node.js to join our product team in Bangalore, India (Hybrid). You will be responsible for designing, developing, and deploying high-quality web applications, collaborating with UI/UX designers, backend engineers, and product managers.

// Responsibilities:

// Develop and maintain responsive, high-performance web applications using React.js and Node.js.

// Build and maintain RESTful APIs and integrate with third-party services.

// Write clean, maintainable, and scalable code following best practices.

// Optimize applications for maximum speed and scalability.

// Implement automated testing and CI/CD pipelines.

// Participate in code reviews and provide constructive feedback.

// Required Skills:

// Bachelor’s degree in Computer Science, Engineering, or a related field.

// 2–4 years of hands-on experience with JavaScript/TypeScript, React.js, and Node.js.

// Proficiency in HTML5, CSS3, and UI frameworks (e.g., Chakra UI, Material-UI).

// Experience with relational (MySQL, PostgreSQL) and NoSQL databases (MongoDB).

// Knowledge of Git, API design, and authentication/security best practices.

// Nice to Have:

// Experience with cloud platforms (AWS, GCP, Azure).

// Familiarity with Docker and Kubernetes.

// Understanding of GraphQL.
