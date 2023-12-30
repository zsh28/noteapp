import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import auth from '@react-native-firebase/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomePage  from './home';
import { Last } from './last';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

const Tab = createBottomTabNavigator();

export const Main = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [user, setUser] = useState<any>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const getTabBarIcon = (routeName: string) => {
    let iconName: string;

    switch (routeName) {
      case 'Home':
        iconName = 'home';
        break;
      case 'Settings/Logout':
        iconName = 'list';
        break;
      default:
        iconName = 'question-circle'; // Default icon
    }
    return <Icon name={iconName} size={24} color="red" />;
  };

  const onAuthAction = (actionType: 'login' | 'register') => {
    if (actionType === 'login') {
      auth()
        .signInWithEmailAndPassword(form.email, form.password)
        .then((userCredential) => {
          const user = userCredential.user;
          alert("user signed in successfully")
        })
        .catch((error) => {
          console.error(error.message);
          alert(error.message);
        });
    } else if (actionType === 'register') {
      auth()
        .createUserWithEmailAndPassword(form.email, form.password)
        .then(() => {
          console.log('User created');
          alert('User created');
        })
        .catch((error) => {
          console.error(error.message);
          alert(error.message);
        });
    }
  };

  if (user) {
    // User is logged in, show tabs
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => getTabBarIcon(route.name),
          })}
        >
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Settings/Logout" component={Last} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else {
    // User is not logged in, show Auth screen
    return (
      <View style={styles.container}>
        <Text h4>Note Taking App</Text>
        <Input
          placeholder="Email"
          value={form.email}
          onChangeText={(email) => setForm({ ...form, email })}
        />
        <Input
          placeholder="Password"
          secureTextEntry={true}
          value={form.password}
          onChangeText={(password) => setForm({ ...form, password })}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="LOGIN"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(111, 202, 186, 1)',
              borderRadius: 5,
            }}
            titleStyle={{ fontSize: 23 }}
            containerStyle={{
              height: 50,
              width: 100,
            }}
            onPress={() => onAuthAction('login')}
          />
          <Button
            title="REGISTER"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(111, 202, 186, 1)',
              borderRadius: 5,
              marginHorizontal: 10,
            }}
            titleStyle={{ fontSize: 23 }}
            containerStyle={{
              height: 50,
              width: 150,
              marginHorizontal: 10,
            }}
            onPress={() => onAuthAction('register')}
          />
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
