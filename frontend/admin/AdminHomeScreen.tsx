import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  Modal,
  Pressable,
} from "react-native";

/* ---------- Theme ---------- */
const COLORS = {
  primary: "#FFC107",
  primaryDark: "#E0A800",
  secondary: "#FFF8E1",
  background: "#F6F7FB",
  card: "#FFFFFF",
  text: "#111827",
  subtext: "#6B7280",
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#F59E0B",
};

/* ---------- Types ---------- */
type User = {
  id: string;
  name: string;
  phone: string;
  category: string;
  role: string;
  blocked: boolean;
  loginId: string;
  password: string;
  orders?: string[];
  createdAt: number;
};

type TabType = "Seller" | "Truck" | "Builder" | "Architect";

/* ---------- Component ---------- */
export default function AdminHomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("Architect");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [users, setUsers] = useState<User[]>([]);

  /* ---------- Helpers ---------- */
  const generateLoginId = (role: string) => {
    const prefix = role.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-6);
  };

  /* ---------- Add user ---------- */
  const addUser = () => {
    if (!name || !phone || !category) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    if (phone.length < 10) {
      Alert.alert("Invalid Phone", "Enter valid mobile number");
      return;
    }

    const loginId = generateLoginId(activeTab);
    const password = generatePassword();

    const newUser: User = {
      id: Date.now().toString(),
      name,
      phone,
      category,
      role: activeTab,
      blocked: false,
      loginId,
      password,
      orders: [],
      createdAt: Date.now(),
    };

    setUsers((prev) => [...prev, newUser]);

    Alert.alert(
      "User Created",
      `Login ID: ${loginId}\nPassword: ${password}`
    );

    setName("");
    setPhone("");
    setCategory("");
    setShowModal(false);
  };

  /* ---------- Delete ---------- */
  const deleteUser = (id: string) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setUsers((prev) => prev.filter((u) => u.id !== id)),
        },
      ]
    );
  };

  /* ---------- Block ---------- */
  const toggleBlock = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, blocked: !u.blocked } : u
      )
    );
  };

  /* ---------- Refresh ---------- */
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  /* ---------- Filter ---------- */
  const filteredUsers = users
    .filter((u) => u.role === activeTab)
    .filter((u) => {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    });

  /* ---------- Stats ---------- */
  const totalUsers = users.length;
  const tabUsers = users.filter((u) => u.role === activeTab).length;

  /* ---------- Empty ---------- */
  const EmptyList = () => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyText}>No users found</Text>
      <Text style={styles.emptySub}>
        Tap + to add new {activeTab}
      </Text>
    </View>
  );

  /* ---------- Render User ---------- */
  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.roleText}>{item.role}</Text>
        <Text style={styles.info}>📱 {item.phone}</Text>
        <Text style={styles.info}>📦 {item.category}</Text>
        <Text style={styles.info}>
          🧾 Orders: {item.orders?.length || 0}
        </Text>
        <Text style={styles.cred}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.cred}>ID: {item.loginId}</Text>
      </View>

      <View style={styles.rightSection}>
        <View
          style={[
            styles.statusBadge,
            item.blocked ? styles.blocked : styles.active,
          ]}
        >
          <Text style={styles.statusText}>
            {item.blocked ? "Blocked" : "Active"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.blockBtn}
          onPress={() => toggleBlock(item.id)}
        >
          <Text style={styles.btnText}>
            {item.blocked ? "Unblock" : "Block"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteUser(item.id)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tabUsers}</Text>
            <Text style={styles.statLabel}>{activeTab}</Text>
          </View>
        </View>
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder={`Search ${activeTab}`}
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {/* LIST */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={EmptyList}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* TABS */}
      <View style={styles.footer}>
        {(["Seller", "Truck", "Builder", "Architect"] as TabType[]).map(
          (tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && { color: COLORS.primaryDark },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add {activeTab}</Text>

            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              placeholder="Mobile Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="number-pad"
              style={styles.input}
            />

            <TextInput
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />

            <TouchableOpacity style={styles.addBtn} onPress={addUser}>
              <Text style={styles.addText}>Create User</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    padding: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000",
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statCard: {
    flex: 0.48,
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
    elevation: 3,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },

  statLabel: { fontSize: 12, color: COLORS.subtext, marginTop: 4 },

  search: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },

  userName: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  roleText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: "600",
    marginBottom: 2,
  },
  info: { fontSize: 13, color: COLORS.subtext },
  cred: { fontSize: 11, color: COLORS.subtext },

  rightSection: { alignItems: "flex-end" },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },

  active: { backgroundColor: COLORS.success },
  blocked: { backgroundColor: COLORS.danger },

  statusText: { color: "#fff", fontSize: 11, fontWeight: "600" },

  blockBtn: {
    backgroundColor: COLORS.warning,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
  },

  deleteBtn: {
    backgroundColor: COLORS.danger,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  btnText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  footer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  tab: { flex: 1, justifyContent: "center", alignItems: "center" },

  activeTab: {
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.subtext,
  },

  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  fabText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
    color: COLORS.text,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  addBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },

  addText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  emptySub: {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: 4,
  },
});