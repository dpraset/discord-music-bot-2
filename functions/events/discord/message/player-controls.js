const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../helpers/shared.js')

if (context.params.event.content.split(' ')[0] === `${process.env.PREFIX}play`) {
  let searchString = context.params.event.content.split(' ').slice(1).join(' ').trim();
   // added this to make play add to queue
 let currentQueue = await helpers.enqueueTrack(context.params.event, searchString);
 await helpers.sendPlayerUpdate(context.params.event, null, currentQueue);
   // copy, delete, play music, then add back if bot isnt working
  if (searchString) {
    let newTrack = await helpers.play(context.params.event, searchString, true);
    await helpers.sendPlayerUpdate(context.params.event, newTrack);
  } else {
    let currentTrack = await lib.discord.voice['@0.0.1'].tracks.retrieve({
      guild_id: `${context.params.event.guild_id}`
    });
    if (!currentTrack?.paused) {
      await helpers.sendPlayerUpdate(context.params.event, currentTrack);
    } else if (currentTrack?.media_url) {
      let resumedTrackData = await lib.discord.voice['@0.0.1'].tracks.resume({
        guild_id: `${context.params.event.guild_id}`
      });
      await helpers.sendPlayerUpdate(context.params.event, resumedTrackData);
    } else {
      let nextTrack = await helpers.dequeueTrack(context.params.event);
      if (nextTrack) {
        await helpers.play(context.params.event, nextTrack.youtube_link, true);
      } else {
        return lib.discord.channels['@0.2.0'].messages.create({
          channel_id: `${context.params.event.channel_id}`,
          content: ` `,
          embeds: [{
            "type": "rich",
            "description": `No items in the current queue. Please provide a YouTube link or search term to play a track.`,
            "color": 0xaa0000
          }]
        });
      }
    }
  }
} else if (context.params.event.content === `${process.env.PREFIX}pause`) {
  let trackData = await lib.discord.voice['@0.0.1'].tracks.pause({
    guild_id: `${context.params.event.guild_id}`
  });
  await helpers.sendPlayerUpdate(context.params.event, trackData);
} else if (context.params.event.content === `${process.env.PREFIX}resume`) {
  let trackData = await lib.discord.voice['@0.0.1'].tracks.resume({
    guild_id: `${context.params.event.guild_id}`
  });
  await helpers.sendPlayerUpdate(context.params.event, trackData);
} else if (context.params.event.content === `${process.env.PREFIX}dc`) {
  let response = await lib.discord.voice['@0.0.1'].channels.disconnect({
    guild_id: `${context.params.event.guild_id}`
  });
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: ` `,
    embeds: [{
      "type": "rich",
      "description": `Disconnected from <#${process.env.RADIO_VOICE_CHANNEL}>!`,
      "color": 0xaa0000
    }]
  });
} else if (context.params.event.content === `${process.env.PREFIX}help`){
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: ` `,
    embeds: [{
      "type": "rich",
      "title": "Available commands",
      "description": [
        `\`${process.env.PREFIX}play <query>\`: Play or search for a track`,
        `\`${process.env.PREFIX}resume\` Resume a paused track or play the latest track from the queue if the player is disconnected`,
        `\`${process.env.PREFIX}pause\`: Pause the currently playing track`,
        `\`${process.env.PREFIX}dc\`: Disconnect the bot from the voice channel`,
        `\`${process.env.PREFIX}np\`: Retrieve the current track and queued tracks`,
        `\`${process.env.PREFIX}q\`: Same as ${process.env.PREFIX}np`,
        `\`${process.env.PREFIX}queue <query>\`: Add a track to the queue -- DO IF !play DOES NOT WORK --`,
        `\`${process.env.PREFIX}skip\`: Skip currently playing track and play the next track in the queue`,
        `\`${process.env.PREFIX}clear\`: Clear the current queue`,
        `\`${process.env.PREFIX}help\`: Bring up this help menu`
      ].join('\n'),
      "color": 0x00aaaa
    }]
  });
}