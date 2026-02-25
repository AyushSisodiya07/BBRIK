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
  const editProduct = route.params?.editProduct;

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // ================= PREFILL =================
  useEffect(() => {
    if (editProduct) {
      setProductName(editProduct.name || "");
      setPrice(String(editProduct.price || ""));
      setQuantity(String(editProduct.quantity || ""));
      setDescription(editProduct.description || "");

      // backward compatibility
      if (editProduct.images) setImages(editProduct.images);
      else if (editProduct.image) setImages([editProduct.image]);
    }
  }, [editProduct]);

  // ================= PICK MULTIPLE =================
  const pickImages = () => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 5 },
      (res) => {
        if (res.assets?.length) {
          const uris = res.assets.map((a) => a.uri!).filter(Boolean);
          setImages((prev) => [...prev, ...uris]);
        }
      }
    );
  };

  // ================= CAMERA =================
  const openCamera = () => {
    launchCamera({ mediaType: "photo" }, (res) => {
      if (res.assets?.length) {
        setImages((prev) => [...prev, res.assets![0].uri!]);
      }
    });
  };

  // ================= REMOVE IMAGE =================
  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((i) => i !== uri));
  };

  // ================= SAVE =================
  const saveProduct = async () => {
    if (!productName || !price || !quantity) {
      Alert.alert("Please fill all required fields");
      return;
    }

    try {
      const data = await AsyncStorage.getItem("SELLER_PRODUCTS");
      const products = data ? JSON.parse(data) : [];

      let updatedProducts = [];

      if (editProduct) {
        updatedProducts = products.map((p: any) =>
          p.id === editProduct.id
            ? {
                ...p,
                name: productName,
                price,
                quantity,
                description,
                images,
              }
            : p
        );
      } else {
        const newProduct = {
          id: Date.now().toString(),
          name: productName,
          price,
          quantity,
          description,
          images,
        };

        updatedProducts = [newProduct, ...products];
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
          keyExtractor={(item) => item}
          style={{ marginBottom: 12 }}
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

        {/* NAME */}
        <TextInput
          placeholder="Product name"
          style={styles.input}
          value={productName}
          onChangeText={setProductName}
        />

        {/* PRICE */}
        <TextInput
          placeholder="Price"
          keyboardType="number-pad"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        {/* QUANTITY */}
        <TextInput
          placeholder="Quantity"
          keyboardType="number-pad"
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
        />

        {/* DESCRIPTION */}
        <TextInput
          placeholder="Product description"
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* SAVE */}
        <TouchableOpacity style={styles.submitBtn} onPress={saveProduct}>
          <Text style={styles.submitText}>
            {editProduct ? "Update Product" : "Add Product"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", padding: 20 },

  title: { fontSize: 24, fontWeight: "900", marginBottom: 20 },

  imageBox: {
    height: 120,
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  imageText: { fontWeight: "700", color: "#6B7280" },

  cameraBtn: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  cameraText: { color: "#fff", fontWeight: "700" },

  previewWrap: {
    marginRight: 10,
  },

  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  removeBtn: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#EF4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  submitBtn: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});