import { supabase } from "./config";

export const uploadImage = async (uri: string, path: string) => {
  const response = await fetch(uri);
  const file = await response.arrayBuffer();
  const extension = path.split(".").pop()?.split("?")[0] || "jpg";

  const { error } = await supabase.storage.from("job-images").upload(path, file, {
    contentType: `image/${extension === "jpg" ? "jpeg" : extension}`,
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("job-images").getPublicUrl(path);
  return data.publicUrl;
};
