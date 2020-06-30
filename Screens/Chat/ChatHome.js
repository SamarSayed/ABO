import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import { calcRatio, calcWidth, calcHeight } from '../../Dimension';
import Colors from '../../assets/Colors';
import Card from '../../components/Cards/ChatCard';
import Header from '../../components/Header';
import { Avatar } from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import moment from 'moment';


export default class ChatHome extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      myId: auth().currentUser.uid,
      data: [],
    }
  }


  onChangeText = name => this.setState({ name });

  componentWillMount() {
    let { myId } = this.state
    // let anotherUserId = this.props.navigation.getParam('anotherUserId')
    database()
      .ref('/Chat')
      .on('value', snapshot => {
        let myChats = [];

        for (var key in snapshot.val()) {

          if (snapshot.val()[key].user1 == myId || snapshot.val()[key].user2 == myId) {
            let anotherUserId = snapshot.val()[key].user1 != myId ?
              snapshot.val()[key].user1 : snapshot.val()[key].user2

            let anotherUserName = ''

            database()
              .ref('/users/' + anotherUserId + '/informations')
              .on('value', snapshot1 => {
                anotherUserName = snapshot1.val().name
                anotherUserImage = snapshot1.val().image
                let mynewchat =
                {
                  image: require('../../assets/images/PP.jpeg'),

                  name: anotherUserName,

                  message:
                    snapshot.val()[key].messages != null ?
                      snapshot.val()[key].messages[snapshot.val()[key].messages.length - 1].text : 'Hey there! I am using ABO',

                  time:
                    snapshot.val()[key].messages != null ?
                      moment(snapshot.val()[key].messages[snapshot.val()[key].messages.length - 1].createdAt).fromNow() : '',

                  id: key,

                }

                console.log('User data: ', mynewchat)
                myChats.push(mynewchat)
                this.setState({ data: myChats })
              })
            // console.log('xx: ',anotherUserId)

          }

        }
        //this.setState({ data: myChats })

      });

  }


  render() {
    return (

      <SafeAreaView style={styles.container} >

        <Header title={"Chats"} navigation={this.props.navigation} />

        <View style={{ marginTop: calcHeight(10), alignItems: 'center' }} >
          {/* search by name */}
          <TextInput
            style={styles.nameInput}
            placeholder='Search by name ...'
            placeholderTextColor={Colors.theme}
            onChangeText={this.onChangeText}
            value={this.state.name}
          />

        </View>
        {/* <Card /> */}

        <FlatList
          data={this.state.data}
          renderItem={({ item }) => <Card navigation={this.props.navigation} id={item.id} name={item.name} time={item.time} message={item.message} image={item.image} />}
        />


      </SafeAreaView>

    );
  }
}


const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    backgroundColor: Colors.Graybackground,
  },

  header:
  {
    flexDirection: 'row',
    backgroundColor: Colors.Graybackground,
    alignItems: 'center',
    width: calcWidth(375),
    height: calcHeight(35),
    marginTop: calcHeight(47),

  },
  backbutton:
  {
    backgroundColor: Colors.Graybackground,
    width: calcWidth(18),
    height: calcHeight(30),
    marginLeft: calcWidth(25),
    alignItems: 'center',

  },
  backicon:
  {

    width: calcWidth(17.61),
    height: calcHeight(30),

  },
  title:
  {
    fontFamily: 'Roboto-Medium',
    fontSize: calcWidth(18),
    color: Colors.theme,
    marginLeft: calcWidth(20),

  },
  nameInput: {
    fontSize: calcWidth(14),
    fontFamily: 'Montserrat-Medium',
    color: Colors.theme,
    width: calcWidth(325),
    marginTop: calcHeight(20),
    marginBottom: calcHeight(25),
    borderColor: Colors.theme,
    borderBottomWidth: calcWidth(1),

  },

});


