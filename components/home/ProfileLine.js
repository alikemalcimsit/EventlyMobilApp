import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from '@react-navigation/native';

const ProfileLine = () => {
  const navigation = useNavigation();

  const openSidebarMenu = () => {
    navigation.openDrawer(); // Yan menüyü açma
  };

  return (
    <View style={styles.profileContainer}>
      <TouchableOpacity onPress={openSidebarMenu}>
        <FontAwesome6 name="bars" size={27} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>Evently</Text>
      <TouchableOpacity onPress={()=> navigation.navigate("Profile")}>
      <Image
      
      source={require("../../assets/profile.png")}
      style={styles.profileImage}
    />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileLine;

const styles = StyleSheet.create({
  header: {
    color: "#BF81CA",
    fontSize: 25,
    fontWeight: "bold",
  },
  profileContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 45,
  },
});
