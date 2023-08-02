// authenticates you with the API standard library 
// type `await lib.` to display API autocomplete
// run content in discord message channel 
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: `CHANNEL`,
  content: ` `,
  embeds: [{
    "type": "rich",
    "title": "Available commands",
    "description": [
      `\`${process.env.PREFIX}play <query>\`: Play or search for a track`,
      `\`${process.env.PREFIX}resume\` Resume a paused track or play the latest track from the 
      queue if the player is disconnected`,
      `\`${process.env.PREFIX}pause\`: Pause the currently playing track`,
      `\`${process.env.PREFIX}dc\`: Disconnect the bot from the voice channel`,
      `\`${process.env.PREFIX}np\`: Retrieve the current track and queued tracks`,
      `\`${process.env.PREFIX}q\`: Same as ${process.env.PREFIX}nowplaying`,
      `\`${process.env.PREFIX}queue <query>\`: Add a track to the queue`,
      `\`${process.env.PREFIX}skip\`: Skip currently playing track and play the next track in the queue`,
      `\`${process.env.PREFIX}clear\`: Clear the current queue`,
      `\`${process.env.PREFIX}help\`: Bring up this help menu`
    ].join('\n'),
    "color": 0x00aaaa
  }]
});