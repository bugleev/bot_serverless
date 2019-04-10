class WebchatBot {
  createRichMessage(items) {
    return {
      messages: items
    }
  }
}
module.exports = new WebchatBot()