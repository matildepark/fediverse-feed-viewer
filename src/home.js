import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Redirect
} from 'react-router-dom'


export class Home extends Component {
  constructor() {
    super();
    this.keyPress = this.keyPress.bind(this);
  }
  state = {
    username: '',
    usernameSubmitted: false
  }

  keyPress(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.setState({username: e.target.value, usernameSubmitted: true});
    }
  }

  render() {
    if (this.state.usernameSubmitted === true) {
      return <Redirect to={"/" + this.state.username}/>
    }
    return (
      <Router>
      <div className="homeContainer">
      <div className="header">
      <h2>Fediverse profile viewer</h2>
      </div>
      <p>This tool grabs and displays a fediverse profile in a clean format for easy sharing.</p>
      <p>Enter a full handle on the fediverse below and press Enter to continue.</p>
      <input autofocus="true" onKeyDown={this.keyPress} type="text" placeholder="matilde@social.sunshinegardens.org"/>
      <h3>Pourquoi?</h3>
      <p>I made this as a learning experience -- but also because I personally just don't like how the Pleroma front-end displays my profile!</p> 
      <p>Since both Mastodon and Pleroma provide Atom feeds, this just programmatically works with those to display them in a different way.</p>
      <footer>See also: <a href="https://matildepark.ca">Matilde Park</a></footer>
      </div>
      </Router>
    )
  }
}

export default Home;
