import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  User,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: any;
};

export default function SellerProfileScreen({ navigation }: Props) {
  const [seller, setSeller] = useState({
    name: "Seller",
    phone: "Not available",
    sellerId: "—",
  });

  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  // ================= LOAD DATA =================
  const loadData = async () => {
    try {
      // 🔹 SELLER INFO
      const sellerData = await AsyncStorage.getItem("SELLER_INFO");
      if (sellerData) {
        setSeller(JSON.parse(sellerData));
      }

      // 🔹 PRODUCTS
      const pData = await AsyncStorage.getItem("SELLER_PRODUCTS");
      const products = pData ? JSON.parse(pData) : [];
      const validProducts = Array.isArray(products) ? products : [];
      setProductCount(validProducts.length);

      // 🔹 ORDERS
      const oData = await AsyncStorage.getItem("SELLER_ORDERS");
      const orders = oData ? JSON.parse(oData) : [];
      const validOrders = Array.isArray(orders) ? orders : [];
      setOrderCount(validOrders.length);

      // 🔹 REVENUE
      const total = validOrders.reduce((sum: number, o: any) => {
        return sum + Number(o.price || 0) * Number(o.quantity || 0);
      }, 0);

      setRevenue(total);
    } catch (e) {
      console.log("Profile load error", e);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener("focus", loadData);
    return unsubscribe;
  }, [navigation]);

  // ================= UI =================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={26} color="#111" />
        </View>

        <Text style={styles.name}>{seller.name}</Text>
        <Text style={styles.phone}>{seller.phone}</Text>
        <Text style={styles.sellerId}>Seller ID: {seller.sellerId}</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <Stat icon={Package} label="Products" value={productCount} />
        <Stat icon={ShoppingCart} label="Orders" value={orderCount} />
        <Stat icon={IndianRupee} label="Revenue" value={`₹ ${revenue}`} />
      </View>

      {/* MENU */}
      <View style={styles.menu}>
        <MenuItem
          icon={User}
          title="Seller Information"
          onPress={() => navigation.navigate("SellerInfoEdit")}
        />

        <MenuItem
          icon={ShoppingCart}
          title="Order History"
          onPress={() => navigation.navigate("SellerOrders")}
        />

        <MenuItem
          icon={HelpCircle}
          title="Help & Support"
         onPress={() => navigation.navigate("HelpSupport")}
        />

        <MenuItem
          icon={LogOut}
          title="Logout"
          danger
          onPress={() => navigation.replace("Login")}
        />
      </View>
    </SafeAreaView>
  );
}

// ================= SMALL COMPONENTS =================

const Stat = ({ icon: Icon, label, value }: any) => (
  <View style={styles.statBox}>
    <View style={styles.statIcon}>
      <Icon size={18} color="#F59E0B" />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MenuItem = ({ icon: Icon, title, onPress, danger }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Icon size={18} color={danger ? "#EF4444" : "#111"} />
      <Text style={[styles.menuText, danger && { color: "#EF4444" }]}>
        {title}
      </Text>
    </View>
    <ChevronRight size={18} color="#9CA3AF" />
  </TouchableOpacity>
);

// ================= STYLES =================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB" },

  header: {
    backgroundColor: "#0F172A",
    alignItems: "center",
    paddingVertical: 24,
  },

  avatar: {
    backgroundColor: "#F59E0B",
    height: 64,
    width: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  name: { color: "#fff", fontSize: 20, fontWeight: "900" },
  phone: { color: "#CBD5E1", marginTop: 4 },
  sellerId: { color: "#94A3B8", fontSize: 12, marginTop: 2 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 18,
    paddingVertical: 16,
    elevation: 3,
  },

  statBox: { alignItems: "center" },

  statIcon: {
    backgroundColor: "#FFF4D6",
    padding: 8,
    borderRadius: 10,
    marginBottom: 6,
  },

  statValue: { fontWeight: "900", fontSize: 16 },
  statLabel: { fontSize: 12, color: "#6B7280" },

  menu: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 18,
    paddingVertical: 6,
  },

  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  menuText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
});