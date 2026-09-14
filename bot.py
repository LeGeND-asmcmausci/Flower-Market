import logging
from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

TOKEN = "8899287838:AAHYUFasyeP8z6cKxLnbsLb1yF9dQvJUab0"
WEB_APP_URL = "https://flower-market-olive.vercel.app/"

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [KeyboardButton(text="🌸 Flower Market'ni ochish", web_app=WebAppInfo(url=WEB_APP_URL))]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

    await update.message.reply_text(
        "Assalomu alaykum! 🌸 **Flower Market** do'konimizga xush kelibsiz.\n\n"
        "Gullarni ko'rish va buyurtma berish uchun pastdagi tugmani bosing:",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

if __name__ == "__main__":
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))

    print("Mini App Bot ishga tushdi...")
    app.run_polling()