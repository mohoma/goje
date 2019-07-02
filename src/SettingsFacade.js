const electron = require('electron');
const Datastore = require('nedb')
const path = require('path');
import strings from './LocalizedStrings.js'

class SettingsFacade {

    constructor(props) {
      const userDataPath = (electron.app || electron.remote.app).getPath('userData');
      this.db = new Datastore({ filename: path.join(userDataPath, strings.appName), autoload: true });

      this.defaults =  {
        username: 'User',
        pomodoroDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakDelay: 4,
        autoStartPomodoros: false,
        autoStartBreaks: false
      }
    }

    loadSettings(callback) {
      var defaults = this.defaults;
      this.db.find({_id: strings.settingsName}, function(err, docs) {
        if(docs != null)
          callback(docs[0])
        else
          callback(defaults)
      });
    }

    saveSettings(settings) {
      var settingsToPersist = {
        _id: strings.settingsName,
        username: settings.username,
        pomodoroDuration: settings.pomodoroDuration,
        shortBreakDuration: settings.shortBreakDuration,
        longBreakDuration: settings.longBreakDuration,
        longBreakDelay: settings.longBreakDelay,
        autoStartPomodoros: settings.autoStartPomodoros,
        autoStartBreaks: settings.autoStartBreaks
      }

      this.db.update( { _id: strings.settingsName }, settingsToPersist, { upsert: true }, function (err, numReplaced, upsert) {});
    }

}
let settingsFacade = new SettingsFacade();
export default settingsFacade;
