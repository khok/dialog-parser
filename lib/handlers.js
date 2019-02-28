const {filterInt, filterFloat, parseClamp} = require('./funcs');

async function numberHandler (parameter, ui) {
	const text = await ui.input(parameter.text);
	return parseClamp(text, parameter.type == 'int', parameter.min, parameter.max);
}

async function selectHandler (parameter, ui) {
	const opts = parameter.options;

	let value = await ui.askOption(parameter.text, opts.map(op => op.text));

	const res = opts.find(opt => opt.text == value);

	if(res == undefined)
		throw ['unknown_option', [value]];

	return res.value;
}

const comparer = (values, conditions) => {
	for(let i = 0; i < conditions.length; i++) {
		const cond = conditions[i];

		if(cond.diff > 0 && values[cond.first] - values[cond.second] < cond.diff)
			throw ['compare_greater_error', [cond.first + 1, cond.second + 1, cond.diff]];

		if(cond.diff < 0 && values[cond.first] - values[cond.second] > cond.diff)
			throw ['compare_less_error', [cond.first + 1, cond.second + 1, -cond.diff]];
	}
}

async function arrayHandler (parameter, ui) {
	const values = parameter.values;

	const texts = (await ui.input(parameter.text + this.formatMsg('comma_sep', [values.length])))
		.replace(/\s/g, '').split(',');

	if(texts == undefined)
		throw ['not_array', []];

	if(texts.length != values.length)
		throw ['array_size', [values.length, texts.length]];

	let idx = 0;

	const res = texts.map(v =>
		parseClamp(v, values[idx].type == 'int', values[idx].min, values[idx++].max));

	if(parameter.compare)
		comparer(res, parameter.compare);
		
	return res;
}

module.exports = {
	handlers: {
		"int": numberHandler,
		"double": numberHandler,
		"select": selectHandler,
		"array": arrayHandler
	}
}