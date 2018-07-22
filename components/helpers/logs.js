module.exports = {
  useTip: () => {
    console.log('~~~~~~~~~~')
    console.log('Botkit Starter Kit')
    console.log('Execute your bot application like this:')
    console.log(
      'CLIENTID=<MY SLACK CLIENT ID>= CLIENTSECRET=<MY CLIENT SECRET>= PORT<=PORT>= node bot.js'
    )
    console.log('Get Slack app credentials here: https://api.slack.com/apps')
    console.log('~~~~~~~~~~')
  }
}
