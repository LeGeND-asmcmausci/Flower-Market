import logging
from telegram import (
    Update, 
    ReplyKeyboardMarkup, 
    KeyboardButton, 
    InlineKeyboardMarkup, 
    InlineKeyboardButton, 
    WebAppInfo
)
from telegram.ext import (
    ApplicationBuilder, 
    CommandHandler, 
    MessageHandler, 
    ContextTypes, 
    filters
)

# Bot tokeni va Vercel-dagi Mini App manzili
TOKEN = "8899287838:AAFbezILZXhtnCCVjqwQADQC6E7CxzuD2oc"
WEB_APP_URL = "https://flower-market-olive.vercel.app/"

# Loglarni sozlash
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
    level=logging.INFO
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """/start buyrug'i berilganda ishga tushadi"""
    user = update.effective_user
    
    # Pastki menyudagi WebApp va qayta boshlash tugmalari
    keyboard = [
        [KeyboardButton(text="🌸 Do'konni ochish", web_app=WebAppInfo(url=WEB_APP_URL))],
        [KeyboardButton(text="🔄 Qayta boshlash")],
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

    # Chat ichidagi Inline WebApp tugmasi
    inline_keyboard = [
        [InlineKeyboardButton(text="💐 Katalogni ko'rish va buyurtma berish", web_app=WebAppInfo(url=WEB_APP_URL))]
    ]
    inline_markup = InlineKeyboardMarkup(inline_keyboard)

    welcome_text = (
        f"Assalomu alaykum, <b>{user.first_name}</b>! 🌸\n\n"
        f"<b>GULLAR</b> — Toshkentdagi bejirim gullar ustaxonasiga xush kelibsiz.\n\n"
        f"✨ Tayyor guldastalar va xit buketlar\n"
        f"🚀 60 daqiqada shahar bo'ylab yetkazib berish\n\n"
        f"Gullarni tanlash uchun pastdagi tugmani bosing:"
    )

    await update.message.reply_text(
        text=welcome_text,
        reply_markup=reply_markup,
        parse_mode="HTML"
    )
    
    # Inline tugmani ham yuborish
    await update.message.reply_text(
        text="👇 To'g'ridan-to'g'ri mini ilovani ochish:",
        reply_markup=inline_markup
    )

async def restart(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Botni qayta ishga tushirish — /restart buyrug'i yoki klaviaturadagi
    "🔄 Qayta boshlash" tugmasi bosilganda start oqimi qayta yuboriladi."""
    await start(update, context)


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """/help buyrug'i uchun handler"""
    help_text = (
        "<b>Yordam bo'limi ℹ️</b>\n\n"
        "Buyurtma berish uchun <b>🌸 Do'konni ochish</b> tugmasini bosing va o'zingizga yoqqan guldastani tanlang.\n\n"
        "Botni qayta ishga tushirish uchun <b>🔄 Qayta boshlash</b> tugmasini bosing yoki /restart buyrug'ini yuboring.\n\n"
        "Savollaringiz bo'lsa, qo'llab-quvvatlash xizmati bilan bog'lanishingiz mumkin."
    )
    await update.message.reply_text(help_text, parse_mode="HTML")

async def about_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """/about buyrug'i uchun handler"""
    about_text = (
        "<b>GULLAR — Toshkent</b> 🌺\n\n"
        "Biz har kuni sara va yangi gullardan unikal guldastalar tayyorlaymiz.\n"
        "Yetkazib berish xizmati: Toshkent shahri bo'ylab."
    )
    await update.message.reply_text(about_text, parse_mode="HTML")

if __name__ == "__main__":
    app = ApplicationBuilder().token(TOKEN).build()

    # Handlerni ro'yxatdan o'tkazish
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("restart", restart))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("about", about_command))

    # Klaviaturadagi "🔄 Qayta boshlash" tugmasi bosilganda ham start oqimi ishlaydi
    app.add_handler(
        MessageHandler(
            filters.TEXT & ~filters.COMMAND & filters.Regex(r"^🔄\s*Qayta boshlash$"),
            restart,
        )
    )

    print("🌸 Flower Market Bot muvaffaqiyatli ishga tushdi...")
    app.run_polling()