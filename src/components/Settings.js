import React, { Component } from 'react'
import settingsFacade from '../SettingsFacade.js'

class Settings extends Component {

  constructor(props) {
      super(props);

      this.onSettingsLoaded = this.onSettingsLoaded.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.save = this.save.bind(this);

      this.state = {}
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

  handleChange(event) {
    if(event.target.type === "checkbox")
      this.setState({[event.target.name]: event.target.checked})
    else
      this.setState({[event.target.name]: event.target.value})
  }

  save() {
    settingsFacade.saveSettings(this.state);
  }
  render() {

    return (
      <div>
        <label>
          Username:
          <input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
        </label>
        <br/>

        <label>
          Pomodoro Duration:
          <input name="pomodoroDuration" type="number" value={this.state.pomodoroDuration} onChange={this.handleChange}/>
        </label>
        <br/>

        <label>
          Short Break Duration:
          <input name="shortBreakDuration" type="number" value={this.state.shortBreakDuration} onChange={this.handleChange}/>
        </label>
        <br/>


        <label>
          Long Break Duration:
          <input name="longBreakDuration" type="number" value={this.state.longBreakDuration} onChange={this.handleChange}/>
        </label>
        <br/>

        <label>
          Long Break Delay:
          <input name="longBreakDelay" type="number" value={this.state.longBreakDelay} onChange={this.handleChange}/>
        </label>
        <br/>

        <label>
          Auto Start Pomodoros:
          <input name="autoStartPomodoros" type="checkbox" checked={this.state.autoStartPomodoros} onChange={this.handleChange}/>
        </label>
        <br/>

        <label>
          Auto Start Breaks:
          <input name="autoStartBreaks" type="checkbox" checked={this.state.autoStartBreaks} onChange={this.handleChange}/>
        </label>
        <br/>
      </div>
    );
  }
}

export default Settings
