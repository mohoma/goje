import '../assets/css/App.css'
import React, { Component } from 'react'
import Countdown from '../components/Countdown.js'
import Settings from '../components/Settings.js'
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import settingsFacade from '../SettingsFacade.js'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onSettingsLoaded = this.onSettingsLoaded.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = {modalIsOpen: false}
    settingsFacade.loadSettings(this.onSettingsLoaded);
  }

  onSettingsLoaded(data) {
    if(data != null) {
      this.setState({
        username: data.username,
        pomodoroDuration: data.pomodoroDuration,
        shortBreakDuration: data.shortBreakDuration,
        longBreakDuration: data.longBreakDuration,
        longBreakDelay: data.longBreakDelay,
        autoStartPomodoros: data.autoStartPomodoros,
        autoStartBreaks: data.autoStartBreaks
      });
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.child.save();
    settingsFacade.loadSettings(this.onSettingsLoaded);
  }

  render() {
    return (
      <div>
        <h1>Hello, Dear {this.state.username}!</h1>
        <Countdown settings={this.state} />
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onRequestClose={this.closeModal}
          contentLabel="Settings">
          <button onClick={this.closeModal}>Save</button>
          <Settings ref={(ref) => {this.child = ref;}}/>
        </Modal>
      </div>
    )
  }
}

export default App
