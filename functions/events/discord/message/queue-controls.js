const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../helpers/shared.js');

if (
  context.params.event.content === `${process.env.PREFIX}q` ||
  context.params.event.content === `${process.env.PREFIX}np`
) {
  let currentTrack = await lib.discord.voice['@0.0.1'].tracks.retrieve({
    guild_id: `${context.params.event.guild_id}`
  });
  let currentQueue = await helpers.retrieveQueue(context.params.event);
  await helpers.sendPlayerUpdate(context.params.event, currentTrack, currentQueue);
} else if (context.params.event.content.split(' ')[0] === `${process.env.PREFIX}queue`) {
  let searchString = context.params.event.content.split(' ').slice(1).join(' ').trim();
  let currentQueue = await helpers.enqueueTrack(context.params.event, searchString);
  await helpers.sendPlayerUpdate(context.params.event, null, currentQueue);
} else if (context.params.event.content === `${process.env.PREFIX}skip`) {
  let nextTrack = await helpers.dequeueTrack(context.params.event);
  if (nextTrack) {
    await helpers.play(context.params.event, nextTrack.youtube_link, true);
    let currentTrack = await lib.discord.voice['@0.0.1'].tracks.retrieve({
      guild_id: `${context.params.event.guild_id}`
    });
    let currentQueue = await helpers.retrieveQueue(context.params.event);
    await helpers.sendPlayerUpdate(context.params.event, currentTrack, currentQueue);
  } else {
    await lib.discord.voice['@0.0.1'].channels.disconnect({
      guild_id: `${context.params.event.guild_id}`
    });
  }
} else if (context.params.event.content === `${process.env.PREFIX}clear`) {
  let trackData = await lib.discord.voice['@0.0.1'].tracks.pause({
    guild_id: `${context.params.event.guild_id}`
  });
  await helpers.clearQueue(context.params.event);
  await helpers.sendPlayerUpdate(context.params.event, null, []);
}
