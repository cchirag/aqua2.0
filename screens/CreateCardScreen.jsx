import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import theme from '../theme.json';
import {Picker} from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const CreateCardScreen = ({navigation}) => {
  const [cardName, setCardName] = useState('');
  const [email, setEmail] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isBlue, setIsBlue] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Sticker',
      headerRight: () =>
        submitted ? (
          <ActivityIndicator color={theme.orange} size={30}></ActivityIndicator>
        ) : (
          <Ionicons
            name="ios-add-circle"
            size={30}
            color={theme.blue}
            onPress={handleSubmit}
          />
        ),
      headerRightContainerStyle: {
        marginRight: 10,
      },
    });
  });

  const handleSubmit = async () => {
    setSubmitted(true);

    await firestore()
      .collection('cards')
      .add({
        amount: 0,
        bottlesSaved: 0,
        isBlue: isBlue,
        moneyDonated: 0,
        moneySaved: 0,
        name: cardName,
        owner: auth().currentUser.uid,
        waterConsumed: 0,
        email: email,
        line1: line1,
        line2: line2,
        city: city,
        state: state,
        country: country,
        postalCode: postalCode,
      })
      .then(() => {
        setSubmitted(false);
      })
      .then(() => {
        navigation.pop();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.pageContainer}>
      <View
        style={{
          width: '80%',
          height: 200,
          backgroundColor: isBlue ? theme.blue : theme.orange,
          borderRadius: 30,
          paddingVertical: 20,
          paddingHorizontal: 40,
          alignSelf: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,

          elevation: 10,

          marginVertical: 30,
        }}>
        <View style={styles.cardLeftSide}>
          <Text style={styles.amountText}>$0</Text>
          <View>
            <Text style={styles.nameText}>
              {cardName === '' ? 'Card Name' : cardName}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.detailTitle}>Details</Text>
      <View style={{flex: 1}}>
        <ScrollView>
          <TextInput
            style={styles.textInput}
            placeholder="Card Name"
            value={cardName}
            onChangeText={(text) => {
              setCardName(text);
            }}></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="Address: Line 1"
            value={line1}
            onChangeText={(text) => {
              setLine1(text);
            }}></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="Address: Line 2"
            value={line2}
            onChangeText={(text) => {
              setLine2(text);
            }}></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="City"
            value={city}
            onChangeText={(text) => {
              setCity(text);
            }}></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="State"
            value={state}
            onChangeText={(text) => {
              setState(text);
            }}></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="Country"
            value={country}
            onChangeText={(text) => {
              setCountry(text);
            }}></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="Postal Code"
            value={postalCode}
            onChangeText={(text) => {
              setPostalCode(text);
            }}></TextInput>
          <Picker
            selectedValue={isBlue ? 'Blue' : 'Orange'}
            style={{height: 50, width: '100%', marginHorizontal: 40}}
            onValueChange={(itemValue, itemIndex) => {
              itemValue === 'Blue' ? setIsBlue(true) : setIsBlue(false);
            }}>
            <Picker.Item label="Card color: Blue" value="Blue" />
            <Picker.Item label="Card color: Orange" value="Orange" />
          </Picker>
        </ScrollView>
      </View>
    </View>
  );
};

export default CreateCardScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  cardLeftSide: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameText: {
    color: theme.white,
    fontSize: 18,
    opacity: 0.5,
  },
  amountText: {
    fontSize: 28,
    color: theme.white,
  },
  cardIdText: {
    color: theme.white,
    fontSize: 18,
    opacity: 0.7,
  },
  detailTitle: {
    marginLeft: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c5cbd9',
  },
  textInput: {
    marginLeft: 40,
    borderBottomColor: '#c5cbd9',
    borderBottomWidth: 2,
  },
});
