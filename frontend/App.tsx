import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import OTPScreen from "./screens/OTPScreen";
import AdminHomeScreen from "./screens/admin/AdminHomeScreen";
import CreateUserScreen from "./screens/admin/userCreation";
import PhoneEntryScreen from "./screens/phoneEntryScreen";
import CustomerHome from "./screens/customer/customerHomeScreen";
import SellerHome from "./screens/seller/SellerHomeScreen";
import SellerProfile from "./screens/seller/SellerProfileScreen";
import AddProduct from "./screens/seller/AddProductScreen";
import sellerProduct from "./screens/seller/SellerProductsScreen";
import HelpSupport from "./screens/seller/HelpSupportScreen";




const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="CreateUser" component={CreateUserScreen} />
        <Stack.Screen name="CustomerHome" component={CustomerHome} />
        <Stack.Screen name="SellerHome" component={SellerHome} />
        <Stack.Screen name="SellerProfile" component={SellerProfile} />
        <Stack.Screen name="AddProduct" component={AddProduct} /> 
        <Stack.Screen name="SellerProducts" component={sellerProduct} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}