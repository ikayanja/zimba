import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { listenMessages, sendMessage } from "../services/supabase/data";
import { useAuth } from "../hooks/useAuth";
import { glass, theme } from "../constants/theme";
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
    <LinearGradient colors={[theme.colors.bgTop, "#f6f6f2", theme.colors.bgBottom]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Inbox</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isMe = item.senderId === user?.uid;

            return (
              <View style={[styles.messageWrap, isMe ? styles.messageWrapMe : styles.messageWrapOther]}>
                {!isMe ? <Text style={styles.senderName}>{item.senderName}</Text> : null}
                <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
                  <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>{item.text}</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.emptyText}>No messages yet. Start the conversation.</Text>}
        />

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Write a message"
            placeholderTextColor={theme.colors.textMuted}
          />
          <TouchableOpacity style={styles.sendButton} onPress={onSend}>
            <Ionicons name="arrow-up" size={18} color="#152210" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgBottom,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  header: {
    paddingTop: 22,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kicker: {
    color: theme.colors.emerald,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 8,
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  headerButton: {
    ...glass.soft,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageWrap: {
    marginBottom: 14,
    maxWidth: "86%",
  },
  messageWrapMe: {
    alignSelf: "flex-end",
  },
  messageWrapOther: {
    alignSelf: "flex-start",
  },
  senderName: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: 6,
    marginHorizontal: 8,
  },
  messageBubble: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  messageBubbleMe: {
    backgroundColor: theme.colors.emerald,
    borderBottomRightRadius: 8,
  },
  messageBubbleOther: {
    ...glass.card,
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextMe: {
    color: "#0a0b0f",
  },
  messageTextOther: {
    color: theme.colors.text,
  },
  emptyText: {
    color: theme.colors.textMuted,
    textAlign: "center",
    marginTop: 24,
  },
  composer: {
    ...glass.card,
    borderRadius: 28,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 82,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 46,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.emerald,
    alignItems: "center",
    justifyContent: "center",
  },
});
