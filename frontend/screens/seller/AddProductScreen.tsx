import React, { useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import {
  launchImageLibrary,
  launchCamera,
} from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddProductScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cement");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [images, setImages] = useState<string[]>([]);

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

 const submitForm = async () => {
  if (!name || !price || !stock || !unit || !description) {
    Alert.alert("Error", "Please fill all required fields");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Error", "You are not logged in");
      return;
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      unit,
      isAvailable,
      images,
    };

    const response = await fetch(
      "http://192.168.25.67:5000/api/seller/products/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Success", "Product added successfully");
      console.log(data);
    } else {
      Alert.alert("Error", data.message || "Something went wrong");
    }
  } catch (error) {
    const err =console.log(error);
    Alert.alert("Error", "Network error ");
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add Product</Text>

        {/* IMAGE SECTION */}
        <TouchableOpacity style={styles.imageBox} onPress={pickImages}>
          <Text style={styles.imageText}>Upload Product Images</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cameraBtn} onPress={openCamera}>
          <Text style={styles.cameraText}>Open Camera</Text>
        </TouchableOpacity>

        <FlatList
          horizontal
          data={images}
          keyExtractor={(item, index) => item + index}
          style={{ marginBottom: 18 }}
          renderItem={({ item }) => (
            <View style={styles.previewWrap}>
              <Image source={{ uri: item }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeImage(item)}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* PRODUCT NAME */}
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          placeholder="Enter product name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        {/* PRODUCT CATEGORY */}
        <Text style={styles.label}>Product Category *</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Cement" value="Cement" />
            <Picker.Item label="Steel" value="Steel" />
            <Picker.Item label="Bricks" value="Bricks" />
            <Picker.Item label="Sand" value="Sand" />
            <Picker.Item label="Electrical" value="Electrical" />
            <Picker.Item label="Plumbing" value="Plumbing" />
            <Picker.Item label="Tiles" value="Tiles" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* PRICE */}
        <Text style={styles.label}>Price per Product *</Text>
        <TextInput
          placeholder="Enter price"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        {/* STOCK */}
        <Text style={styles.label}>
          How many products do you have? *
        </Text>
        <TextInput
          placeholder="Enter total number of products"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          style={styles.input}
          value={stock}
          onChangeText={setStock}
        />

        {/* UNIT */}
        <Text style={styles.label}>
          What is quantity of 1 product? *
        </Text>
        <TextInput
          placeholder="Example: 1 bag = 50kg, 1 piece, 1 ton"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={unit}
          onChangeText={setUnit}
        />

        {/* DESCRIPTION */}
        <Text style={styles.label}>Product Description *</Text>
        <TextInput
          placeholder="Write product details here"
          placeholderTextColor="#9CA3AF"
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* AVAILABLE SWITCH */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Available for sale</Text>
          <Switch value={isAvailable} onValueChange={setIsAvailable} />
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={styles.submitBtn} onPress={submitForm}>
          <Text style={styles.submitText}>Add Product</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 24,
    color: "#111827",
  },

  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#374151",
    marginLeft: 4,
  },

  imageBox: {
    height: 140,
    backgroundColor: "#FFF8E1",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },

  imageText: {
    fontWeight: "800",
    color: "#B45309",
  },

  cameraBtn: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
  },

  cameraText: {
    color: "#fff",
    fontWeight: "800",
  },

  previewWrap: { marginRight: 12 },

  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },

  removeBtn: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#EF4444",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    fontSize: 15,
    color: "#111827",
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  pickerBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    marginBottom: 14,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    marginBottom: 18,
  },

  switchLabel: {
    fontWeight: "800",
    color: "#111827",
  },

  submitBtn: {
    backgroundColor: "#FACC15",
    padding: 18,
    borderRadius: 22,
    alignItems: "center",
    elevation: 5,
  },

  submitText: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 16,
  },
});