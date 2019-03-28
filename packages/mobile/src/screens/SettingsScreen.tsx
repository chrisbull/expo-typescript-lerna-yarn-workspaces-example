import { ExpoConfigView } from '@expo/samples'
import React from 'react'

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  }

  render() {
    return <ExpoConfigView />
  }
}
