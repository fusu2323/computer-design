import { Component } from 'react'
import './app.scss'
import './styles/variables.scss'
import './styles/animations.scss'

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return this.props.children
  }
}

export default App
