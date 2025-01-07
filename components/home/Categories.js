import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Categories = ({categories,setSelected,selected}) => {
  return (
    <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              style={[
                styles.categoryBox,
                selected === index && styles.selectedCategoryBox,
              ]}
              onPress={() => setSelected(index)}
              key={index}
            >
              <Text
                style={[
                  styles.categoryText,
                  selected === index && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

  )
}

export default Categories

const styles = StyleSheet.create({ scrollContainer: {
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCategoryText: {
    color: "#FFF",
  },
  selectedCategoryBox: {
    backgroundColor: "#BF81CA",
    borderColor: "#BF81CA",
  },
  categoryBox: {
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    height: 45,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    paddingVertical: 2,
  },
  categoryText: {
    paddingHorizontal: 4,
    textAlign: "center",
  },})