import { useEffect, useState } from "react";
import { useUserStore } from "~/lib/puter";

const wipe = () => {
  const { auth, fs, kv, isLoading, error } = useUserStore();
  const [Files, setFiles] = useState<FSItem[]>([]);

  const loadDirectory = async () => {
    const files = (await fs.readDir("kv")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadDirectory();
  }, []);

  const handleDelete = async () => {
    Files.forEach(async (file) => {
      await fs.delete(file.name);
    });
    await kv.flush();
    loadDirectory();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error...</div>;
  }

  return (
    <div>
      Authenticated as: ${auth.user?.username}
      <div>Existing Files:</div>
      <div>
        {Files.map((file) => (
          <div key={file.id} className="flex flex-row gap-4">
            <p>{file.name}</p>
          </div>
        ))}
      </div>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={() => handleDelete()}
        >
          Wipe App Data
        </button>
      </div>
    </div>
  );
};

export default wipe;
