import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  LogBox,
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

LogBox.ignoreAllLogs(true);

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
      // PRODUCTS
      const productData = await AsyncStorage.getItem("SELLER_PRODUCTS");
      const parsedProducts = productData ? JSON.parse(productData) : [];
      const validProducts = Array.isArray(parsedProducts)
        ? parsedProducts
        : [];

      setProductCount(validProducts.length);
      setProducts(validProducts);

      // ORDERS
      const orderData = await AsyncStorage.getItem("SELLER_ORDERS");
      const parsedOrders = orderData ? JSON.parse(orderData) : [];
      const validOrders = Array.isArray(parsedOrders) ? parsedOrders : [];

      setOrderCount(validOrders.length);

      // REVENUE ONLY FROM ORDERS
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

  // ================= DELETE PRODUCT =================
  const deleteProduct = async (id: string) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const data = await AsyncStorage.getItem("SELLER_PRODUCTS");
            const productsData = data ? JSON.parse(data) : [];
            const validProducts = Array.isArray(productsData)
              ? productsData
              : [];

            const updated = validProducts.filter((p: any) => p.id !== id);

            await AsyncStorage.setItem(
              "SELLER_PRODUCTS",
              JSON.stringify(updated)
            );

            loadDashboardData();
          } catch (e) {
            console.log("Delete error", e);
          }
        },
      },
    ]);
  };

  // ================= EDIT PRODUCT =================
  const editProduct = (product: any) => {
    navigation.navigate("AddProduct", { editProduct: product });
  };

  // ================= AUTO REFRESH =================
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

      {/* RECENT PRODUCTS */}
      {products.length > 0 && (
        <View style={styles.recentWrapper}>
          <Text style={styles.recentTitle}>Recent Products</Text>

          {products.slice(0, 3).map((p) => (
            <View key={p.id} style={styles.productCard}>
              {/* IMAGE */}
              <View style={styles.productImageWrap}>
                {p.image ? (
                  <Image
                    source={{ uri: p.image }}
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

                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyText}>Qty: {p.quantity}</Text>
                </View>
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
          ))}
        </View>
      )}

      <View style={{ height: 110 }} />

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
  container: { flex: 1, backgroundColor: "#F5F7FB" },

  hero: {
    backgroundColor: "#0F172A",
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
    backgroundColor: "#111827",
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
  },

  recentTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
    color: "#111827",
  },

  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  productImageWrap: { marginRight: 12 },

  productImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },

  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  productInfo: { flex: 1 },

  productName: {
    fontWeight: "800",
    color: "#111827",
    fontSize: 14,
  },

  productPrice: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "900",
    color: "#F59E0B",
  },

  qtyBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#FFF7E6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  qtyText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#92400E",
  },

  actionColumn: {
    marginLeft: 8,
    justifyContent: "space-between",
    height: 56,
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
    backgroundColor: "#F5F7FB",
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