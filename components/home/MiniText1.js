import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const MiniText1 = () => {
  return (
   
      <View style={styles.textContainer}>
          <Text style={styles.header2}>Nearby Events</Text>
          <TouchableOpacity>
            <Text
              style={styles.minitext}
              numberOfLines={1} // Only show one line of text
              ellipsizeMode="tail" // Show an ellipsis (...) if the text overflows
            >
              See More
            </Text>
          </TouchableOpacity>
        </View>
  
  )
}

export default MiniText1

const styles = StyleSheet.create({

    minitext:{
        color:"#BF81CA"
      },
      header2: {
        fontSize: 20,
        fontWeight: "bold",
      },
      textContainer: {
        marginVertical: 20,
        justifyContent: "space-between",
        marginHorizontal: 20,
        flexDirection: "row",
        overflow: "scroll",
        alignItems: "center",
      },
})