import React, { useState } from "react"
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { api } from "../../services/api";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {

    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [number, setNumber] = useState('');

    function handleDismiss() {
        Keyboard.dismiss();
    }


    async function openOrder() {

        if (number === '') return;

        const response = await api.post('/order', {
            table: Number(number)
        });

        handleDismiss();

        navigation.navigate('Order', {
            number: number,
            order_id: response.data.id
        });

        setNumber('');

    }

    return (
        <TouchableWithoutFeedback onPress={handleDismiss}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Novo pedido</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Número da mesa"
                    placeholderTextColor="#f0f0f0b2"
                    keyboardType="numeric"
                    value={number}
                    onChangeText={setNumber}
                    maxLength={3}
                />
                <TouchableOpacity onPress={openOrder} style={styles.button}>
                    <Text style={styles.buttonText}>Abrir mesa</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D1D2E',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: "#101026",
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        color: "#fff",
        fontSize: 22
    },
    button: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#3fffa3",
        borderRadius: 4,
        height: 40,
        marginVertical: 12
    },
    buttonText: {
        fontSize: 18,
        color: "#101026",
        fontWeight: 'bold'
    }
})