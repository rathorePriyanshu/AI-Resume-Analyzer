import { useState, type FormEvent, type HTMLElementType } from "react";
import FileUploader from "~/components/FileUploader";
import NavBar from "~/components/Navbar";

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statustext, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelected = (file: File | null) => {
    setFile(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formdata = new FormData(form);

    const companyname = formdata.get("company-name");
    const jobtitle = formdata.get("job-title");
    const jobdescription = formdata.get("job-description");

    console.log({ companyname, jobtitle, jobdescription, file });
  };

  return (
    <main className="bg-[url('./images/bg-main.svg')] bg-cover">
      <NavBar />
      <section className="main-section ">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statustext}</h2>
              <img
                src="/public/images/resume-scan.gif"
                className="w-full"
              ></img>
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
                ></input>
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  id="job-title"
                  type="text"
                  name="job-title"
                  placeholder="Job Title..."
                ></input>
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  id="job-description"
                  rows={5}
                  name="job-description"
                  placeholder="Job Description..."
                ></textarea>
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelected={handleFileSelected} />
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

export default upload;
