import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useEffect } from 'react';
import * as Location from 'expo-location';
import useLocationPermission from './useLocationPermission'



export default function Accueil({ navigation }) {

    useLocationPermission();



    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Timodou</Text>
            <Text style={styles.quote}>An anonymous way to tell the world... that life is beautiful.</Text>
            <Image source={require('./assets/Image.png')} style={styles.image} />


            <Text style={styles.subtitle}>Write for those who'll pass by, discover what others have sown.</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SendNote')}>
                <Text style={styles.buttonText}>Leave a note</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NoteBox')}>
                <Text style={styles.buttonText}>Notes founded</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2dcc3',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    title: {
        fontSize: 90,
        fontFamily: 'DancingScript_400Regular',

        color: '#333',
    },
    quote: {
        fontSize: 13,
        textAlign: 'center',
        color: '#777',
        fontStyle: 'italic',
        // marginTop: 10,
        fontFamily: 'serif',
        paddingHorizontal: 15,
        // marginBottom: 20,
    },
    image: {
        width: 250,
        height: 250,
        // resizeMode: 'contain',
        // marginBottom: 30,
    },


    subtitle: {
        marginTop: 50,
        fontSize: 30,
        // fontStyle: 'italic',
        textAlign: 'center',
        color: '#555',
        marginBottom: 60,
        fontFamily: 'DancingScript_400Regular',
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#f4dfc1',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 28,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#333',
        fontSize: 22,
        fontFamily: 'serif',
    },
});
