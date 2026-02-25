import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SellerProductsScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);

  const loadProducts = async () => {
    const data = await AsyncStorage.getItem("SELLER_PRODUCTS");
    setProducts(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadProducts);
    return unsubscribe;
  }, [navigation]);

  const deleteProduct = async (id: string) => {
    const filtered = products.filter((p) => p.id !== id);
    setProducts(filtered);
    await AsyncStorage.setItem(
      "SELLER_PRODUCTS",
      JSON.stringify(filtered)
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹ {item.price}</Text>
        <Text style={styles.qty}>Qty: {item.quantity}</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate("AddProduct", { editData: item })
            }
          >
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() =>
              Alert.alert("Delete", "Confirm delete?", [
                { text: "Cancel" },
                { text: "Delete", onPress: () => deleteProduct(item.id) },
              ])
            }
          >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FB" }}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
    gap: 12,
  },
  image: { width: 80, height: 80, borderRadius: 12 },
  name: { fontWeight: "800", fontSize: 15 },
  price: { color: "#10B981", fontWeight: "700", marginTop: 2 },
  qty: { color: "#6B7280", marginTop: 2 },
  row: { flexDirection: "row", gap: 10, marginTop: 8 },
  editBtn: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});