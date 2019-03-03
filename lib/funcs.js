const self = module.exports = {
	filterInt (value) {
		return /^(\-|\+)?([0-9]+|Infinity)$/.test(value) ? Number(value) : NaN;
	},

	filterFloat (value) {
		return value.includes(",") ? NaN : parseFloat(value);
	},

	parseClamp(string, isInt, min, max) {

		const value = isInt ? self.filterInt(string) : self.filterFloat(string);

		if(isNaN(value))
			throw [isInt ? 'nan_int' : 'nan_double', []];

		if(min != undefined && value < min)
			throw max != undefined ? ['value_minmax', [min, max]] : ['value_min', [min]];

		if(max != undefined && value > max)
			throw min != undefined ? ['value_minmax', [min, max]] : ['value_max', [max]];

		return value;
	}
}