import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import helpers from './helpers/helpers'
import { AdMobBanner, AdMobInterstitial } from 'react-native-admob'

import KeepAwake from 'react-native-keep-awake';

const times = [1500, 300]
// const times = [5, 3]


var bgButton = '.5'
var interval
var currentTime = times[0] // 25 min


var Sound = require('react-native-simple-sound');
class Pom extends Component {
  constructor(props){
    super(props)
    this.state = {
      timeLeft: helpers.formatTime(times[0]),
      timeRuning : false,
      currentTime: times[0],
      counter: 0,
      pomodoros: 0,
      bgButton:'0'
    }
     KeepAwake.activate();
  }


  visualFeedback(){
    // this.pomodoro()
    // console.log(bgButton);
    var i = parseFloat(bgButton)
    var state = this.state
    state.bgButton = '.8'
    this.setState(state)
    // console.log(i);
    var anim = setInterval(()=>{
      if (i <= 0){
        state.bgButton = '0'
        this.setState(state)
        clearInterval(anim)
      }

      i -= .1
      bgButton = Math.floor(i.toString())

      state.bgButton = bgButton
      this.setState(state)
    }, 10)
  }

  playAudio(){
    Sound.enable(true)
    Sound.prepare('ring.mp3')
    Sound.play('ring.mp3')
  }

  pomodoroBreak(what){
    if (what==0){
      console.log('pomodoro');

    } else if (what == 1){
      console.log('break');

    } else if ( what == 3){
      console.log('skipper');
    } else {
      console.log("Warning!!!");
    }

  }

  toggleTimer(skip = false){
    console.log('skip is: '+ skip);
    if (skip == true){
      var state = this.state
      state.currentTime = 0
      state.counter = 0
      this.setState(state)

      // ------

      this.playAudio()
      var state = this.state
      state.timeRuning = false
      state.currentTime = times[state.counter%2]
      if (state.counter%2){
        state.pomodoros = state.pomodoros + 1
      }
      state.timeRuning != this.state.timeRuning
      this.setState(state)
      currentTime = this.state.currentTime
      return


      // ------

    }
    this.visualFeedback()

    // Toogle Time
    var state = this.state
    state.timeRuning = !this.state.timeRuning
    this.setState(state)

    if (this.state.timeRuning == false){
      return
    }



    interval = setInterval(()=>{
      if (this.state.timeRuning == false){
        clearInterval(interval)
      }
      var timeLeft = helpers.formatTime(this.state.currentTime)
      if(this.state.currentTime <0){

        // this.pomodoroBreak(state.counter)
        this.playAudio()

        var state = this.state
        if (this.state.counter == 0){
          state.counter = state.counter + 1
        } else {
          state.counter = 0
        }
                state.timeRuning = false
        state.currentTime = times[state.counter%2]
        if (state.counter%2){
          state.pomodoros = state.pomodoros + 1
        }
        state.timeRuning != this.state.timeRuning
        this.setState(state)
        currentTime = this.state.currentTime
        return
      }
      currentTime--
      this.setState({
        timeLeft: timeLeft,
        timeRuning : this.state.timeRuning,
        currentTime: currentTime
      })


    }, 1000)

  }
  render() {
    return (
      <Image source={require('./img/bg.png')} style={styles.bg}>
        <CheckList state={this.state}/>
        <MainContainer time={this.state.timeLeft} bgButton={this.state.bgButton} toggleTimer={this.toggleTimer.bind(this)}/>
        <Adds/>
      </Image>
    );
  }
}
class CheckList extends Component{
  render(){
    var pomodoros = []
    for (var i=0; i!=this.props.state.pomodoros; i++){
      pomodoros.push((<Image style={styles.checkItem} key={i}
          source={require('./img/checked_checkbox.png')}
        />))
    }

    return(
      <View style={styles.checkList}>
        {pomodoros.map((pomodoro, i)=>{return pomodoro})}
      </View>
    )
  }
}

class MainContainer extends Component{
  render(){
    return(

      <TouchableWithoutFeedback onPress={this.props.toggleTimer} onLongPress={() => this.props.toggleTimer(true)} delayLongPress={2000}>
        <View style={styles.mainContainer}>
            <View style={{borderWidth: 2,
            borderColor: '#FFF',
            alignItems:'center',
            justifyContent:'center',
            width:200,
            height:200,
            borderRadius:100,
            backgroundColor: 'rgba(255,255,255,'+this.props.bgButton+')'}}>
              <Text style={styles.timerText}>{String(this.props.time)}</Text>
           </View>
        </View>
    </TouchableWithoutFeedback>
    )
  }
}

class Adds extends Component{
  render(){
    return(
      <View style={styles.adds}>

        <AdMobBanner style={styles.adds}
          bannerSize="smartBannerPortrait"
          adUnitID="ca-app-pub-4242008009100291/1926712041"
          testDeviceID="EMULATOR"
          didFailToReceiveAdWithError={this.bannerError} />

      </View>
    )
  }
}


const styles = StyleSheet.create({
  timerContainer:{
    flex:4,
    flexDirection:'row',
  },
  checkList: {
    marginTop:25,
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems:'center'
  },
  checkItem:{
    marginLeft:5,
    },
  mainContainer: {
    flex: 8,
    justifyContent: 'center',
    borderColor:'#FFF',
    alignItems: 'center',
  },
  adds: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  time:{
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems:'center',
    justifyContent:'center',
    width:200,
    height:200,
    borderRadius:100,

  },
  timerText:{
    fontSize:50,
    color: '#fff',
    fontFamily:'TimeBurner'
  },
  bg: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'stretch',
 }
});

AppRegistry.registerComponent('pom', () => Pom);
