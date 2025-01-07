import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const SearchBar = ({search, setSearch, }) => {
  return (
    <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder="🔍  Search event , concert..."
      placeholderTextColor="#CACACA"
      value={search}
      onChangeText={setSearch}
    />
  </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({ inputContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 100,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
  },})