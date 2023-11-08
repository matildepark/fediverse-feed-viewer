**Notice:** This was my first personal project in React. It still works, but only really for Mastodon and Pleroma / Akkoma instances. There is no logic for Misskey accounts, nor GoToSocial or Honk or whatever. This is because unlike instance software, which would use Webfinger to find the actor, this project parsed RSS feeds very rigidly, and only Pleroma attempted to maintain Mastodon compatibility.

A [fediverse](https://joinmastodon.org) feed viewer made in React.

Grabs your social media feed from the fediverse and parses it into a friendly page using your full handle (eg. matilde@social.sunshinegardens.org).

## Running the project for development

It's as easy as:

`npm run start`
