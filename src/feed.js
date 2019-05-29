import React, { Component } from 'react'
import X2JS from 'x2js'
import ReactSafeHtml from 'react-safe-html/lib/index.js'

var components = ReactSafeHtml.components.makeElements({});
components.br = ReactSafeHtml.components.createSimpleElement('br', {
    value: true,
    placeholder: true,
    'tab-index': (index) => ['tabIndex', index],
})

const x2js = new X2JS()

class Feed extends Component {
    constructor() {
        super();
        this.state = {
            handleCheck: false,
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
                let feedJson = x2js.xml2js(request.responseText)
                console.log(feedJson)
                // We want their root domain so we can show their place on the fediverse.
                let fullUrl = feedJson.feed.author.uri;
                let hostNameRegExp = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/i;
                let hostname = fullUrl.match(hostNameRegExp);
                // Set author's data in state
                this.setState({
                    author: {
                        name: feedJson.feed.author.name,
                        avatar: feedJson.feed.logo,
                        host: hostname[0]
                    }
                })
                // Feed content
                for (let item in feedJson.feed.entry) {
                    // eslint-disable-next-line
                    if (feedJson.feed.entry[item].content == "An object was deleted") continue
                    let a = this.state.feed.slice();
                    let xmlTimetoOurTime = Date.parse(feedJson.feed.entry[item].published)
                    let postDate = new Date(xmlTimetoOurTime)
                    a[item] = {
                        content: feedJson.feed.entry[item].content.toString(),
                        date: postDate.toString(),
                        url: feedJson.feed.entry[item].link
                    };
                    this.setState({feed: a});
                }
            }
        }
        request.open("GET", "https://"+ this.hosters +"/users/"+ this.username +".atom", true);
        request.send();
    }

    componentDidMount() {
        // Fediverse uses email formatting, so we use that regex here.
        // It sets it into two groups for the RSS request and just refuses to load if you're being bad and not sending a real email/fediverse address.
        const { handle } = this.props.match.params;
        // eslint-disable-next-line
        let handleRegExp = /^((?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+")))@((?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]))$/i;
        let handleCheck = handleRegExp.test(handle);
        this.username = handle.replace(handleRegExp, "$1");
        this.hosters = handle.replace(handleRegExp, "$2");
        if (handleCheck) this.Feed()
        else {
            console.log("Bad handle: " + handleCheck);
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div className="feedContainer">
                <div className="breadCrumbs"><a href="/">Home</a> -> {this.state.author.name}@{this.state.author.host}</div>
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