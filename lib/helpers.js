const self = module.exports = {
	fakeParam (messages) {
		return {
			text: self.formatMsg(messages, 'continue'),
			type: "select",
			options: [{text: self.formatMsg(messages, 'continue_button'), value: "go"}]
		}
	}
}