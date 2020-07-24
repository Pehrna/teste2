/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Swipeout from 'react-native-swipeout';
import {FAB, TextInput} from 'react-native-paper';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function compareId(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}

function compareUserId(a, b) {
  if (a.userId < b.userId) {
    return -1;
  }
  if (a.userId > b.userId) {
    return 1;
  }
  return 0;
}

function HomeScreen({navigation, route}) {
  const [dataHome, setDataHome] = React.useState([]);

  if (route.params === undefined) {
    if (dataHome.length === 0) {
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then((res) => res.json())
        .then((res) => {
          setDataHome(res);
        })
        .catch((err) => console.log('Fail', err));
    }
  } else {
    var {state} = route.params;
    setDataHome(state);
  }

  var projetoHomeScreen = [];
  var aux = {};
  var rowsUser = [];
  var cont = 0;
  projetoHomeScreen = dataHome;
  for (let i = 0; i < projetoHomeScreen.length; i++) {
    cont = 0;
    for (let j = 0; j < rowsUser.length; j++) {
      if (projetoHomeScreen[i].userId === rowsUser[j].numero) {
        cont = 1;
      }
    }
    if (cont === 0) {
      aux = {
        numero: projetoHomeScreen[i].userId,
        userId: 'Key:' + projetoHomeScreen[i].userId,
      };
      rowsUser.push(aux);
    }
  }

  return (
    <View style={styles.containerHome}>
      <FlatList
        data={rowsUser}
        renderItem={({item}) => (
          <View style={styles.lineHome}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Postagens', {
                  parametro: item.userId,
                  state: projetoHomeScreen,
                });
              }}>
              <Text style={styles.infoHome}>Usuario {item.numero} </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.userId}
      />
    </View>
  );
}

function Postagens({navigation, route}) {
  const {parametro} = route.params;
  const {state} = route.params;
  const [dataPostagem, setDataPostagem] = React.useState(state);

  var rowsUser = [];

  for (let i = 0; i < dataPostagem.length; i++) {
    if (JSON.stringify(dataPostagem[i].userId) === parametro.slice(4)) {
      rowsUser.push(dataPostagem[i]);
    }
  }

  return (
    <View style={styles.containerPostagem}>
      <FlatList
        data={rowsUser}
        renderItem={({item}) => (
          <Swipeout
            style={styles.swipe}
            right={[
              {
                text: 'delete',
                backgroundColor: 'red',
                color: 'white',
                onPress: () => {
                  //fetch('https://jsonplaceholder.typicode.com/posts/'+item.id, {method: 'DELETE',});
                  for (var i = 0; i < dataPostagem.length; i++) {
                    if (dataPostagem[i].id === item.id) {
                      dataPostagem.splice(i, 1);
                      setDataPostagem(dataPostagem);
                    }
                  }
                  navigation.navigate('Postagens', {
                    parametro: parametro,
                    state: dataPostagem,
                  });
                },
              },
            ]}>
            <View style={styles.linePostagens}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Editar Postagens', {item, dataPostagem});
                }}>
                <Text style={styles.infoPostagemTitulo}>{item.title}</Text>
                <Text style={styles.infoPostagem}>{item.body}</Text>
              </TouchableOpacity>
            </View>
          </Swipeout>
        )}
        keyExtractor={(item) => 'key:' + item.id}
      />

      <View style={styles.linePostagens}>
        <Text color="#2c3e50"> </Text>
      </View>

      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={() => {
          navigation.navigate('Criar Postagens', {
            parametro: parametro,
            state: state,
          });
        }}
      />
    </View>
  );
}
function EditPostagens({navigation, route}) {
  const {item} = route.params;
  const {dataPostagem} = route.params;

  const [dataEditPostagem, setDataEditPostagem] = React.useState(dataPostagem);

  var auxBody = item.body;
  var auxTitle = item.title;
  return (
    <View style={styles.containerPostagem}>
      <Text style={{color: 'white'}}>Edite o Titulo</Text>
      <TextInput
        style={styles.caixaTexto}
        defaultValue={item.title}
        onChangeText={(text) => (auxTitle = text)}
      />
      <Text style={{color: 'white'}}>Edite o post</Text>
      <TextInput
        style={styles.caixaTexto}
        defaultValue={item.body}
        onChangeText={(text) => (auxBody = text)}
      />
      <Button
        title="Save"
        onPress={() => {
          for (let i = 0; i < dataPostagem.length; i++) {
            if (dataPostagem[i].id === item.id) {
              dataPostagem[i].title = auxTitle;
              dataPostagem[i].body = auxBody;
              // fetch('https://jsonplaceholder.typicode.com/posts/' + item.id, {
              //   method: 'PUT',
              //   body: dataPostagem[i],
              //   headers: {
              //     "Content-type": "application/json; charset=UTF-8"
              //   }
              // })
              //   .then(response => response.json())
              //   .then(json => console.log(json))
            }
          }
          setDataEditPostagem(dataPostagem);
          navigation.navigate('Postagens', {dataEditPostagem});
        }}
      />
    </View>
  );
}

