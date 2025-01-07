import { Image, TouchableOpacity, StyleSheet, Text, View, Platform, ScrollView, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import * as Calendar from "expo-calendar";
import * as Permissions from "expo-permissions";
import { getFirestore, doc, setDoc, deleteDoc, arrayUnion, arrayRemove, collection, query, getDocs, where, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
export default function EventDetail({ route }) {
  const { event, isLiked, setIsLiked } = route.params;
  const navigation = useNavigation();
  const [like, setLike] = useState(isLiked);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const db = getFirestore();
  const auth = getAuth();



  const handleTicket = async (event) => {
    try {
      const user = auth.currentUser;
      if (user) {
        if (!event.id) {
          console.error("Event ID is missing");
          return; 
        }
        const ticketsRef = collection(db, "tickets");
        await addDoc(ticketsRef, {
          uid: user.uid,
          eventId: event.id,
          eventDetails: event, 
        });
        alert("Ticket Bought Have Enjoy")
      }
    } catch (error) {
      console.error("Error adding/removing favorite:", error);
    }
  };
 
  const handleTicketPress = () => {
    handleTicket(event); 
  };







  const handleLikePress = () => {
    setLike(!like);
    setIsLiked(!like); 
    handleFavorite(event);
  };
  
  const handleFavorite = async (event) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const favoritesRef = collection(db, "favorites");
  
        if (like) {
          // Remove the event from favorites
          const favoriteDoc = query(favoritesRef, where("uid", "==", user.uid), where("eventId", "==", event.id));
          const snapshot = await getDocs(favoriteDoc);
          
          snapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
        } else {
          // Add the event to favorites
          await addDoc(favoritesRef, {
            uid: user.uid,
            eventId: event.id,
            eventDetails: event, 
          });
        }
      } else {
        alert("You need to be logged in to favorite events.");
      }
    } catch (error) {
      console.error("Error adding/removing favorite:", error);
    }
  };
  

  const requestCalendarPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CALENDAR);
    if (status !== "granted") {
      alert("Calendar permission is required to add events.");
    }
  };

  useEffect(() => {
    requestCalendarPermission();
  }, []);

  const addEventToCalendar = async () => {
    try {
      if (Platform.OS === "ios") {
        const defaultCalendarSource = await Calendar.getDefaultCalendarAsync();
        const eventDetails = {
          title: event.name,
          startDate: new Date(event.dates.start.localDate + " " + event.dates.start.localTime),
          endDate: new Date(new Date(event.dates.start.localDate + " " + event.dates.start.localTime).getTime() + 3600000), // Add 1 hour
          location: event._embedded.venues[0]?.name,
          timeZone: "GMT",
          alarms: [{ relativeOffset: -15, method: Calendar.AlarmMethod.alert }],
        };
        await Calendar.createEventAsync(defaultCalendarSource.id, eventDetails);
        alert("Event added to the calendar!");
      } else {
        alert("Calendar functionality is not supported on Android yet.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add event to calendar.");
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "white",
          height: 40,
          width: 40,
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 100,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "white",
          height: 40,
          width: 40,
          position: "absolute",
          top: 40,
          right: 20,
          zIndex: 100,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AntDesign
          onPress={handleLikePress}
          name={like ? "heart" : "hearto"}
          size={20}
          color={like ? "red" : "black"}
        />
      </View>

      <View
        style={{
          backgroundColor: "white",
          height: 40,
          width: 40,
          position: "absolute",
          top: 40,
          right: 80, 
          zIndex: 100,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color="black"
          onPress={addEventToCalendar}
        />
      </View>

      <Image
        resizeMode="cover"
        source={{ uri: event.images[0]?.url }}
        style={styles.image}
      />
      <ScrollView style={styles.container2}>
        <Text style={styles.title}>{event.name}</Text>

        <View style={styles.container3}>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={20} color="black" />
            <Text>
              {event._embedded.venues[0]?.city.name}{" , "}
              {event._embedded.venues[0]?.name}
            </Text>
          </View>

          <View style={styles.date}>
            <Fontisto name="date" size={18} color="black" />
            <Text>
              {event.dates.start.localDate} - {event.dates.start.localTime}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Map", { event: event, isLiked, setIsLiked })}
            style={styles.container4}
          >
            <View>
              <Text style={{ fontSize: 18, marginBottom: 5, color: "#BF81CA" }}>
                Konum Tarifi Al
              </Text>
              <View style={styles.imageContainer}>
                <Image
                  resizeMode="cover"
                  style={styles.image3}
                  source={require("../assets/profile.png")}
                />
                <Image
                  resizeMode="cover"
                  style={styles.image3}
                  source={require("../assets/profile.png")}
                />
                <Image
                  resizeMode="cover"
                  style={styles.image3}
                  source={require("../assets/profile.png")}
                />
                <Image
                  resizeMode="cover"
                  style={styles.image3}
                  source={require("../assets/profile.png")}
                />
              </View>
            </View>
            <Image
              height={20}
              width={20}
              resizeMode="cover"
              style={styles.image2}
              source={require("../assets/location.png")}
            />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.description}>
            {event.info ||
              event.description ||
              event.pleaseNote ||
              "No additional information provided for this event."}
          </Text>

        
          <TouchableOpacity onPress={handleTicketPress} style={styles.button}>
            <View style={styles.buttonTexts}>
              <Fontisto name="ticket" size={28} color="white" />
              <Text style={{ color: "white", fontSize: 20 }}>
                {event.priceRanges && event.priceRanges[0]
                  ? `Buy Ticket - $${event.priceRanges[0].min} - $${event.priceRanges[0].max}`
                  : "Buy Ticket - $Non Value"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
  },
  commentText: {
    fontSize: 16,
  },
  commentInput: {
    flex:1,
    width:"100%",
    height:50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  addCommentButton: {
    backgroundColor: "#BF81CA",
    borderRadius: 20,
    width:"100%",
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addCommentText: {
    
    color: "white",
    fontSize: 16,
  },
  buttonTexts: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#BF81CA",
    width: "100%",
    height: 65,
    borderRadius: 50,
    marginTop: 40,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 15,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  imageContainer: {
    flexDirection: "row",
    gap: 5,
  },
  image2: {
    height: 120,
    width: 120,
  },
  image3: {
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: "#BF81CA",
    borderRadius: 100,
  },
  container4: {
    borderWidth: 2,
    borderColor: "#BF81CA",
    height: 90,
    borderRadius: 15,
    marginTop: 10,
    padding: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  location: {
    fontSize: 15,
    marginBottom: 10,
    marginTop: 10,
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    display: "-webkit-box",
  },
  date: {
    fontSize: 15,
    marginBottom: 10,
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  container3: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  container2: {
    height: "100%",
    padding: 20,
    bottom: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
  },
  image: {
    position: "relative",
    width: "100%",
    height: "50%",
  },
});
