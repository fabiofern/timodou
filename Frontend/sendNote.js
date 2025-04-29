import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useFonts } from 'expo-font';
import { DancingScript_400Regular } from '@expo-google-fonts/dancing-script';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Erreur background :', error);
        return;
    }

    if (data) {
        const { latitude, longitude } = data.locations[0].coords;

        try {
            const response = await fetch('192.168.1.167:3000/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latitude, longitude }),
            });

            const result = await response.json();

            if (result.data) {
                await AsyncStorage.setItem('message_to_display', JSON.stringify(result.data));
                console.log('📬 Nouveau message trouvé en arrière-plan');
            }
        } catch (err) {
            console.error('Erreur background fetch :', err);
        }
    }
});



export default function SendNote({ navigation }) {

    const [fontsLoaded] = useFonts({
        DancingScript_400Regular,
        Poppins_400Regular,
        GreatVibes_400Regular,
    });
    // if (!fontsLoaded) return <AppLoading />;

    const [message, setMessage] = useState('');
    const [font, setFont] = useState('serif');
    const [paper, setPaper] = useState('white');
    const [encre, setEncre] = useState('black');



    const envoyerMessage = async () => {
        if (!message) {
            alert("Ton message est vide !");
            // navigation.navigate('SendNote');
        }
        try {
            const location = await Location.getCurrentPositionAsync({});
            const messageData = {
                content: message,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                font,
                paper,
                encre,
            };

            const response = await fetch('http://192.168.1.167:3000/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData),
            });

            const result = await response.json();

            if (result.result) {
                alert('Message déposé 🕊️');
                setMessage('');
                setFont('serif');
                setPaper('white');
                setEncre('black');
            } else {
                alert('Erreur lors de l’envoi 😢');
                console.error(result.message || result.error);
            }
        } catch (err) {
            alert("Impossible d'obtenir la position 😢");
            console.error(err);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f2dcc3' }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Timodou</Text>
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

                    <View style={styles.paperbuttoncontainer}>
                        <Text style={styles.label}>Paper</Text>
                        {['#f6efe3', '#e4c397', '#f1baac'].map((color, i) => (
                            <TouchableOpacity key={i} style={[styles.fontbutton1, { backgroundColor: color }]} onPress={() => setPaper(color)} />
                        ))}
                    </View>

                    <View style={styles.fontcolorbuttoncontainer}>
                        <Text style={styles.label}>Ink     </Text>
                        {['#7c6c64', '#243840', '#4e5e4e'].map((color, i) => (
                            <TouchableOpacity key={i} style={[styles.fontbutton2, { backgroundColor: color }]} onPress={() => setEncre(color)} />
                        ))}
                    </View>

                    <View style={styles.fontbuttoncontainer}>
                        <Text style={styles.label}>Font  </Text>
                        {[
                            { name: 'DancingScript_400Regular' },
                            { name: 'Poppins_400Regular' },
                            { name: 'GreatVibes_400Regular' },
                        ].map((f, i) => (
                            <TouchableOpacity key={i} style={styles.fontbutton3} onPress={() => setFont(f.name)}>
                                <Text style={[styles.buttonText1, { fontFamily: f.name }]}>This</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.sendButton} onPress={envoyerMessage}>
                        <Text style={styles.sendButtonText}>Leave Note</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendButton}>
                        <Text style={styles.sendButtonText} onPress={() => navigation.navigate('NoteBox')}>Notes founded</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2dcc3',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
    },
    header: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 80,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'DancingScript_400Regular',
    },
    box: {
        height: 250,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    messageText: {
        fontSize: 40,
        height: '100%',
        width: '100%',
        textAlign: 'center',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    fontbutton1: {
        borderRadius: 10,
        height: 50,
        width: 50,
        marginLeft: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    fontbutton2: {
        borderRadius: 25,
        height: 50,
        width: 50,
        marginLeft: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    fontbutton3: {
        borderRadius: 25,
        height: 50,
        width: 50,
        marginLeft: 20,
    },
    buttonText1: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20,
    },
    fontbuttoncontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 80,
        paddingLeft: 20,
    },
    paperbuttoncontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 80,
        paddingLeft: 20,
    },
    fontcolorbuttoncontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 80,
        paddingLeft: 20,
    },
    label: {
        fontFamily: 'serif',
        fontSize: 20,
    },
    sendButton: {
        backgroundColor: '#f4dfc1',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 28,
        marginTop: 10,
        width: '90%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    sendButtonText: {
        color: '#333',
        fontSize: 25,
    },
});
