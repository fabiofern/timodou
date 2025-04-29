import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { DancingScript_400Regular } from '@expo-google-fonts/dancing-script';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import AppLoading from 'expo-app-loading';
// import { set } from 'mongoose';
import * as Location from 'expo-location';


export default function NoteBox({ navigation }) {
    const [fontsLoaded] = useFonts({
        DancingScript_400Regular,
        Poppins_400Regular,
        GreatVibes_400Regular,
    });
    if (!fontsLoaded) return <AppLoading />;

    const [notes, setNotes] = useState([]);


    useEffect(() => {
        const fetchAndStoreNearbyNotes = async () => {
            try {
                const location = await Location.getCurrentPositionAsync({});
                const response = await fetch('http://192.168.1.167:3000/messages/nearby', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }),
                });

                const result = await response.json();

                if (result.result) {
                    console.log('📬 Nearby notes found:', result.data);
                    setNotes(result.data);
                    await AsyncStorage.setItem('stored_notes', JSON.stringify(result.data)); // On sauvegarde ce qu'on trouve
                } else {
                    console.error('Erreur lors de la récupération des messages :', result.message || result.error);
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchAndStoreNearbyNotes();
    }, []);


    // const removeNote = async (index) => {
    //     const updated = [...notes];
    //     updated.splice(index, 1);
    //     setNotes(updated);
    //     await AsyncStorage.setItem('stored_notes', JSON.stringify(updated));
    // };

    const removeNote = async (id) => {
        try {
            const response = await fetch(`http://192.168.1.167:3000/messages/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.result) {
                // Mise à jour locale
                setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
                await AsyncStorage.setItem('stored_notes', JSON.stringify(notes.filter((note) => note._id !== id)));
            } else {
                console.error('Erreur suppression :', result.message || result.error);
            }
        } catch (error) {
            console.error('Erreur réseau suppression:', error);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f2dcc3' }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Notes Box 📜</Text>

                {notes.length === 0 && (
                    <Text style={styles.emptyText}>no Notes founded for now ...</Text>
                )}

                {notes.map((note, index) => (
                    <View key={index} style={[styles.noteCard, { backgroundColor: note.paper }]}>
                        <Text style={{
                            fontFamily: note.font || 'serif',
                            fontSize: 40,
                            color: note.encre || '#000',
                            textAlign: 'center',
                        }}>
                            {note.content}
                        </Text>
                        <TouchableOpacity onPress={() => removeNote(note._id)}>
                            <Text style={styles.deleteText}>🗑️ Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.returnButtonWrapper}>
                <TouchableOpacity style={styles.sendButton} onPress={() => navigation.navigate('SendNote')}>
                    <Text style={styles.sendButtonText}>⬅ Return</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#f2dcc3',
        Height: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontFamily: 'DancingScript_400Regular',
        marginBottom: 30,
        color: '#333',
    },
    emptyText: {
        fontSize: 18,
        fontStyle: 'italic',
        marginTop: 40,
        color: '#666',
    },
    noteCard: {
        width: '80%',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
    deleteText: {
        marginTop: 15,
        color: '#444',
        textAlign: 'right',
        fontSize: 16,
    },
    returnButtonWrapper: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    returnButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    returnButtonText: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'serif',
    },
    sendButton: {
        backgroundColor: '#f4dfc1',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 28,
        marginTop: 10,
        width: '80%',
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
