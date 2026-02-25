import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  Plus,
  User,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: any;
};

export default function SellerHomeScreen({ navigation }: Props) {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  // ================= LOAD DASHBOARD =================
  const loadDashboardData = async () => {
    try {
      const productData = await AsyncStorage.getItem("SELLER_PRODUCTS");
      const parsedProducts = productData ? JSON.parse(productData) : [];
      const validProducts = Array.isArray(parsedProducts)
        ? parsedProducts
        : [];

      setProductCount(validProducts.length);
      setProducts(validProducts);

      const orderData = await AsyncStorage.getItem("SELLER_ORDERS");
      const parsedOrders = orderData ? JSON.parse(orderData) : [];
      const validOrders = Array.isArray(parsedOrders) ? parsedOrders : [];

      setOrderCount(validOrders.length);

      const revenue = validOrders.reduce((sum: number, o: any) => {
        const price = Number(o.price || 0);
        const qty = Number(o.quantity || 0);
        return sum + price * qty;
      }, 0);

      setTotalRevenue(revenue);
    } catch (e) {
      console.log("Dashboard load error", e);
    }
  };

  // ================= TOGGLE AVAILABILITY =================
  const toggleAvailability = async (id: string) => {
    try {
      const data = await AsyncStorage.getItem("SELLER_PRODUCTS");
      const productsData = data ? JSON.parse(data) : [];

      const updated = productsData.map((p: any) =>
        p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
      );

      await AsyncStorage.setItem(
        "SELLER_PRODUCTS",
        JSON.stringify(updated)
      );

      loadDashboardData();
    } catch (e) {
      console.log("Toggle availability error", e);
    }
  };

  // ================= DELETE =================
  const deleteProduct = async (id: string) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const data = await AsyncStorage.getItem("SELLER_PRODUCTS");
          const productsData = data ? JSON.parse(data) : [];
          const updated = productsData.filter((p: any) => p.id !== id);

          await AsyncStorage.setItem(
            "SELLER_PRODUCTS",
            JSON.stringify(updated)
          );

          loadDashboardData();
        },
      },
    ]);
  };

  const editProduct = (product: any) => {
    navigation.navigate("AddProduct", { editProduct: product });
  };

  useEffect(() => {
    loadDashboardData();
    const unsubscribe = navigation.addListener("focus", loadDashboardData);
    return unsubscribe;
  }, [navigation]);

  // ================= STATS =================
  const stats = [
    { id: "1", title: "Products", value: String(productCount), icon: Package },
    { id: "2", title: "Orders", value: String(orderCount), icon: ShoppingCart },
    {
      id: "3",
      title: "Revenue",
      value: `₹ ${totalRevenue}`,
      icon: IndianRupee,
    },
  ];

  const renderStat = ({ item }: any) => {
    const Icon = item.icon;
    return (
      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Icon size={18} color="#F59E0B" />
        </View>
        <Text style={styles.statValue}>{item.value}</Text>
        <Text style={styles.statTitle}>{item.title}</Text>
      </View>
    );
  };

  // ================= UI =================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.hero}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heroTitle}>Seller Dashboard</Text>
            <Text style={styles.heroSub}>Welcome back 👋</Text>
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate("SellerProfile")}
          >
            <User size={20} color="#111" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryValue}>₹ {totalRevenue}</Text>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsWrapper}>
        <FlatList
          data={stats}
          renderItem={renderStat}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          scrollEnabled={false}
        />
      </View>

      {/* PRODUCTS */}
      <View style={styles.recentWrapper}>
        <Text style={styles.recentTitle}>Your Products</Text>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item: p }) => {
            const imageUri = p.images?.[0] || p.image || null;
            const available = p.isAvailable === true;

            return (
              <View style={styles.productCard}>
                {/* IMAGE */}
                <View style={styles.productImageWrap}>
                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.productImage}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Package size={18} color="#9CA3AF" />
                    </View>
                  )}
                </View>

                {/* INFO */}
                <View style={styles.productInfo}>
                  <Text numberOfLines={1} style={styles.productName}>
                    {p.name}
                  </Text>

                  <Text style={styles.productPrice}>₹ {p.price}</Text>

                  <Text style={styles.metaText}>
                    {p.category || "General"} • {p.unit || "pcs"}
                  </Text>

                  {/* ✅ CLICKABLE AVAILABILITY */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleAvailability(p.id)}
                    style={[
                      styles.statusBadge,
                      available
                        ? styles.availableBadge
                        : styles.outBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        available
                          ? styles.availableText
                          : styles.outText,
                      ]}
                    >
                      {available ? "Available" : "Out of Stock"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ACTIONS */}
                <View style={styles.actionColumn}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => editProduct(p)}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteProduct(p.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* BOTTOM BUTTON */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Plus size={18} color="#fff" />
          <Text style={styles.primaryText}>Add New Product</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },

  hero: {
    backgroundColor: "#071A2F",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroTitle: { fontSize: 26, fontWeight: "900", color: "#fff" },
  heroSub: { marginTop: 4, color: "#CBD5E1", fontSize: 13 },

  profileBtn: {
    backgroundColor: "#F59E0B",
    height: 42,
    width: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryCard: {
    marginTop: 20,
    backgroundColor: "#0F172A",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },

  summaryLabel: { color: "#9CA3AF", fontSize: 12 },

  summaryValue: {
    color: "#F59E0B",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },

  statsWrapper: { paddingHorizontal: 18, marginTop: 12 },

  statCard: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 3,
  },

  statIcon: {
    backgroundColor: "#FFF4D6",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  statTitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "600",
  },

  recentWrapper: {
    paddingHorizontal: 18,
    marginTop: 14,
    flex: 1,
  },

  recentTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
    color: "#111827",
  },

  productCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },

  productImageWrap: { marginRight: 12 },

  productImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },

  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  productInfo: { flex: 1 },

  productName: {
    fontWeight: "800",
    color: "#111827",
    fontSize: 15,
  },

  productPrice: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "900",
    color: "#F59E0B",
  },

  metaText: {
    marginTop: 4,
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },

  statusBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  availableBadge: { backgroundColor: "#DCFCE7" },
  outBadge: { backgroundColor: "#FEE2E2" },

  statusText: { fontSize: 11, fontWeight: "800" },
  availableText: { color: "#166534" },
  outText: { color: "#DC2626" },

  actionColumn: {
    marginLeft: 8,
    justifyContent: "space-between",
    height: 60,
  },

  editBtn: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
  },

  editText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#4F46E5",
  },

  deleteBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#DC2626",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  primaryBtn: {
    backgroundColor: "#F59E0B",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  primaryText: {
    color: "#111",
    fontWeight: "800",
    fontSize: 16,
  },
});