import React, { Component } from "react";
import { View, Modal, ScrollView, StyleSheet, AsyncStorage, TouchableOpacity } from "react-native";
import {Portal, Button, Text, Divider, TextInput, Card, Paragraph, Headline, Colors } from "react-native-paper";
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";

let id = 0;
const generateId = () => ++id;

const evalOrNull = func => {
  try {
    return func();
  } catch (e) {
    return null;
  }
};

export class Todo extends Component {
  state = {
    todoText: "",
    todos: [], 
      modalVisible: false,
  };

  static navigationOptions = {
    title: "Note"
  };



  async componentDidMount() {
    const keys = await AsyncStorage.getAllKeys().then(keys => {
      return keys.filter(k => k.startsWith("todos:"));
    });

    const todos = await AsyncStorage.multiGet(keys).then(todos => {
      return todos.map(([_, t]) => JSON.parse(t));
    });
    id = evalOrNull(() => todos.slice(-1)[0].id + 1) || 0;

    this.setState({
      todos
    });
  }

  addTodo = () => {
    const newTodo = {
      text: this.state.todoText,
      id: generateId(), 
    };

    AsyncStorage.setItem(`todos:${newTodo.id}`, JSON.stringify(newTodo));

    this.setState({
      todos: [...this.state.todos, newTodo],
      todoText: ""
    });

    
    
  };
  
  removeMyData = (item) => {
    AsyncStorage.removeItem(`todos:${item}`)
    this.setState({
      todos: this.state.todos.filter(e=> e.id != item),
    })
    
 }
  

 
 
  render() {
    return (
      <View>
      <View>
        <TextInput 
            mode="flat"
            label="Note"
           style = {{borderColor: 'gray'}}
            onSubmitEditing={() => this.addTodo()}
            onChangeText={t => this.setState({ todoText: t })}
            value={this.state.todoText}
          />
          <Button 
          style={{backgroundColor:'#FF9800'}} mode="contained" onPress={() => this.addTodo()}>
            Add Note
          </Button>
          <Divider />
        </View> 
 
       <View>
        <ScrollView>
          {this.state.todos.map((t, i) => {
            return (
              <Card key={t.id} elevation={5}>
                <Card.Content>
                  <TouchableOpacity 
                  onLongPress ={() => this.removeMyData(t.id) }
                    onPress={() =>
                      this.props.navigation.navigate("second", { todo: t })
                    }  > 
                    <View >
                      <Paragraph>
                        {t.text}
                      </Paragraph> 
                    </View>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            );
          })}
        </ScrollView>
        </View>
  
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  
  textBox: {
    width: '100%'
  },card: {
    backgroundColor: '#C0C0C0'
  } 
});
 
  state = note ={
    isEditing: false,
    editedText: ""
  };
 
 
  class Second extends Component {
    state = {
      isEditing: false,
      editedText: ""
    };
  
    
  
    render() {
      const { todo } = this.props.navigation.state.params;
  
      return (
        <View>
          <Card>
            
            <Card.Content>
              
              {this.state.isEditing ? (
                <TextInput
                  onBlur={() => this.setState({isEditing: false})}
                  defaultValue={todo.text}
                  onChangeText={this.updateAndSave}
                />
              ) : (
                <Text onPress={() => this.setState({ isEditing: true })}>
                  {todo.text}
                </Text>
              )}

              
            </Card.Content>
          </Card>
        </View>
      );
    }
  }

Second.navigationOptions = {
  title: "Single note"
};

const Navigator = createStackNavigator(
  {
    home: {
      screen: Todo
    },
    second: {
      screen: Second
    }
  },
  {
    initialRouteKey: "home"
  }
);

export default createAppContainer(Navigator);
