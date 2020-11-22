import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import theme from '../theme.json';
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (email.length > 0 && password.length > 0) {
      setSubmitted(true);
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
            setSubmitted(false)
        }).catch((error) => {
            setSubmitted(false)
            ToastAndroid.showWithGravity(
                error.message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
        });
    } else {
      ToastAndroid.showWithGravity(
        'Email and password is required.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <Text style={styles.pageTitle}>Sign Up</Text>
        <TextInput
          placeholder="Email"
          style={styles.textInput}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
          editable={!submitted}></TextInput>
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          editable={!submitted}></TextInput>
        <TouchableOpacity
          style={styles.authButton}
          activeOpacity={1}
          onPress={handleSubmit}
          disabled={submitted}>
          {submitted ? (
            <ActivityIndicator color={theme.white}></ActivityIndicator>
          ) : (
            <Text style={styles.authButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.questionText}>Already have an account?</Text>
        <Text
          style={styles.answerText}
          onPress={() => {
            navigation.pop();
          }}>
          Sign In
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  pageTitle: {
    fontFamily: 'Rubik',
    fontSize: 48,
    fontWeight: 'normal',
  },
  textInput: {
    width: '100%',
    borderBottomColor: '#707070',
    borderBottomWidth: 1,
    marginVertical: 30,
  },
  authButton: {
    width: '70%',
    height: 60,
    backgroundColor: theme.orange,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    marginVertical: 20,
  },
  authButtonText: {
    color: theme.white,
    fontSize: 28,
  },
  questionText: {
    alignSelf: 'center',
    fontSize: 18,
  },
  answerText: {
    alignSelf: 'center',
    fontSize: 18,
    color: theme.blue,
    fontWeight: 'bold',
  },
});
