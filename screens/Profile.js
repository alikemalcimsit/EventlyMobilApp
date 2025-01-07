import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth"; 
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Bildirim simgesi için ikon kütüphanesi
import profileImage from "../assets/profile.png";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [tickets, setTickets] = useState([]); // Kullanıcının aldığı biletler
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setUser({
              email: currentUser.email,
              displayName: userDoc.data().displayName || "No username set",
            });

            // Favori etkinlikleri çekmek
            const eventsRef = collection(db, "favorites");
            const q = query(eventsRef, where("uid", "==", currentUser.uid));
            const unsubscribeEvents = onSnapshot(q, (snapshot) => {
              if (!snapshot.empty) {
                const eventsList = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setFavoriteEvents(eventsList);
              } else {
                setFavoriteEvents([]);
              }
            });

            // Kullanıcının aldığı biletleri çekmek
            const ticketsRef = collection(db, "tickets");
            const ticketQuery = query(ticketsRef, where("uid", "==", currentUser.uid));
            const unsubscribeTickets = onSnapshot(ticketQuery, (snapshot) => {
              if (!snapshot.empty) {
                const ticketList = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setTickets(ticketList);
              } else {
                setTickets([]);
              }
            });

            return () => {
              unsubscribeEvents();
              unsubscribeTickets();
            };
          } else {
            console.log("No user document found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDeleteFavorite = async (eventId) => {
    try {
      await deleteDoc(doc(db, "favorites", eventId));
      setFavoriteEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting favorite event:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error during logout:", error.message);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert(
      "Notifications",
      notificationsEnabled ? "Notifications disabled." : "Notifications enabled."
    );
  };
  const handleCancelTicket = (ticketId) => {
    Alert.alert(
      "Confirm Cancellation", // Başlık
      "Are you sure you want to cancel this ticket?", // Mesaj
      [
        {
          text: "Cancel", // İptal butonu
          onPress: () => console.log("Cancel pressed"),
          style: "cancel", // İptal butonunun stili
        },
        {
          text: "Yes", // Onay butonu
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "tickets", ticketId)); // Firestore'dan bileti sil
              setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId)); // Listeden sil
            } catch (error) {
              console.error("Error canceling ticket:", error);
            }
          },
        },
      ]
    );
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventItem}>
      <Image
        source={{
          uri: item.eventDetails?.images[0]?.url || "https://example.com/default-image.png",
        }}
        style={styles.eventImage}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.eventName}>{item.eventDetails?.name}</Text>
        <Text style={styles.eventDate}>{item.eventDetails?.dates.start.localDate}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteFavorite(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTicket = ({ item }) => (
    <View style={styles.eventItem}>
      <Image
        source={{
          uri: item.eventDetails?.images[0]?.url || "https://example.com/default-image.png",
        }}
        style={styles.eventImage}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.eventName}>{item.eventDetails?.name}</Text>
        <Text style={styles.eventDate}>{item.eventDetails?.dates.start.localDate}</Text>
      </View>
  
      {/* Bilet iptal butonu */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => handleCancelTicket(item.id)}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          <Image source={profileImage} style={styles.profileImage} />
          <Text style={styles.username}>{user.displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleNotifications} style={styles.notificationIcon}>
              <Ionicons
                name={notificationsEnabled ? "notifications" : "notifications-off"}
                size={25}
                color={notificationsEnabled ? "green" : "red"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.favoriteEventsTitle}>Favorite Events:</Text>
          <FlatList
            data={favoriteEvents}
            renderItem={renderEvent}
            keyExtractor={(item) => item.id}
            style={styles.eventsList}
          />

          <Text style={styles.favoriteEventsTitle}>Your Tickets:</Text>
          <FlatList
            data={tickets}
            renderItem={renderTicket}
            keyExtractor={(item) => item.id}
            style={styles.eventsList}
          />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: "#FF6D7A", // Kırmızı bir arka plan rengi
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
    ticketItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  ticketName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ticketDate: {
    fontSize: 14,
    color: "#555",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    position: "absolute",
    top: 40,
    zIndex: 100,
  },
  backButton: {
    backgroundColor: "#BF81CA",
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
  
   

    justifyContent: "center",
    alignItems: "center",
  },
  
 

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#555",
  },
 
  favoriteEventsTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventsList: {
    width: "100%",
    height:"60%"
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "#BF81CA",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#BF81CA",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
