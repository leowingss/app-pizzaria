import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons'

interface ItemProps {
    data: {
        price: string | number;
        id: string;
        product_id: string;
        amount: string | number;
        name: string;
    };
    deleteItem: (item_id: string) => void
}


export function ListItem({ data, deleteItem }: ItemProps) {


    function handleDeleteItem() {
        deleteItem(data.id);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.item}>{data.amount} - {data.name}</Text>

            <TouchableOpacity onPress={handleDeleteItem}>
                <Feather name='trash' color={'#FF3F4B'} size={25} />
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#101026",
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 4,
        borderWidth: 0.3,
        borderColor: "#8a8a8a"
    },
    item: {
        color: "#fff"
    }
})