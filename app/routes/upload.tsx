import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useUserStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { pdfToImages } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { AIResponseFormat, prepareInstructions } from "../constants";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = useUserStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);
      setStatusText("Uploading the PDF...");

      //  Upload PDF
      const [pdfData] = await fs.upload([file]);
      if (!pdfData || !pdfData.Key)
        return setStatusText("Error: Failed to upload the PDF file");
      const pdfPath = pdfData.Key;
      setStatusText("Converting PDF to images...");

      //  Convert PDF to images
      const images: File[] = await pdfToImages(file);
      if (!images || images.length === 0)
        return setStatusText("Error: Failed to convert PDF to images");

      //  Upload images
      type UploadedFile = { Key: string; [key: string]: any };
      const uploadedImages: UploadedFile[] = await fs.upload(images);
      const imagePaths: string[] = uploadedImages.map(
        (img: UploadedFile) => img.Key
      );
      if (imagePaths.length === 0)
        return setStatusText("Error: Failed to upload images");

      setStatusText("Extracting text from first page...");

      //  OCR first page
      const extractedText = await ai.img2txt(images[0]);
      if (!extractedText || extractedText.trim() === "")
        return setStatusText(
          "Error: OCR failed. The PDF seems blank or unreadable."
        );

      //  Save initial data in KV
      const uuid = generateUUID();
      const resumeData = {
        id: uuid,
        resumePath: pdfPath,
        imagePaths,
        companyName,
        jobTitle,
        jobDescription,
        extractedText,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));

      setStatusText("Analyzing resume with AI...");

      //  Get AI feedback
      const feedback = await ai.feedback(
        extractedText,
        prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
      );
      if (!feedback) return setStatusText("Error: Failed to analyze resume");

      //  Parse AI feedback
      let feedbackText = "";
      if (Array.isArray(feedback.message.content)) {
        const textItem = feedback.message.content.find(
          (c) => c.type === "text"
        );
        feedbackText = textItem?.text ?? "";
      } else if (typeof feedback.message.content === "string") {
        feedbackText = feedback.message.content;
      }

      let parsedFeedback;
      try {
        parsedFeedback = feedbackText ? JSON.parse(feedbackText) : feedbackText;
      } catch {
        parsedFeedback = feedbackText;
      }

      //  Save feedback in KV
      resumeData.feedback = parsedFeedback;
      await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));

      setStatusText("Analysis complete, redirecting...");
      console.log(resumeData);

      //  Navigate to resume page
      navigate(`/resume/${uuid}`);
    } catch (err: any) {
      console.error("handleAnalyze error:", err);
      setStatusText("Error: " + (err.message || "Something went wrong"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} file={file} />
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
