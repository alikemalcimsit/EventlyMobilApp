import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PopularEvents = () => {
  return (
    <View style={styles.popularContainer}>
        
    <Image
    resizeMode="cover"
    style={styles.popularEventImage}
    source={require("../../assets/login4.jpeg")}
  />
      <View style={styles.popularCard}> 
     <View style={styles.cont3}>
     <Text style={{fontSize:17 ,fontWeight:"bold"}}>Tribute to Didi Kempot</Text>
     <Text style={{fontSize:17 ,fontWeight:"bold" ,color:"#BF81CA"}}>$20</Text>

     </View>
     <View style={styles.cont3}>
     <Text  >Danny Coknan</Text>
     <Text>November 7 2024</Text>

     </View>
      </View>
       </View>
  )
}

export default PopularEvents

const styles = StyleSheet.create({
    cont3:{
        flexDirection:"row",
        paddingHorizontal:20,
        justifyContent:"space-between",
      },
      popularContainer:{
        justifyContent:"center",
    
        alignItems:"center",
        justifyContent:"center",
        
      },
      popularEventImage:{
        alignSelf:"center",
        width:"90%",
        margin:"auto",
        borderRadius:10,
        height:200,
        position:"relative"
      },
 
      popularCard:{
        backgroundColor:"white",
        width:"85%",
        borderRadius:10,
      justifyContent:"center",
        height:70,
        position:"absolute",
        bottom:15,
    
      },

})