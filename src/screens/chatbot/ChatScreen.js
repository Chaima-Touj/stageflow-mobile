import React, { useState, useContext, useRef } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, StatusBar
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { chatbotAPI } from "../../api/chatbotAPI";
import * as Animatable from "react-native-animatable";

const SUGGESTIONS = {
  admin:     ["📊 Stats global", "👥 Gérer users", "🚫 Voir les logs", "⚙️ Maintenance"],
  entreprise:["📝 Créer une offre", "👥 Voir candidats", "📅 Entretiens", "💬 Aide recruteur"],
  étudiant:  ["🔍 Trouver un stage", "📝 Conseils CV", "⚙️ Mon profil", "💻 Stages IT"],
};

function MessageBubble({ msg, theme, isDark }) {
  const isUser = msg.sender === "user";
  const s = bubbleStyles(theme, isDark);
  return (
    <Animatable.View animation={isUser ? "fadeInRight" : "fadeInLeft"} duration={350}
      style={[s.wrap, isUser ? s.wrapUser : s.wrapBot]}>
      {!isUser && (
        <View style={s.botAvatar}>
          <LinearGradient colors={[theme.accent, isDark ? "#00D4A0" : "#009955"]} style={s.botAvatarGrad}>
            <Ionicons name="sparkles" size={14} color={isDark ? "#070B14" : "#fff"} />
          </LinearGradient>
        </View>
      )}
      <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleBot]}>
        <Text style={[s.text, isUser ? s.textUser : s.textBot]}>{msg.text}</Text>
      </View>
      {isUser && (
        <View style={[s.userAvatar, { backgroundColor: theme.info + "30" }]}>
          <Ionicons name="person" size={14} color={theme.info} />
        </View>
      )}
    </Animatable.View>
  );
}

