import React, { Component } from 'react';
import ReactSafeHtml from 'react-safe-html/lib/index.js';

var components = ReactSafeHtml.components.makeElements({});
components.br = ReactSafeHtml.components.createSimpleElement('br', {
    value: true,
    placeholder: true,
    'tab-index': (index) => ['tabIndex', index],
})


// TODO
// Add remote follow prompt
// Allow the URL to set who the user is (will likely need router)

class Feed extends Component {
    constructor() {
        super();
        this.state = {
            author: {
                name: '',
                avatar: '',
                host: ''
            },
            feed: [
                {
                 content: '',
                 date: '',
                 url: ''
                }  
            ]
        }
    }

    Feed() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                var feedJson = JSON.parse(request.responseText);
                // We want their root domain so we can show their place on the fediverse.
                let fullUrl = feedJson.feed.url;
                let hostNameRegExp = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/i;
                let hostname = fullUrl.match(hostNameRegExp);
                // Set author's data in state
                this.setState({
                    author: {
                        name: feedJson.feed.author,
                        avatar: feedJson.feed.image,
                        host: hostname
                    }
                })
                // Feed content
                for (let item in feedJson.items) {
                    let a = this.state.feed.slice();
                    a[item] = {
                        content: feedJson.items[item].content,
                        date: feedJson.items[item].pubDate,
                        url: feedJson.items[item].link
                    };
                    this.setState({feed: a});
                }
            }
        }
        request.open("GET", "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fsocial.sunshinegardens.org%2Fusers%2Fmatilde.atom&api_key=25jjeuoju8cuxc9ew3fpjqywgywvsxcu75hwy85w&count=30", true);
        request.send();
    }

    componentDidMount() {
        this.Feed();
    }

    render() {
        return (
            <div className="feedContainer">
            <div className="header">
            <img alt="avatar" src={this.state.author.avatar}/>
                <h2>{this.state.author.name}@{this.state.author.host}</h2>
            </div>
            {this.state.feed.map(post => (
                <div className="post" key={post.date.toString()}>
                    <b className="date"><a href={post.url}>{post.date}</a></b>
                    <ReactSafeHtml html={post.content} components={components}/>
                </div>
            ))}
            </div>
        )
    }
}

export default Feed;