function CreatePostagens({navigation, route}) {
  const {parametro} = route.params;
  const {state} = route.params;
  state.sort(compareId);
  const [dataCreatePostagem, setDataCreatePostagem] = React.useState(state);

  var auxBody;
  var auxTitle;
  var auxObject;

  return (
    <View style={styles.containerPostagem}>
      <Text style={{color: 'white'}}>Escreva o Titulo</Text>
      <TextInput
        style={styles.caixaTexto}
        onChangeText={(text) => (auxTitle = text)}
      />
      <Text style={{color: 'white'}}>Escreva o post</Text>
      <TextInput
        style={styles.caixaTexto}
        onChangeText={(text) => (auxBody = text)}
      />
      <Button
        title="Save"
        onPress={() => {
          auxObject = {
            userId: parseInt(parametro.slice(4), 10),
            id: state[state.length - 1].id + 1,
            title: auxTitle,
            body: auxBody,
          };
          dataCreatePostagem.push(auxObject);
          dataCreatePostagem.sort(compareUserId);
          setDataCreatePostagem(dataCreatePostagem);
          // fetch('https://jsonplaceholder.typicode.com/posts', {
          //   method: 'POST',
          //   body: auxObject,
          //   headers: {
          //     "Content-type": "application/json; charset=UTF-8"
          //   }
          // })
          //   .then(response => response.json())
          //   .then(json => console.log(json))
          navigation.navigate('Postagens', {dataCreatePostagem});
        }}
      />
    </View>
  );
}

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Postagens" component={Postagens} />
          <Stack.Screen name="Editar Postagens" component={EditPostagens} />
          <Stack.Screen name="Criar Postagens" component={CreatePostagens} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  containerHome: {
    //width: 360,
    //height: 640,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#2c3e50',
  },
  swipe: {
    backgroundColor: '#2c3e50',
  },
  containerPostagem: {
    // width: 360,
    // height: 640,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#2c3e50',
  },
  fab: {
    position: 'absolute',
    margin: 10,
    right: 20,
    bottom: 20,
    backgroundColor: 'red',
  },
  infoHome: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    color: 'white',
    fontSize: 20,
  },
  infoPostagem: {
    //height: 'auto',
    flexDirection: 'column',
    //justifyContent: 'justify',
    color: 'white',
    fontSize: 13,
    marginLeft: 10,
  },
  infoPostagemTitulo: {
    //height: 'auto',
    flexDirection: 'column',
    //justifyContent: 'justify',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  lineHome: {
    height: 40,
    //width: 300,
    flexDirection: 'row',
    borderTopColor: '#ccc',
    borderTopWidth: 2,
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linePostagens: {
    //width: 340,
    height: 'auto',
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'justify',
  },
  caixaTexto: {
    height: 40,
    width: 200,
  },
});

export default App;
