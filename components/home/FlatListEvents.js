import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useState } from 'react'
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
const FlatListEvents = ({data}) => {

    const [isLiked, setIsLiked] = useState(false); 
    const navigation = useNavigation();

  return (
    <Pressable     onPress={() => navigation.navigate("EventDetail", { event: data, isLiked, setIsLiked })}
    style={styles.cardContainer1}>
  

           <Image
           source={{ uri: data.images[1]?.url }}
            resizeMode="cover"
             style={styles.cardImage}
           />
           <Text  numberOfLines={2} ellipsizeMode="tail" style={styles.cardText}>{data.name}</Text>
           <View style={styles.cont1}>
             <Text style={styles.cardminiText}>
               <Feather name="clock" size={20} color="black" /> {data.dates.start.localTime}
             </Text>
             <Text style={styles.cardminiText}>
               <Fontisto name="date" size={18} color="black" /> {data.dates.start.localDate}
             </Text>
           </View>
           <View style={styles.cont1}>
             <Text style={styles.cardminiText}>
               <Ionicons name="location-outline" size={20} color="black" />
               {data._embedded.venues[0].city.name}
             </Text>
             <TouchableOpacity  onPress={() => navigation.navigate("EventDetail", { event: data, isLiked, setIsLiked })}>
               <Text style={styles.cardButton}>Buy Ticket</Text>
             </TouchableOpacity>
           </View>
         </Pressable>
    
         
  )
}

export default memo(FlatListEvents)

const styles = StyleSheet.create({
    minitext: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#BF81CA",
      },
    cont1: {
        flexDirection: "row",
       
        justifyContent: "space-between",
        paddingHorizontal: 5,
        alignItems: "center",
        marginBottom: 10,
      },
    icons: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 100,
      },
      cardminiText: {
        fontSize: 12,
        marginRight: 6,
      },
      cardButton: {
        backgroundColor: "#BF81CA",
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 6,
        color: "white",
      },
      cardText: {
        textAlign: "start",
        
        fontSize: 14,
        marginBottom: 4,
        marginTop: 6,
        fontWeight: "bold",
        paddingHorizontal: 5,
        marginBottom: 5,
      },

      cardContainer1: {
        
        position: "relative",
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: "column",
        width: 240,
        height: 270,
        borderRadius: 10,
        borderColor: "#cacaca",
      },
      cardImage: {
        width: "100%",
        height: 140,
        borderRadius: 10,
        elevation: 20,
      },
})