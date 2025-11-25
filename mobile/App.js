import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import API, { setToken } from "./src/api";

const Stack = createNativeStackNavigator();

const FormField = ({ value, onChangeText, ...props }) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChangeText}
    {...props}
  />
);

const AuthScreen = ({ navigation, mode = "login", onAuth }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const isLogin = mode === "login";

  const handleSubmit = async () => {
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    const payload = isLogin ? form : form;
    const { data } = await API.post(endpoint, payload);
    setToken(data.token);
    onAuth(data.user);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.hero}>{isLogin ? "Welcome back" : "Join Voluntry"}</Text>
      {!isLogin && (
        <FormField
          placeholder="Full name"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
      )}
      <FormField
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
      />
      <FormField
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Create account"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.replace(isLogin ? "Signup" : "Login")}
      >
        <Text style={styles.link}>
          {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const DashboardScreen = ({ navigation, stats, activities, onRefresh }) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Hours</Text>
        <Text style={styles.statValue}>{stats.hoursContributed}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Events</Text>
        <Text style={styles.statValue}>{stats.eventsCompleted}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Impact</Text>
        <Text style={styles.statValue}>{stats.impactPoints}</Text>
      </View>
    </View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Activities</Text>
      <TouchableOpacity onPress={onRefresh}>
        <Text style={styles.link}>Refresh</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={activities}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text>{item.description}</Text>
          <View style={styles.activityMeta}>
            <Text style={styles.tag}>{item.status}</Text>
            <Text>{item.hours}h</Text>
          </View>
        </View>
      )}
    />
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Chat")}
    >
      <Text style={styles.buttonText}>Open AI coach</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const ChatScreen = ({ messages, onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.chatBubble,
              item.role === "assistant" && styles.chatBubbleAssistant,
            ]}
          >
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.chatInputRow}>
        <TextInput
          style={styles.chatInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ask something..."
        />
        <TouchableOpacity style={styles.chatSend} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    hoursContributed: 0,
    eventsCompleted: 0,
    impactPoints: 0,
  });
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([]);

  const bootstrap = async () => {
    if (!API.token) return;
    const [{ data: profile }, { data: dashboard }, { data: activityList }] =
      await Promise.all([
        API.get("/profile"),
        API.get("/stats/dashboard"),
        API.get("/volunteer"),
      ]);
    setUser({ id: profile._id, name: profile.name, email: profile.email });
    setStats(dashboard.stats);
    setActivities(activityList);
    const history = await API.get("/chat/history");
    setMessages(history.data);
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const handleSendMessage = async (content) => {
    const { data } = await API.post("/chat", { content });
    setMessages((prev) => [...prev, data.userMessage, data.aiMessage]);
  };

  const refreshDashboard = async () => {
    const [{ data: dashboard }, { data: activityList }] = await Promise.all([
      API.get("/stats/dashboard"),
      API.get("/volunteer"),
    ]);
    setStats(dashboard.stats);
    setActivities(activityList);
  };

  if (!user) {
    return (
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => <AuthScreen {...props} mode="login" onAuth={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="Signup">
            {(props) => <AuthScreen {...props} mode="signup" onAuth={setUser} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" options={{ title: "Volunteer HQ" }}>
          {(props) => (
            <DashboardScreen
              {...props}
              stats={stats}
              activities={activities}
              onRefresh={refreshDashboard}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Chat" options={{ title: "AI Coach" }}>
          {(props) => (
            <ChatScreen {...props} messages={messages} onSend={handleSendMessage} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
    gap: 16,
  },
  hero: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  link: {
    color: "#2563eb",
    textAlign: "center",
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
  },
  statLabel: {
    color: "#64748b",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  activityCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
  },
  activityTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  activityMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    textTransform: "capitalize",
  },
  chatBubble: {
    padding: 12,
    borderRadius: 16,
    alignSelf: "flex-end",
    backgroundColor: "#dbeafe",
  },
  chatBubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: "#e2e8f0",
  },
  chatInputRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chatSend: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
});

