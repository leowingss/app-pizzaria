import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    FlatList
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { api } from "../../services/api";
import { Feather } from '@expo/vector-icons';
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from '../../components/ListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';

type RouteDetailParams = {
    Order: {
        number: number | string;
        order_id: string;
    }
}

export type CategoryProps = {
    id: string;
    name: string;
    price: string | number;
}

type ProductProps = {
    id: string;
    name: string;
    price: string | number;
}

export type ItemProps = {
    id: string;
    product_id: string;
    name: string;
    amount: number | string;
    price: string | number;
}


type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export default function Order() {

    const routes = useRoute<OrderRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [category, setCategory] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();

    const [products, setProducts] = useState<ProductProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>()
    const [modalProductVisible, setModalProductVisible] = useState(false);

    const [amount, setAmount] = useState('1');
    const [items, setItems] = useState<ItemProps[]>([]);

    const [total, setTotal] = useState<any>();

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        async function loadInfo() {
            const response = await api.get('/category');

            setCategory(response.data);
            setCategorySelected(response.data[0]);
        }

        loadInfo();
    }, [])


    useEffect(() => {
        async function loadProducts() {
            const response = await api.get('/category/product', {
                params: {
                    category_id: categorySelected?.id
                }
            });

            setProducts(response.data);
            setProductSelected(response.data[0]);

        }

        loadProducts();
    }, [categorySelected])

    function handleDismiss() {
        Keyboard.dismiss();
    }

    async function handleCloseOrder() {
        try {
            await api.delete('/order', {
                params: {
                    order_id: routes.params?.order_id
                }
            });

            navigation.goBack();

        } catch (error) {
            console.log('Erro: ' + error);
        }
    }

    function handleChangeCategory(item: CategoryProps) {
        setCategorySelected(item);
    }

    function handleChangeProduct(item: ProductProps) {
        setProductSelected(item);
    }

    async function handleAdd() {

        const response = await api.post('/order/add', {
            order_id: routes.params?.order_id,
            product_id: productSelected?.id,
            amount: Number(amount)
        });


        let data = {
            id: response.data.id,
            product_id: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount,
            price: productSelected?.price as string | number
        }


        setItems(oldItem => [...oldItem, data]);
        setAmount('1');
        addItemTotal();

        handleDismiss();

    }

    async function handleDeleteItem(item_id: string) {
        await api.delete('/order/remove', {
            params: {
                item_id
            }
        });

        let removeItem = items.filter(item => item.id !== item_id);

        removeItemTotal(item_id);
        setItems(removeItem);
    }

    function handleFinishOrder() {
        navigation.navigate('FinishOrder', {
            number: routes.params.number,
            order_id: routes.params.order_id
        });
    }

    function addItemTotal() {
        const priceProduct = items.map(item => Number(item.amount) * Number(item.price));
        const totalProducts = priceProduct.reduce((acc, cur) => {
            return acc + cur;
        }, Number(productSelected?.price) * Number(amount));

        setTotal(totalProducts);
    }

    function removeItemTotal(item_id: string) {

        const item = items.filter(itemId => itemId.id === item_id);

        const itemPrice = item.map(price => Number(price.price) * Number(price.amount));

        setTotal(total - Number(itemPrice));
    }

    return (
        <TouchableWithoutFeedback onPress={handleDismiss}>

            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}> Mesa {routes.params?.number} </Text>
                    {items.length === 0 && (
                        <TouchableOpacity onPress={handleCloseOrder}>
                            <Feather name="trash-2" size={28} color='#ff3f4b' />
                        </TouchableOpacity>
                    )}
                </View>

                {category.length !== 0 && (
                    <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
                        <Text style={{ color: '#FFF' }}>
                            {categorySelected?.name}
                        </Text>
                    </TouchableOpacity>
                )}

                {products.length !== 0 && (
                    <TouchableOpacity style={styles.input} onPress={() => setModalProductVisible(true)}>
                        <Text style={{ color: '#FFF' }}>
                            {productSelected?.name}
                        </Text>
                        <Text style={{ color: "#FFF" }}>
                            R${productSelected?.price}
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={styles.qtdContainer}>
                    <Text style={styles.qtdText}>Quantidade</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholderTextColor={'#f0f0f0'}
                        maxLength={2}
                        style={styles.qtdInput}
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                <View style={styles.action}>
                    <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
                        disabled={items.length === 0}
                        onPress={handleFinishOrder}
                    >
                        <Text style={styles.buttonText}>Avançar</Text>
                    </TouchableOpacity>

                </View>

                {items.length !== 0 && (
                    <Text style={styles.total}>
                        Total: R$ {total}
                    </Text>
                )}

                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, marginTop: 24 }}
                    data={items}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <ListItem deleteItem={handleDeleteItem} data={item} />}
                />

                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={visible}
                >
                    <ModalPicker
                        handleCloseModal={() => setVisible(false)}
                        options={category}
                        selectedItem={handleChangeCategory}

                    />
                </Modal>

                <Modal
                    transparent={true}
                    visible={modalProductVisible}
                    animationType='slide'
                >

                    <ModalPicker
                        handleCloseModal={() => setModalProductVisible(false)}
                        options={products}
                        selectedItem={handleChangeProduct}

                    />

                </Modal>

            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D1D2E',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%'
    },
    header: {
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 24
    },
    title: {
        color: "#fff",
        fontSize: 30,
        fontWeight: 'bold',
        marginRight: 14
    },
    input: {
        backgroundColor: "#101026",
        borderRadius: 4,
        width: '100%',
        height: 40,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    qtdText: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold",
        marginRight: 10,
    },
    qtdInput: {
        backgroundColor: '#101026',
        flexGrow: 1,
        height: 40,
        borderRadius: 4,
        textAlign: 'center',
        color: "#FFF",
        fontSize: 20
    },
    action: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    buttonAdd: {
        backgroundColor: '#3fd1ff',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        height: 40,
        marginRight: 15
    },
    buttonText: {
        fontSize: 18,
        color: "#101026",
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#3fffa3',
        flexGrow: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        height: 40
    },
    total: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: "right"
    }
})