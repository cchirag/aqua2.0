import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../theme.json';

const CardComponent = (props) => {
  return (
    <View
      style={{
        width: '100%',
        height: 200,
        backgroundColor: props.isBlue ? theme.blue : theme.orange,
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

        marginVertical: 30
      }}>
      <View style={styles.cardLeftSide}>
        <Text style={styles.amountText}>${props.amount}</Text>
        <View>
          <Text style={styles.cardIdText}>{props.cardId}</Text>
          <Text style={styles.nameText}>{props.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default CardComponent;

const styles = StyleSheet.create({
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
});
