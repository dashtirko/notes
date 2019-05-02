import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import Todo from './components/Todo';

export default class App extends React.Component {
  render() {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Todo />
        </View>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0C0C0',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});
