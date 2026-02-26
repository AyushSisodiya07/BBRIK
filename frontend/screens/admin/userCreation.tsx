import React, { useState, useEffect } from "react";
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
 import AsyncStorage from "@react-native-async-storage/async-storage";

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
  _id: string;
  name: string;
  phone: string;
  organization: string;
  address: string;
  role: string;
  blocked: boolean;
  loginId: string;
  password: string;
  createdAt: string;
};

type TabType = "Seller" | "Truck" | "Builder" | "Architect";

/* ---------- Component ---------- */
export default function AdminHomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("Builder");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  /* Focus states */
  const [focusName, setFocusName] = useState(false);
  const [focusPhone, setFocusPhone] = useState(false);
  const [focusOrg, setFocusOrg] = useState(false);
  const [focusAddress, setFocusAddress] = useState(false);
  const [focusSearch, setFocusSearch] = useState(false);

  /* ---------- Helpers ---------- */
  const generateLoginId = (role: string) => {
    const prefix = role.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-6);
  };

  /* ---------- Fetch Users ---------- */
  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }
      const res = await fetch("http://192.168.25.67:5000/api/admin/users" ,
        { method: "GET", headers: { "Content-Type": "application/json" ,
          Authorization: `Bearer ${token}`
        } });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } catch (err) {
      console.log("Fetch users error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------- Add user ---------- */
  const addUser = async () => {
    if (!name || !phone || !organization || !address) {
      Alert.alert("Error", "Fill all fields");
      return;
    }
    if (phone.length !== 10) {
      Alert.alert("Error", "Enter valid phone number");
      return;
    }

    const loginId = generateLoginId(activeTab);
    const password = generatePassword();

    const newUser = { name, phone, organization, address, role: activeTab, loginId, password };
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }
    try {
      const res = await fetch("http://192.168.25.67:5000/api/admin/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}`},
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, data.user]);
        Alert.alert("User Created", `Login ID: ${loginId}\nPassword: ${password}`);
        setName(""); setPhone(""); setOrganization(""); setAddress(""); setShowModal(false);
      } else {
        Alert.alert("Error", data.message || "Failed to create user");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Server not reachable");
    }
  };

  const deleteUser = async (id: string, role: string) => {
  Alert.alert("Delete User", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            Alert.alert("Error", "No token found");
            return;
          }
          const res = await fetch(
            `http://192.168.25.67:5000/api/admin/users/delete/${role}/${id}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.ok) {
            setUsers((prev) => prev.filter((u) => u._id !== id));
          }
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);
};

 const toggleBlock = async (id: string, role: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "No token found");
      return;
    }
    const res = await fetch(
      `http://192.168.25.67:5000/api/admin/users/block/${role}/${id}`,
      { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, blocked: data.blocked } : u
        )
      );
    }
  } catch (err) {
    console.log(err);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers().finally(() => setRefreshing(false));
  };

  const filteredUsers = users
    .filter((u) => u.role === activeTab)
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search));

  const totalUsers = users.length;
  const tabUsers = users.filter((u) => u.role === activeTab).length;

  const EmptyList = () => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyText}>No users found</Text>
      <Text style={styles.emptySub}>Tap + to add new {activeTab}</Text>
    </View>
  );

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.roleText}>{item.role}</Text>
        <Text style={styles.info}>📱 {item.phone}</Text>
        <Text style={styles.info}>🏢 {item.organization}</Text>
        <Text style={styles.info}>📍 {item.address}</Text>
        <Text style={styles.cred}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.rightSection}>
        <View style={[styles.statusBadge, item.blocked ? styles.blocked : styles.active]}>
          <Text style={styles.statusText}>{item.blocked ? "Blocked" : "Active"}</Text>
        </View>
        <TouchableOpacity style={styles.blockBtn} onPress={() => toggleBlock(item._id, item.role)}>
          <Text style={styles.btnText}>{item.blocked ? "Unblock" : "Block"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteUser(item._id, item.role)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.tabRow}>
          {["Builder", "Seller", "Truck", "Architect"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as TabType)} style={[styles.tabButton, activeTab === tab && styles.tabActive]}>
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statNumber}>{totalUsers}</Text><Text style={styles.statLabel}>Total Users</Text></View>
          <View style={styles.statCard}><Text style={styles.statNumber}>{tabUsers}</Text><Text style={styles.statLabel}>{activeTab}</Text></View>
        </View>
      </View>

      <TextInput placeholder={`Search ${activeTab}`} placeholderTextColor="#9CA3AF" value={search} onChangeText={setSearch} onFocus={() => setFocusSearch(true)} onBlur={() => setFocusSearch(false)} style={[styles.input, focusSearch && styles.focusedInput]} />

      <FlatList data={filteredUsers} keyExtractor={(item) => item._id} renderItem={renderUser} refreshing={refreshing} onRefresh={onRefresh} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }} ListEmptyComponent={EmptyList} />

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}><Text style={styles.fabText}>＋</Text></TouchableOpacity>

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add {activeTab}</Text>
            <TextInput placeholder="Name" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} onFocus={() => setFocusName(true)} onBlur={() => setFocusName(false)} style={[styles.input, focusName && styles.focusedInput]} />
            <TextInput placeholder="Phone Number" placeholderTextColor="#9CA3AF" value={phone} onChangeText={setPhone} keyboardType="number-pad" onFocus={() => setFocusPhone(true)} onBlur={() => setFocusPhone(false)} style={[styles.input, focusPhone && styles.focusedInput]} />
            <TextInput placeholder="Organization Name" placeholderTextColor="#9CA3AF" value={organization} onChangeText={setOrganization} onFocus={() => setFocusOrg(true)} onBlur={() => setFocusOrg(false)} style={[styles.input, focusOrg && styles.focusedInput]} />
            <TextInput placeholder="Address" placeholderTextColor="#9CA3AF" value={address} onChangeText={setAddress} onFocus={() => setFocusAddress(true)} onBlur={() => setFocusAddress(false)} style={[styles.input, focusAddress && styles.focusedInput]} />
            <TouchableOpacity style={styles.addBtn} onPress={addUser}><Text style={styles.addText}>Create User</Text></TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 22, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#000", marginBottom: 10 },
  tabRow: { flexDirection: "row", marginBottom: 12 },
  tabButton: { flex: 1, padding: 8, borderRadius: 12, backgroundColor: "#FFE78F", marginHorizontal: 4, alignItems: "center" },
  tabActive: { backgroundColor: "#E0A800" },
  tabText: { fontSize: 14, fontWeight: "600" },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statCard: { flex: 0.48, backgroundColor: "#fff", paddingVertical: 20, borderRadius: 18, alignItems: "center", elevation: 3 },
  statNumber: { fontSize: 24, fontWeight: "800", color: COLORS.primaryDark },
  statLabel: { fontSize: 12, color: COLORS.subtext, marginTop: 4 },
  input: { backgroundColor: "#FFFFFF", marginHorizontal: 15, marginTop: 10, padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: "#D1D5DB", fontSize: 15, color: COLORS.text },
  focusedInput: { borderColor: COLORS.primary, borderWidth: 2 },
  card: { backgroundColor: "#fff", marginHorizontal: 15, marginBottom: 12, padding: 16, borderRadius: 18, flexDirection: "row", alignItems: "center", elevation: 2 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.secondary, justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: "bold", color: COLORS.primaryDark },
  userName: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  roleText: { fontSize: 12, color: COLORS.primaryDark, fontWeight: "600", marginBottom: 2 },
  info: { fontSize: 13, color: COLORS.subtext },
  cred: { fontSize: 11, color: COLORS.subtext },
  rightSection: { alignItems: "flex-end" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 8 },
  active: { backgroundColor: COLORS.success },
  blocked: { backgroundColor: COLORS.danger },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  blockBtn: { backgroundColor: COLORS.warning, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginBottom: 6 },
  deleteBtn: { backgroundColor: COLORS.danger, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  btnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  fab: { position: "absolute", bottom: 90, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", elevation: 6 },
  fabText: { fontSize: 28, fontWeight: "bold", color: "#000" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 14, color: COLORS.text },
  addBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 14, alignItems: "center", marginTop: 6 },
  addText: { color: "#000", fontWeight: "700", fontSize: 16 },
  emptyBox: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  emptySub: { fontSize: 13, color: COLORS.subtext, marginTop: 4 },
});