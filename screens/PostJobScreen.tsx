import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createJob } from "../services/supabase/data";
import { uploadImage } from "../services/supabase/storage";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../hooks/useAuth";

export default function PostJobScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [budget, setBudget] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const { user } = useAuth();

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsMultipleSelection: true });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const remoteUrl = await uploadImage(uri, `jobs/${Date.now()}_${Math.random().toString(36).slice(-5)}.jpg`);
      setImages((prev) => [...prev, remoteUrl]);
    }
  };

  const submit = async () => {
    if (!user) return Alert.alert("Authentication", "Please sign in again.");
    if (!title || !desc) return Alert.alert("Validation", "Title and description are required.");
    const jobId = await createJob({ title, description: desc, budget, images, location: { lat: 0, lng: 0 }, homeownerId: user.uid, status: "open" });
    navigation.replace("JobChat", { chatId: `job-${jobId}`, title });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20 }}>Post Job</Text>
      <TextInput placeholder="Title" style={{ borderBottomWidth: 1, marginVertical: 8 }} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Description" multiline style={{ borderWidth: 1, marginVertical: 8, height: 100, textAlignVertical: "top" }} value={desc} onChangeText={setDesc} />
      <TextInput placeholder="Budget (UGX)" keyboardType="numeric" style={{ borderBottomWidth: 1, marginVertical: 8 }} value={budget} onChangeText={setBudget} />
      <Button title="Add image" onPress={selectImage} />
      <Button title="Submit" onPress={submit} />
    </View>
  );
}
