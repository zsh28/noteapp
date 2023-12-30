import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database'; // Import the database module

const HomePage = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [notes, setNotes] = useState<{ id: string; title: string; description: string }[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    if (user) {
      const userNotesRef = database().ref(`/notes/${user.uid}`);
      userNotesRef.on('value', (snapshot) => {
        const notesData = snapshot.val();
        if (notesData) {
          const notesArray = Object.keys(notesData).map((key) => ({
            id: key,
            ...notesData[key],
          }));
          setNotes(notesArray as { id: string; title: string; description: string }[]);
        } else {
          setNotes([]);
        }
      });
    }
  }, [user]);

  const addNote = () => {
    if (user) {
      const userNotesRef = database().ref(`/notes/${user.uid}`);
      const newNoteRef = userNotesRef.push();

      newNoteRef.set({
        title: noteTitle,
        description: noteDesc,
      });

      setNoteTitle('');
      setNoteDesc('');
    }
  };

  //get the currently logged in user email
  const userEmail = user?.email;

  return (
    <View style={styles.container}>
      <Text>Welcome {userEmail}!</Text>
      <Text h4>Your Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />

      <Text h4>Add a Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Note Title"
        value={noteTitle}
        onChangeText={(text) => setNoteTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Note Description"
        value={noteDesc}
        onChangeText={(text) => setNoteDesc(text)}
      />

      <Button
        title="Add Note"
        onPress={addNote}
        disabled={!user} // Disable the button if the user is not authenticated
      />

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    width: 300,
  },
  noteItem: {
    marginBottom: 10,
    padding: 8,
    borderColor: 'gray',
    borderWidth: 1,
    width: 300,
  },
});

export default HomePage;