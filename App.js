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

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function HomeScreen({navigation, route}) {
  const [dataHome, setData] = React.useState([]);

  if (route.params === undefined) {
    if (dataHome.length === 0) {
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => res.json())
        .then(res => {
          setData(res);
        })
        .catch(err => console.log('Fail', err));
    }
  } else {
    var {state} = route.params;
    setData(state);
  }

  var projetoHomeScreen = [];
  var aux = {};
  var rowsUser = [];
  var cont = 0;
  React.useEffect(() => {
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
          userId: 'Key:' + projetoHomeScreen[i].userId
        };
        rowsUser.push(aux);
      }
    }
  })

  return (
    <View style={styles.containerHome}>
      <FlatList
        data={rowsUser}
        renderItem={({item}) =>
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
        }
        keyExtractor={(item) => item.userId}
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
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  containerHome: {
    width: 360,
    height: 640,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#2c3e50',
  },
  swipe: {
    backgroundColor: '#2c3e50',
  },
  containerPostagem: {
    width: 360,
    height: 640,
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
    width: 300,
    flexDirection: 'row',
    borderTopColor: '#ccc',
    borderTopWidth: 2,
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linePostagens: {
    width: 340,
    height: 'auto',
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'justify',
  },
});

export default App;
