import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, ScrollView, StyleSheet } from 'react-native';

export default function TabLayout() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/todos/1');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTodos(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text>{JSON.stringify(todos, null, 2)}</Text>
      </ScrollView>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
});
