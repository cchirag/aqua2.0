import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardComponent from '../components/CardComponent';
import theme from '../theme.json';
import Carousel from 'react-native-snap-carousel';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GooglePay } from 'react-native-google-pay';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios'
import stripe from 'tipsi-stripe';
stripe.setOptions({
  publishableKey: 'pk_test_51H6jpPI6dlHBa6hZYjKUwxur7vfoY1fEGK3kKsV64aCyCUK1e3gPTa2hRG7CEhcxl2KPy2mJSTfsbc8nq8tMoW9n00pWpsGAQ6'
})

const MyCardsScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [token, setToken] = useState(null)
  const [confirm, setConfirm] = useState(false);
  const [renderLimit, setRenderLimit] = useState(1);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <AntDesign name="logout" size={24} color="black" onPress={() => auth().signOut()} />,
      headerRightContainerStyle: { marginRight: 10 }
    });
  },[]);

  useEffect(() => {
    var isMounted = true;
    const fetchData = async () => {
      firestore()
        .collection('cards')
        .where('owner', '==', auth().currentUser.uid)
        .onSnapshot((snapshot) => {
          setData([]);
          if (!snapshot.empty) {
            setDataLength(snapshot.size)
            snapshot.forEach((snap) => {
              if (snap.exists) {
                if (isMounted) {
                  let tempData = { ...snap.data(), cardId: snap.id };
                  setData((prevState) => [...prevState, tempData]);
                }
              }
            });
          }
        });
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [renderLimit]);

  const loader = ({ item, index }) => {
    return <ActivityIndicator color={theme.orange}></ActivityIndicator>;
  };

  const cardRenderComponent = ({ item, index }) => {
    return (
      <CardComponent
        amount={item.amount}
        name={item.name}
        cardId={item.cardId}
        isBlue={item.isBlue}></CardComponent>
    );
  };

  const addMoney = async () => {
    async function generateToken() {
      setToken(null)
      try {
        const token = await stripe.paymentRequestWithCardForm({
          // Only iOS support this options
          smsAutofillDisabled: true,
          requiredBillingAddressFields: 'full',
          prefilledInformation: {
            billingAddress: {
              name: data[currentCard].name,
              line1: data[currentCard].line1,
              line2: data[currentCard].line2,
              city: data[currentCard].city,
              state: data[currentCard].state,
              country: data[currentCard].country,
              postalCode: data[currentCard].postalCode,
              email: data[currentCard].email,
            },
          },
        });
        setToken(token)
        setConfirm(true)
      } catch (error) {
        console.log(error);
      }
    }
    generateToken();
  };

  const confirmPayment = async () => {
    console.log("confirm")
    axios({
      method: 'POST',
      url:
        'https://us-central1-aqua-95005.cloudfunctions.net/completePaymentWithStripe',
      data: {
        amount: 10,
        currency: 'usd',
        token: token,
        name: data[currentCard].name,
        line1: data[currentCard].line1,
        postalCode: data[currentCard].postalCode,
        city: data[currentCard].city,
        state: data[currentCard].state,
        country: data[currentCard].country,
      },
    })
      .then(async (response) => {
        await firestore().collection("cards").doc(data[currentCard].cardId).update({
          amount: data[currentCard].amount + 10
        })
        setToken(null);
      })
      .finally(() => {
        setToken(null);
        setConfirm(false)
      });
  }

  return (
    console.log(dataLength),
    (
      <View style={styles.container}>
        <View>
          <Carousel
            data={data}
            renderItem={data.length > 0 ? cardRenderComponent : loader}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width * 0.8}
            onSnapToItem={(index) => {
              setCurrentCard(index);
            }}
            initialScrollIndex={0}


          />
        </View>
        <Text style={styles.detailTitle}>Details</Text>
        <View style={styles.statContainer}>
          <Text style={styles.statTitle}>Money Saved</Text>
          <Text
            style={{
              fontSize: 18,
              marginRight: 25,
              color: theme.orange,
              fontWeight: 'bold',
            }}>
            ${data.length > 0 ? data.length === dataLength ? data[currentCard].moneySaved : '0': "0"}
          </Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statTitle}>Water Consumed</Text>
          <Text
            style={{
              fontSize: 18,
              marginRight: 25,
              color: theme.blue,
              fontWeight: 'bold',
            }}>
            {data.length > 0 ? data.length === dataLength ? data[currentCard].waterConsumed : '0' : "0"}L
          </Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statTitle}>Bottles Saved</Text>
          <Text
            style={{
              fontSize: 18,
              marginRight: 25,
              color: theme.orange,
              fontWeight: 'bold',
            }}>
            {data.length > 0 ? data.length === dataLength ? data[currentCard].bottlesSaved : '0' : "0"}
          </Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statTitle}>Money Donated</Text>
          <Text
            style={{
              fontSize: 18,
              marginRight: 25,
              color: theme.blue,
              fontWeight: 'bold',
            }}>
            ${data.length > 0 ? data.length === dataLength ? data[currentCard].moneyDonated : 0 : "0"}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: '90%',
            height: 60,
            backgroundColor: 'rgba(255, 111, 32, 0.2)',
            alignSelf: 'center',
            borderRadius: 20,
            justifyContent: 'center',
            marginTop: 10,
            alignItems: 'flex-end',
            paddingRight: 20,
          }}
          activeOpacity={1}
          onPress={confirm ? confirmPayment : addMoney}>
          <View style={styles.addCardButtonContent}>
            <Text style={{ marginRight: 10, fontSize: 22, color: theme.orange }}>
              {
                confirm ? "Confirm Payment" : "Add Money"
              }
            </Text>
            <MaterialIcons name="add-box" size={36} color={theme.orange} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addCardButton}
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('CreateCardScreen');
          }}>
          <View style={styles.addCardButtonContent}>
            <MaterialIcons name="add-box" size={36} color={theme.blue} />
            <Text style={{ marginLeft: 10, fontSize: 22, color: theme.blue }}>
              Add Sticker
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  );
};

export default MyCardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  pageTitle: {
    fontSize: 34,
    paddingLeft: 20,
    marginTop: 15,
  },
  addCardButton: {
    width: '90%',
    height: 60,
    backgroundColor: 'rgba(53, 63, 223, 0.2)',
    alignSelf: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
  },
  addCardButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  detailTitle: {
    marginLeft: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c5cbd9',
  },
  statContainer: {
    flexDirection: 'row',
    marginLeft: 40,
    justifyContent: 'space-between',
    borderBottomColor: '#c5cbd9',
    borderBottomWidth: 2,
    paddingBottom: 10,
    marginVertical: 15,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 24,
  },
});
