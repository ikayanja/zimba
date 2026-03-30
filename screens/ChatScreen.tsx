import { View, TextInput, Button, FlatList, Text, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { listenMessages, sendMessage } from "../services/firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import type { ChatMessage } from "../utils/types";

export default function ChatScreen({ route }: any) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const chatId = route?.params?.chatId ?? "general";
  const title = route?.params?.title ?? "Messages";

  useEffect(() => {
    const unsub = listenMessages(chatId, setMessages);
    return unsub;
  }, [chatId]);

  const onSend = async () => {
    if (!text.trim() || !user) return;
    await sendMessage(chatId, {
      text,
      senderId: user.uid,
      senderName: user.displayName || "User",
    });
    setText("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", paddingHorizontal: 16, paddingTop: 12 }}>{title}</Text>
      <FlatList data={messages} keyExtractor={(item) => item.id} renderItem={({ item }) => (
        <View style={{ margin: 8, padding: 8, backgroundColor: item.senderId === user?.uid ? "#e1ffc7" : "#fff", alignSelf: item.senderId === user?.uid ? "flex-end" : "flex-start", borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: "gray" }}>{item.senderName}</Text>
          <Text>{item.text}</Text>
        </View>
      )} />
      <View style={{ flexDirection: "row", padding: 8 }}>
        <TextInput style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 }} value={text} onChangeText={setText} />
        <Button title="Send" onPress={onSend} />
      </View>
    </SafeAreaView>
  );
}
