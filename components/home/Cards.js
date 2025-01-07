import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FlatListEvents from '../home/FlatListEvents'

const Cards = ({filteredEvents , isLoading ,data}) => {
  return (
    <FlatList
  data={filteredEvents}
  horizontal={true}
  ListFooterComponent={() => (
    isLoading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#BF81CA" />
      </View>
    ) : null
  )}
 
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 15 }} // Adds space on the left and right of the list content
  initialNumToRender={5} // Number of items rendered initially
  maxToRenderPerBatch={5} // Number of items rendered per batch while scrolling
  updateCellsBatchingPeriod={50} // Time in milliseconds to update cells while scrolling
  renderItem={({ item }) => (
    <View style={{ paddingHorizontal: 10 }}>
      <FlatListEvents data={item} />
    </View>
  )}
/>
  )
}

export default Cards

const styles = StyleSheet.create({

    
  scrollContainer2: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 20,
    height: 270,
    justifyContent: "center",
    alignItems: "center",
  },
 
 


  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
  },


})