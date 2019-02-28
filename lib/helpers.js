const {stringFormat} = require('./funcs');

const self = module.exports = {
	formatMsg (messages, code, args) {
		return (messages == undefined || messages[code] == undefined) ?
				code :
				stringFormat(messages[code], args);
	},
	
	fakeParam (messages) {
		return {
			text: self.formatMsg(messages, 'continue'),
			type: "select",
			options: [{text: self.formatMsg(messages, 'continue_button'), value: "go"}]
		}
	}
}