export default function ChatScreen() {
  const { user } = useContext(AuthContext);
  const { theme, isDark } = useTheme();
  const role = user?.role || "étudiant";

  const [messages, setMessages] = useState([{
    id: "welcome", sender: "bot",
    text: `Salut ${user?.name?.split(" ")[0] || "!"} ✨\n\nJe suis l'assistant StageFlow. Comment puis-je vous aider ?`,
    time: "Maintenant",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const s = makeStyles(theme, isDark);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = {
      id: Date.now().toString(), sender: "user", text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatbotAPI.send(msg, [], user);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), sender: "bot",
        text: res.reply || "Désolé, je ne peux pas répondre pour le moment.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), sender: "bot",
        text: "Une erreur est survenue. Réessayez.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle={theme.statusBar} />

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.headerAvatar}>
            <LinearGradient colors={[theme.accent, isDark ? "#00D4A0" : "#009955"]} style={s.headerAvatarGrad}>
              <Ionicons name="sparkles" size={18} color={isDark ? "#070B14" : "#fff"} />
            </LinearGradient>
          </View>
          <View>
            <Text style={s.headerTitle}>Assistant StageFlow</Text>
            <View style={s.onlineDot}>
              <View style={s.dot} />
              <Text style={s.onlineText}>En ligne</Text>
            </View>
          </View>
        </View>
        <View style={[s.rolePill, { backgroundColor: theme.accentDim, borderColor: theme.accentBorder }]}>
          <Text style={[s.rolePillText, { color: theme.accent }]}>{role.toUpperCase()}</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <MessageBubble msg={item} theme={theme} isDark={isDark} />}
        ListFooterComponent={loading && (
          <Animatable.View animation="pulse" iterationCount="infinite" style={s.typingWrap}>
            <View style={s.typingDots}>
              {[0, 1, 2].map(i => (
                <Animatable.View key={i} animation="bounce" delay={i * 150} iterationCount="infinite"
                  style={[s.typingDot, { backgroundColor: theme.accent }]} />
              ))}
            </View>
            <Text style={s.typingText}>Réflexion...</Text>
          </Animatable.View>
        )}
      />

      {/* Suggestions */}
      {messages.length < 4 && !loading && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.suggestRow}
          style={{ maxHeight: 46 }}>
          {(SUGGESTIONS[role] || SUGGESTIONS.étudiant).map((s_, i) => (
            <TouchableOpacity key={i}
              style={[{ backgroundColor: theme.bgCard, borderColor: theme.border }, suggestChipBase]}
              onPress={() => sendMessage(s_)}>
              <Text style={{ color: theme.textSub, fontSize: 12, fontWeight: "600" }}>{s_}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
        <View style={s.inputBar}>
          <View style={s.inputWrap}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Posez votre question..."
              placeholderTextColor={theme.textMuted}
              style={s.input}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[s.sendBtn, !input.trim() && { opacity: 0.4 }]}
              onPress={() => sendMessage()} disabled={!input.trim() || loading}>
              <LinearGradient colors={[theme.accent, isDark ? "#00D4A0" : "#009955"]} style={s.sendGrad}>
                <Ionicons name="send" size={16} color={isDark ? "#070B14" : "#fff"} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const suggestChipBase = {
  paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
  marginRight: 10, borderWidth: 1,
};

const bubbleStyles = (t, isDark) => StyleSheet.create({
  wrap:         { flexDirection: "row", alignItems: "flex-end", marginBottom: 16, gap: 8 },
  wrapUser:     { justifyContent: "flex-end" },
  wrapBot:      { justifyContent: "flex-start" },
  botAvatar:    { width: 32, height: 32, borderRadius: 10, overflow: "hidden", flexShrink: 0 },
  botAvatarGrad:{ flex: 1, justifyContent: "center", alignItems: "center" },
  userAvatar:   { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  bubble:       { maxWidth: "78%", padding: 14, borderRadius: 20 },
  bubbleUser:   { backgroundColor: t.info, borderBottomRightRadius: 4 },
  bubbleBot:    { backgroundColor: t.bgCard, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: t.border },
  text:         { fontSize: 14, lineHeight: 22 },
  textUser:     { color: "#fff" },
  textBot:      { color: t.text },
});

const makeStyles = (t, isDark) => StyleSheet.create({
  root:         { flex: 1, backgroundColor: t.bg },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: t.border },
  headerLeft:   { flexDirection: "row", alignItems: "center", gap: 12 },
  headerAvatar: { width: 42, height: 42, borderRadius: 14, overflow: "hidden" },
  headerAvatarGrad:{ flex: 1, justifyContent: "center", alignItems: "center" },
  headerTitle:  { fontSize: 16, fontWeight: "800", color: t.text },
  onlineDot:    { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 },
  dot:          { width: 7, height: 7, borderRadius: 4, backgroundColor: t.success },
  onlineText:   { fontSize: 11, color: t.success, fontWeight: "600" },
  rolePill:     { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  rolePillText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },

  list:         { padding: 16, paddingBottom: 8 },

  typingWrap:   { flexDirection: "row", alignItems: "center", gap: 10, marginLeft: 8, marginBottom: 12 },
  typingDots:   { flexDirection: "row", gap: 4 },
  typingDot:    { width: 7, height: 7, borderRadius: 4 },
  typingText:   { fontSize: 12, color: t.textSub, fontWeight: "600" },

  suggestRow:   { paddingHorizontal: 16, paddingBottom: 10 },

  inputBar:     { paddingHorizontal: 16, paddingBottom: Platform.OS === "ios" ? 30 : 18, paddingTop: 10, borderTopWidth: 1, borderTopColor: t.border, backgroundColor: t.bg },
  inputWrap:    { flexDirection: "row", alignItems: "flex-end", gap: 10, backgroundColor: t.bgCard, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: t.border },
  input:        { flex: 1, color: t.text, fontSize: 15, maxHeight: 100, lineHeight: 20 },
  sendBtn:      { width: 38, height: 38, borderRadius: 12, overflow: "hidden", flexShrink: 0 },
  sendGrad:     { flex: 1, justifyContent: "center", alignItems: "center" },
});