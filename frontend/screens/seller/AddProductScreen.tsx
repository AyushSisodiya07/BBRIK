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
  Switch,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

export default function AddProductScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cement");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  // ========== Image Picker ==========
  const pickImages = () => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 5 },
      (res) => {
        if (res.assets?.length) {
          const uris = res.assets
            .map((a) => a.uri)
            .filter(Boolean) as string[];
          setImages((prev) => [...prev, ...uris]); // maintains order
        }
      }
    );
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission to take photos",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert("Permission denied", "Camera permission is required");
      return;
    }
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

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("unit", unit);
      formData.append("isAvailable", isAvailable.toString());

      images.forEach((img, index) => {
        const filename = img.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const type = match ? `image/${match[1]}` : `image`;
        formData.append("images", {
          uri: img,
          name: filename || `photo_${index}.jpg`,
          type,
        } as any);
      });

      const response = await fetch(
        "http://192.168.29.97:5000/api/seller/products/add",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
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
      console.log(error);
      Alert.alert("Error", "Network error");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TITLE WITH YELLOW BACKGROUND */}
        <View style={styles.titleBox}>
          <Text style={styles.title}>Add Product</Text>
        </View>

        {/* IMAGE SECTION */}
        <TouchableOpacity style={styles.imageBox} onPress={pickImages}>
          <Text style={styles.imageText}>Upload Product Images</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cameraBtn} onPress={openCamera}>
          <Text style={styles.cameraText}>Open Camera</Text>
        </TouchableOpacity>

        {/* DRAGGABLE IMAGE LIST */}
        <DraggableFlatList
          horizontal
          data={images}
          keyExtractor={(item, index) => item + index}
          onDragEnd={({ data }) => setImages(data)}
          renderItem={({ item, index, drag, isActive }: RenderItemParams<string>) => (
            <TouchableOpacity
              style={[styles.previewWrap, isActive && { opacity: 0.8 }]}
              onLongPress={drag} // press & hold to drag
            >
              <Image source={{ uri: item }} style={styles.previewImage} />
              <Text style={styles.imageOrder}>{index + 1}</Text>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeImage(item)}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />

        {/* INPUTS */}
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          placeholder="Enter product name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

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

        <Text style={styles.label}>Price per Product *</Text>
        <TextInput
          placeholder="Enter price"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Total Stock *</Text>
        <TextInput
          placeholder="Enter total number of products"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          style={styles.input}
          value={stock}
          onChangeText={setStock}
        />

        <Text style={styles.label}>Quantity per Unit *</Text>
        <TextInput
          placeholder="Example: 1 bag = 50kg, 1 piece, 1 ton"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={unit}
          onChangeText={setUnit}
        />

        <Text style={styles.label}>Product Description *</Text>
        <TextInput
          placeholder="Write product details here"
          placeholderTextColor="#9CA3AF"
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Available for sale</Text>
          <Switch value={isAvailable} onValueChange={setIsAvailable} />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={submitForm}>
          <Text style={styles.submitText}>Add Product</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", padding: 20 },
  titleBox: {
    backgroundColor: "#FBBF24",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#111827" },
  label: { fontWeight: "700", marginBottom: 6, color: "#374151", marginLeft: 4 },
  imageBox: {
    height: 100,
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FCD34D",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  imageText: { fontWeight: "700", color: "#B45309", fontSize: 14 },
  cameraBtn: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
  },
  cameraText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  previewWrap: { marginRight: 12, position: "relative" },
  previewImage: { width: 80, height: 80, borderRadius: 12, borderWidth: 2, borderColor: "#FBBF24" },
  imageOrder: {
    position: "absolute",
    bottom: -6,
    left: 6,
    backgroundColor: "#FBBF24",
    color: "#111827",
    fontWeight: "bold",
    paddingHorizontal: 4,
    borderRadius: 6,
    fontSize: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
  },
  textArea: { height: 120, textAlignVertical: "top" },
  pickerBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  switchLabel: { fontWeight: "700", color: "#111827" },
  submitBtn: {
    backgroundColor: "#FBBF24",
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { color: "#111827", fontWeight: "bold", fontSize: 16 },
});