import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
// import { GestureDetector, Gesture, PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Erreur background :', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const { latitude, longitude } = locations[0].coords;
    console.log('📍 Position détectée en arrière-plan :', latitude, longitude);
    // ➕ Tu peux ajouter une notification ici si besoin
  }
});


export default function App() {
  const [message, setMessage] = useState('');
  const [font, setFont] = useState('serif');
  const [paper, setPaper] = useState('white');
  const [encre, setEncre] = useState('black');
  const [position, setPosition] = useState({ lat: 0, long: 0 });
  const gestureRef = useRef();



  useEffect(() => {
    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

      if (status !== 'granted' || bgStatus !== 'granted') {
        alert('Permission de géolocalisation refusée 📍');
        return;
      }

      const alreadyStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (!alreadyStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 25 * 60 * 1000, // 25 minutes
          distanceInterval: 0,
          deferredUpdatesInterval: 0,
          showsBackgroundLocationIndicator: false,
          foregroundService: {
            notificationTitle: "Nalu suit ta position",
            notificationBody: "Pour te prévenir des messages près de toi ✨",
          },
        });
        console.log('🛰️ Tracking position background lancé !');
      }
    };

    startLocationTracking();
  }, []);



  const envoyerMessage = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const messageData = {
        texte: message,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        font,
        paper,
        encre,
      };
      console.log('Message envoyé 🕊️:', messageData);
      setMessage('');
      setFont('serif');
      setPaper('white');
      setEncre('black');
      alert('Message envoyé 🕊️:')
    } catch (err) {
      alert("Impossible d'obtenir la position 😢");
      console.error(err);
    }
  };




  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    // <GestureDetector gesture={panGesture}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header} >
            <Text style={styles.title}>timodou</Text>
          </View>
          <View style={styles.box}>

            <TextInput
              value={message}
              onChangeText={setMessage}
              style={[styles.messageText, { fontFamily: font, backgroundColor: paper, color: encre }]}
              multiline
              placeholder="Écris ton message ici..."
            />
          </View>


          <View style={styles.fontbuttoncontainer}>
            <Text style={{ fontFamily: font, fontSize: 20 }}>Font</Text>
            <TouchableOpacity style={styles.fontbutton} onPress={() => setFont('Georgia')}>
              <Text style={styles.buttonText1}>serif</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fontbutton} onPress={() => setFont('System')}>
              <Text style={styles.buttonText1}>System</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fontbutton} onPress={() => setFont('Helvetica')}>
              <Text style={styles.buttonText1}>Helvetica</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paperbuttoncontainer}>
            <Text style={{ fontFamily: font, fontSize: 20 }}>color</Text>
            <TouchableOpacity style={styles.fontbutton} onPress={() => setPaper('beige')}>
              <Text style={styles.buttonText1}>beige</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fontbutton} onPress={() => setPaper('pink')}>
              <Text style={styles.buttonText1}>pink</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fontbutton} onPress={() => setPaper('blue')}>
              <Text style={styles.buttonText1}>blue</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fontcolorbuttoncontainer}>
            <Text style={{ fontFamily: font, fontSize: 20 }}>encre</Text>
            <TouchableOpacity style={styles.fontbutton} onPress={() => setEncre('yellow')}>
              <Text style={styles.buttonText1}>yellow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fontbutton} onPress={() => setEncre('red')}>
              <Text style={styles.buttonText1}>red</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fontbutton} onPress={() => setEncre('green')}>
              <Text style={styles.buttonText1}>green</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={() => envoyerMessage()}>
            <Text style={styles.sendButtonText}>Déposer ✨</Text>
          </TouchableOpacity>


        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
    // </GestureDetector>

    // </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf3',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  header: {
    backgroundColor: '#FFB6C1',
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',

  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  box: {
    height: 350,
    width: '100%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,

    // marginBottom: 20,
  },
  fontbutton: {
    borderRadius: 25,
    height: 50,
    width: 50,
    backgroundColor: '#FFB6C1',
  },
  buttonText1: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FFB6C1',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  // paper: {
  //   position: 'relative',
  //   backgroundColor: 'blue',
  //   borderRadius: 12,
  //   padding: 20,
  //   width: '90%',
  //   minHeight: 200,
  // },
  fontbuttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    // marginBottom: 20,
    backgroundColor: 'blue',
    height: 80,
  },
  paperbuttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    // marginBottom: 20,
    backgroundColor: 'green',
    height: 80,
  },
  fontcolorbuttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    // marginBottom: 20,
    backgroundColor: 'yellow',
    height: 80,
  },

  messageText: {
    fontSize: 40,
    color: '#333',
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#FFB6C1',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },



  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    // opacity: 0,
  },

});
