import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';

import { AuthContext } from '../../contexts/AuthContext';

export default function SignIn() {

    const { signIn, loadingAuth } = useContext(AuthContext);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleKeyboard() {
        Keyboard.dismiss();
    }

    async function handleLogin() {

        if (email === '' || password === '') return;

        await signIn({ email, password });

    }


    return (
        <TouchableWithoutFeedback onPress={handleKeyboard}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/logo.png')}
                />
                <SafeAreaView style={styles.inputContainer}>

                    <TextInput
                        placeholder='Digite seu nome'
                        style={styles.input}
                        autoCapitalize={'none'}
                        placeholderTextColor='#F0F0F0'
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        placeholder='Sua senha'
                        style={styles.input}
                        placeholderTextColor='#F0F0F0'
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        {loadingAuth ? (
                            <ActivityIndicator size={25} color='#fff' />
                        ) : (
                            <Text style={styles.buttonText}>Acessar</Text>
                        )}

                    </TouchableOpacity>

                </SafeAreaView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D1D2E',
    },
    logo: {
        marginBottom: 18
    },
    inputContainer: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 34,
        paddingHorizontal: 14,
        marginBottom: 50
    },
    input: {
        width: '95%',
        height: 40,
        backgroundColor: "#101026",
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: '#FFF'
    },
    button: {
        width: '95%',
        height: 40,
        backgroundColor: "#3FFFA3",
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101026'
    }
})