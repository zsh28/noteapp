import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import auth from '@react-native-firebase/auth';

export const Last = () => {
  return (
    <View>
      <Text h4>Logout</Text>
      {/* logout button to signout the user */}
      <Button
      type="outline"
      buttonStyle={{ width: 440 }}
      containerStyle={{ margin: 5 }}
      disabledStyle={{
        borderWidth: 2,
        borderColor: "#00F"
      }}
      disabledTitleStyle={{ color: "#00F" }}
      loadingProps={{ animating: true }}
      onPress={() => auth().signOut().then(() => alert('User signed out!'))}
      title="Logout"
      titleProps={{}}
      titleStyle={{ marginHorizontal: 5 }}
    />
    </View>
  );
};


