import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,

} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PopularEvents from "../components/home/PopularEvents";
import MiniText1 from "../components/home/MiniText1";
import Categories from "../components/home/Categories";
import SearchBar from "../components/home/SearchBar";
import ProfileLine from "../components/home/ProfileLine";
import MiniText2 from "../components/home/MiniText2";
import Cards from "../components/home/Cards";
import { useEvents } from "../hooks/useEvents";
import { useLocation } from "../hooks/useLocation";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const { latitude, longitude, errorMsg: locationError } = useLocation();
  const {
    data,
    categories,
    isLoading,
    errorMsg: eventsError,
  } = useEvents(latitude, longitude);


  const filteredEvents = data
  ? data.filter((event) => {
      // Kategori filtresi
      const categoryMatch =
        selected === 0 ||
        (event.classifications?.some(
          (cls) => cls.segment.name === categories[selected]
        ));

      // Arama filtresi
      const searchMatch =
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.description?.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    })
  : [];
  return (
    <SafeAreaView style={styles.container}>
      {data && (
        <View>
          {/* Profil ve Başlık */}

          <ProfileLine></ProfileLine>
          {/* Arama Çubuğu */}
          <SearchBar search={search} setSearch={setSearch}></SearchBar>

          {/* Kategori Kutuları */}
          <Categories
            setSelected={setSelected}
            categories={categories}
            selected={selected}
          ></Categories>
          {/* Metinler */}
          <MiniText1></MiniText1>

          {/* Kartlar */}
          <Cards
            filteredEvents={filteredEvents}
            isLoading={isLoading}
            data={data}
          ></Cards>
          <MiniText2></MiniText2>
          {/* Popular Event */}
          <PopularEvents></PopularEvents>
        </View>
      )}
    </SafeAreaView>
  );
}

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
});
