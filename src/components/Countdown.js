import React, { Component } from 'react'
import StateMachine  from 'javascript-state-machine'
import CountdownTimer from 'easytimer.js'

class Countdown extends Component {

  constructor(props) {
      super(props);
      this.onStart = this.onStart.bind(this);
      this.onStop = this.onStop.bind(this);
      this.state = {
        settings: null,
        total: 0,
        min: 0,
        sec: 0,
        started: false,
        longBreakDelay: 0
      }

      this.timer = new CountdownTimer();

      this.stateMachine = new StateMachine({
        init: 'start',
        transitions: [
          {name: 'startPomodoro',     from: 'start',            to: 'pomodoro'},
          {name: 'finishPomodor',     from: 'pomodoro',         to: 'pomodoroFinished'},
          {name: 'startShortBreak',   from: 'pomodoroFinished',    to: 'shortBreak'},
          {name: 'finishShortBreak',  from: 'shortBreak',       to: 'start'},
          {name: 'startLongBreak',    from: 'pomodoroFinished',    to: 'longBreak'},
          {name: 'finishLongBreak',   from: 'longBreak',        to: 'start'},
          {name: 'reset',             from: ['pomodoro', 'pomodoroFinished', 'shortBreak', 'longBreak'],  to: 'start'},
        ],
        methods: {
          onStartPomodoro:    function() { this.onPomodoroStarted();}.bind(this),
          //onFinishPomodor:   function() { this.onPomdoroFinished(); }.bind(this),
          onStartShortBreak:  function() { this.onShortBreakStarted(); }.bind(this),
          //onFinishShortBreak: function() { this.onShortBreakFinished(); }.bind(this),
          onStartLongBreak:   function() { this.onLongBreakStarted(); }.bind(this),
          //onFinishLongBreak:  function() { this.onLongBreakFinished(); }.bind(this)
        }
      });

      this.onPomdoroFinished = this.onPomdoroFinished.bind(this);
      this.onShortBreakFinished = this.onShortBreakFinished.bind(this);
      this.onLongBreakFinished = this.onLongBreakFinished.bind(this);
  }

  onPomodoroStarted() {
    this.timer.start({countdown: true, startValues: {minutes: this.state.settings.pomodoroDuration}});

    this.timer.addEventListener('secondsUpdated', () => {
      this.setState({min: this.timer.getTimeValues().minutes, sec: this.timer.getTimeValues().seconds})
    });

    this.timer.removeEventListener('targetAchieved', this.onShortBreakFinished);
    this.timer.removeEventListener('targetAchieved', this.onLongBreakFinished);
    this.timer.addEventListener('targetAchieved', this.onPomdoroFinished);
  }

  onPomdoroFinished() {
    var newLongBreakDelay = 0;
    var breakDuration = 0;
      if(this.state.longBreakDelay != 0)  {
        newLongBreakDelay = this.state.longBreakDelay - 1;
        breakDuration = this.state.settings.shortBreakDuration;
      }
      else {
          newLongBreakDelay = this.state.settings.longBreakDelay;
          breakDuration = this.state.settings.longBreakDuration;
      }
      this.setState(
        { 
          longBreakDelay: newLongBreakDelay,
          started: false,
          min: Math.floor(breakDuration),
          sec:  (breakDuration * 60) % 60
        } 
      );

      this.stateMachine.finishPomodor();
  }

  onShortBreakStarted() {
    this.timer.start({countdown: true, startValues: {minutes: this.state.settings.shortBreakDuration}});
    this.timer.removeEventListener('targetAchieved', this.onPomdoroFinished);
    this.timer.addEventListener('targetAchieved', this.onShortBreakFinished);
  }

  onShortBreakFinished() {
    this.setState(prevState => {
      return { 
        started: false,
        min: Math.floor(prevState.settings.pomodoroDuration),
        sec: (prevState.settings.pomodoroDuration * 60) % 60  
      }
    });

    this.stateMachine.finishShortBreak();

  }

  onLongBreakStarted() {
    this.timer.start({countdown: true, startValues: {minutes: this.state.settings.longBreakDuration}});
    this.timer.removeEventListener('targetAchieved', this.onPomdoroFinished);
    this.timer.addEventListener('targetAchieved', this.onLongBreakFinished);
  }

  onLongBreakFinished() {
    this.setState(prevState => {
      return { 
        started: false,
        min: Math.floor(prevState.settings.pomodoroDuration),
        sec: (prevState.settings.pomodoroDuration * 60) % 60  
      }
    });

    this.stateMachine.finishLongBreak();
  }

  componentWillUnmount() {
    this.onStop();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      settings: nextProps.settings,
      longBreakDelay: nextProps.settings.longBreakDelay,
      min: Math.floor(nextProps.settings.pomodoroDuration),
      sec:  (nextProps.settings.pomodoroDuration * 60) % 60,
      total: (nextProps.settings.pomodoroDuration * 60) - 10
    });
  }

  addLeadingZeros(value) {
    value = String(value);
    while (value.length < 2) {
      value = '0' + value;
    }
    return value;
  }

  onStart() {
    console.log(this.stateMachine.state);
    if(this.stateMachine.state === 'start') {
      this.stateMachine.startPomodoro();
    }
    else if(this.stateMachine.state === 'pomodoroFinished' && this.state.longBreakDelay != 0) {
      this.stateMachine.startShortBreak();
    }
    else if(this.stateMachine.state === 'pomodoroFinished' && this.state.longBreakDelay == 0) {
      this.stateMachine.startLongBreak();
    }
    this.setState({started: true});
  }

  onStop() {
    this.stateMachine.reset();
    this.timer.stop();
    this.setState({
      min :  Math.floor(this.state.settings.pomodoroDuration),
      sec : (this.state.settings.pomodoroDuration * 60) % 60,
      started : false
    })
  }

  render() {
    const countDown = this.state;
    return (
      <div className="Countdown">
        <span className="Countdown-col">
          <span className="Countdown-col-element">
            <strong>{this.addLeadingZeros(countDown.min)} {this.addLeadingZeros(countDown.sec)} </strong>
          </span>
        </span>

        {this.state.started === false && <button name={"startButton"} onClick={this.onStart}>Start</button> }
        {this.state.started === true && <button name={"stopButton"} onClick={this.onStop}>Stop</button> }

      </div>
    );
  }
}

export default Countdown;
