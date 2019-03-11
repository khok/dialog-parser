const {handlers} = require('./handlers');

class DialogParser {
	constructor(customHandlers) {
		this.handlers = {};

		Object.entries(customHandlers || handlers).forEach(([key, method]) => {
			 this.handlers[key] = method.bind(this);
		});
	}

	async requestSingle(parameter, ui) {

		const type = parameter.type;
		const handler = this.handlers[type];

		if(!handler)
			throw `Parameter "${parameter.name}": no handler for type "${type}"`;

		while(true) {
			try{
				return await handler(parameter, ui);
			}
			catch (e) {
				if(Array.isArray(e))
					await ui.message(e[0], e[1]);
				else
					throw e;
			}
		}
	}

	async requestMultiple(parameters, ui) {
		let result = {};
		let history = [];

		for(let i = 0; i < parameters.length; i++) {

			const parameter = parameters[i];

			if(parameter.name)
				delete result[parameter.name];

			if(parameter.conditions && !parameter.conditions.some(
				cond => result[cond.name] == cond.value)) {
				continue;
			}

			try {
				let value = await this.requestSingle(parameter, ui);

				if(parameter.name)
					result[parameter.name] = value;

			} catch(e) {
				if(e == 'reset')
					return undefined;
				
				if(e == 'edit') {
					i = (history.pop() || 0) - 1;
					continue;
				}

				throw e;
			}

			history.push(i);
		}

		return result;
	}
}

module.exports = DialogParser;
