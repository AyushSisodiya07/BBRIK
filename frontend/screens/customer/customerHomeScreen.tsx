import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  ColorValue,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ShoppingBag,
  User,
  Package,
  Grid,
  Phone,
  Home,
  Search,
  Plus,
  ChevronRight,
  HardHat,
  Paintbrush,
  Hammer,
  Droplets,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { id: 1, name: "Cement", icon: <Droplets size={22} color="#2563eb" /> },
  { id: 2, name: "Bricks", icon: <Grid size={22} color="#dc2626" /> },
  { id: 3, name: "Steel", icon: <Hammer size={22} color="#4b5563" /> },
  { id: 4, name: "Tools", icon: <HardHat size={22} color="#ca8a04" /> },
  { id: 5, name: "Paint", icon: <Paintbrush size={22} color="#9333ea" /> },
];

const PRODUCTS = [
  { id: 1, name: "UltraTech Cement", price: 420, unit: "bag", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "TMT Steel Bars", price: 58000, unit: "ton", image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Red Clay Bricks", price: 8, unit: "piece", image: "https://images.unsplash.com/photo-1590069230002-70cc694bc33f?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Asian Paints White", price: 2150, unit: "20L", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400" },
];

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("home");
  const [cartCount, setCartCount] = useState(0);

  return (
    <View style={styles.mainWrapper}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Header with Top Inset Padding */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <Text style={styles.brandTitle}>BRik</Text>
          <Text style={styles.brandSubtitle}>Building Homes · Building Trust</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <ShoppingBag size={24} color="#111" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <User size={24} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#666" />
          <TextInput placeholder="Search cement, steel, tools..." style={styles.searchInput} />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Image source={{ uri: "https://images.unsplash.com/photo-1590650516494-0c8e4b4c28e9?auto=format&fit=crop&q=80&w=1200" }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTag}>Festival Offer</Text>
            <Text style={styles.bannerTitle}>Heavy Duty Steel</Text>
            <TouchableOpacity style={styles.bannerButton}><Text style={styles.bannerButtonText}>Explore Now</Text></TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions - FIXED FLEX */}
        <View style={styles.quickActionsContainer}>
          {[
            { label: "Orders", icon: <Package size={22} color="#fff" />, bg: "#f97316" },
            { label: "Categories", icon: <Grid size={22} color="#fff" />, bg: "#2563eb" },
            { label: "Support", icon: <Phone size={22} color="#fff" />, bg: "#16a34a" },
          ].map((action) => (
            <TouchableOpacity key={action.label} style={styles.quickActionCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>{action.icon}</View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity><Text style={styles.sectionLinkText}>View All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <View style={styles.categoryIcon}>{cat.icon}</View>
              <Text style={styles.categoryLabel}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid - FIXED FLEX */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Materials</Text>
        </View>
        <View style={styles.productsGrid}>
          {PRODUCTS.map((prod) => (
            <View key={prod.id} style={styles.productCard}>
              <Image source={{ uri: prod.image }} style={styles.productImage} />
              <Text style={styles.productTitle} numberOfLines={1}>{prod.name}</Text>
              <Text style={styles.productPrice}>₹{prod.price}/{prod.unit}</Text>
              <TouchableOpacity onPress={() => setCartCount(c => c + 1)} style={styles.addButton}>
                <Plus size={14} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav with Inset Padding */}
      <View style={[styles.bottomNav, { height: 65 + insets.bottom, paddingBottom: insets.bottom }]}>
        {[
          { id: "home", label: "Home", icon: (c: ColorValue | undefined) => <Home size={22} color={c} /> },
          { id: "cat", label: "Explore", icon: (c: ColorValue | undefined) => <Grid size={22} color={c} /> },
          { id: "orders", label: "Orders", icon: (c: ColorValue | undefined) => <Package size={22} color={c} /> },
          { id: "profile", label: "Profile", icon: (c: ColorValue | undefined) => <User size={22} color={c} /> },
        ].map((item) => {
          const isActive = activeTab === item.id;
          const color = isActive ? "#2563eb" : "#666";
          return (
            <TouchableOpacity key={item.id} onPress={() => setActiveTab(item.id)} style={styles.navItem}>
              {item.icon(color)}
              <Text style={[styles.navLabel, { color }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#FFD600",
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  brandTitle: { fontSize: 26, fontWeight: "900", color: "#000", letterSpacing: -1 },
  brandSubtitle: { fontSize: 11, fontWeight: "600", color: "#333" },
  headerIcons: { flexDirection: "row" },
  iconButton: { marginLeft: 15 },
  cartBadge: {
    position: "absolute", right: -6, top: -6,
    backgroundColor: "#ef4444", borderRadius: 10,
    width: 18, height: 18, justifyContent: "center", alignItems: "center",
  },
  cartBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#f3f4f6", margin: 16,
    paddingHorizontal: 15, borderRadius: 12, height: 50,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  banner: { marginHorizontal: 16, height: 160, borderRadius: 16, overflow: "hidden" },
  bannerImage: { width: "100%", height: "100%" },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)", padding: 20, justifyContent: "center" },
  bannerTag: { color: "#FFD600", fontWeight: "bold", fontSize: 12 },
  bannerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  bannerButton: { backgroundColor: "#FFD600", padding: 8, borderRadius: 6, alignSelf: "flex-start", marginTop: 10 },
  bannerButtonText: { fontWeight: "bold", fontSize: 13 },
  quickActionsContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  quickActionCard: { alignItems: "center", width: width / 4 },
  quickActionIcon: { width: 50, height: 50, borderRadius: 15, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  quickActionLabel: { fontSize: 12, fontWeight: "700", color: "#333" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", padding: 16, alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  sectionLinkText: { color: "#2563eb", fontWeight: "600" },
  categoryCard: { alignItems: "center", marginRight: 20 },
  categoryIcon: { width: 60, height: 60, backgroundColor: "#f9fafb", borderRadius: 15, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#f3f4f6" },
  categoryLabel: { fontSize: 12, marginTop: 6, fontWeight: "600" },
  productsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8 },
  productCard: { width: (width / 2) - 24, backgroundColor: "#fff", margin: 8, borderRadius: 15, padding: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
  productImage: { width: "100%", height: 110, borderRadius: 10, marginBottom: 10 },
  productTitle: { fontSize: 14, fontWeight: "700" },
  productPrice: { fontSize: 13, color: "#666", marginVertical: 4 },
  addButton: { backgroundColor: "#111", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 8, borderRadius: 10, marginTop: 4 },
  addButtonText: { color: "#fff", fontSize: 12, fontWeight: "bold", marginLeft: 4 },
  bottomNav: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", backgroundColor: "#fff",
    borderTopWidth: 1, borderTopColor: "#f3f4f6",
    elevation: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navLabel: { fontSize: 10, fontWeight: "700", marginTop: 4 },
});