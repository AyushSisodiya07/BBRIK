import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  FlatList,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  launchImageLibrary,
  launchCamera,
} from "react-native-image-picker";

type Props = {
  navigation: any;
  route: any;
};

export default function AddProductScreen({ navigation, route }: Props) {
  // ✅ ALWAYS FIRST — safe optional access
  const editProduct = route?.params?.editProduct;

  // ✅ ALL HOOKS AT TOP (DO NOT MOVE)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  // ================= PREFILL (SAFE) =================
  useEffect(() => {
    if (!editProduct) return;

    setName(editProduct.name || "");
    setDescription(editProduct.description || "");
    setCategory(editProduct.category || "");
    setPrice(String(editProduct.price ?? ""));
    setStock(
      String(editProduct.stock ?? editProduct.quantity ?? "")
    );
    setUnit(editProduct.unit || "");
    setIsAvailable(
      editProduct.isAvailable !== undefined
        ? editProduct.isAvailable
        : true
    );

    if (editProduct.images) setImages(editProduct.images);
    else if (editProduct.image) setImages([editProduct.image]);
  }, [editProduct]);

  // ================= IMAGE PICK =================
  const pickImages = () => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 5 },
      (res) => {
        if (res.assets?.length) {
          const uris = res.assets
            .map((a) => a.uri)
            .filter(Boolean) as string[];
          setImages((prev) => [...prev, ...uris]);
        }
      }
    );
  };

  const openCamera = () => {
    launchCamera({ mediaType: "photo" }, (res) => {
      if (res.assets?.length) {
        const uri = res.assets[0].uri;
        if (uri) setImages((prev) => [...prev, uri]);
      }
    });
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((i) => i !== uri));
  };

  // ================= SAVE =================
  const saveProduct = async () => {
    if (!name || !price || !stock) {
      Alert.alert("Please fill required fields");
      return;
    }

    try {
      const data = await AsyncStorage.getItem("SELLER_PRODUCTS");
      const products = data ? JSON.parse(data) : [];

      const payload = {
        id: editProduct?.id || Date.now().toString(),
        name,
        description,
        category,
        price: Number(price),
        stock: Number(stock),
        quantity: Number(stock), // backward compatibility
        unit,
        isAvailable,
        images,
      };

      let updatedProducts = [];

      if (editProduct) {
        updatedProducts = products.map((p: any) =>
          p.id === editProduct.id ? payload : p
        );
      } else {
        updatedProducts = [payload, ...products];
      }

      await AsyncStorage.setItem(
        "SELLER_PRODUCTS",
        JSON.stringify(updatedProducts)
      );

      Alert.alert(
        "Success",
        editProduct ? "Product updated" : "Product added"
      );

      navigation.goBack();
    } catch (e) {
      console.log("Save error", e);
      Alert.alert("Error", "Failed to save product");
    }
  };

  // ================= UI =================
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {editProduct ? "Edit Product" : "Add Product"}
        </Text>

        {/* IMAGE PICK */}
        <TouchableOpacity style={styles.imageBox} onPress={pickImages}>
          <Text style={styles.imageText}>Upload Product Images</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cameraBtn} onPress={openCamera}>
          <Text style={styles.cameraText}>Open Camera</Text>
        </TouchableOpacity>

        {/* PREVIEW */}
        <FlatList
          horizontal
          data={images}
          keyExtractor={(item, index) => item + index}
          style={{ marginBottom: 16 }}
          renderItem={({ item }) => (
            <View style={styles.previewWrap}>
              <Image source={{ uri: item }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeImage(item)}
              >
                <Text style={{ color: "#fff", fontSize: 10 }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* FORM */}
        <TextInput
          placeholder="Product name *"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Category"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          placeholder="Price *"
          keyboardType="number-pad"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        <TextInput
          placeholder="Stock Quantity *"
          keyboardType="number-pad"
          style={styles.input}
          value={stock}
          onChangeText={setStock}
        />

        <TextInput
          placeholder="Unit (kg, pcs, litre)"
          style={styles.input}
          value={unit}
          onChangeText={setUnit}
        />

        <TextInput
          placeholder="Product description"
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* SWITCH */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Available for sale</Text>
          <Switch value={isAvailable} onValueChange={setIsAvailable} />
        </View>

        {/* SAVE */}
        <TouchableOpacity style={styles.submitBtn} onPress={saveProduct}>
          <Text style={styles.submitText}>
            {editProduct ? "Update Product" : "Add Product"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20 },

  title: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 20,
    color: "#111827",
  },

  imageBox: {
    height: 130,
    backgroundColor: "#EEF2F7",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  imageText: { fontWeight: "700", color: "#6B7280" },

  cameraBtn: {
    backgroundColor: "#111827",
    padding: 13,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },

  cameraText: { color: "#fff", fontWeight: "700" },

  previewWrap: { marginRight: 10 },

  previewImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },

  removeBtn: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#EF4444",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontWeight: "600",
  },

  textArea: {
    height: 110,
    textAlignVertical: "top",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },

  switchLabel: {
    fontWeight: "700",
    color: "#111827",
  },

  submitBtn: {
    backgroundColor: "#10B981",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    elevation: 2,
  },

  submitText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});