require("dotenv").config();
// const PUBLIC_URL = process.env.APP_URL || "https://trashrbot.onrender.com";
const BOT_TOKEN = process.env.TOKEN;
const PORT = process.env.PORT;

const  {Telegraf, Markup} = require('telegraf');
const {message} = require('telegraf/filters')

const ngrok = require('ngrok');

const bot = new Telegraf(/* process.env. */BOT_TOKEN);
bot.use(Telegraf.log());
// const secret = `${Math.random().toString(36).slice(2)}`;



bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.on(message('text'), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
console.log(ctx);
  // Using context shortcut
  return await ctx.reply(
    "Let's get started 🤌🏻 \n",
		Markup.inlineKeyboard([
			Markup.button.webApp('hello i am a webapp','https://www.google.com')
		]),
);
});

bot.action("Dr Pepper", (ctx, next) => {
	return ctx.reply("👍").then(() => next());
});

bot.on('callback_query', async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

bot.on('inline_query', async (ctx) => {
  const result = [];
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

  // Using context shortcut
  await ctx.answerInlineQuery(result);
});



(async function() {
    // start ngrok
    const url = await ngrok.connect(PORT);
    console.log('live in',url,true);

    // launch bot at that url
    bot.launch({
      webhook: {
        // Public domain for webhook; e.g.: example.com
        domain: url,
    
        // Port to listen on; e.g.: 8080
        port: PORT,
    
        // Optional path to listen for.
        // `bot.secretPathComponent()` will be used by default
      //   hookPath: webhookPath,
    
        // Optional secret to be sent back in a header for security.
        // e.g.: `crypto.randomBytes(64).toString("hex")`
      //   secretToken: randomAlphaNumericString,
      },
    });
  })();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));