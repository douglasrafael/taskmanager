// Brazilian Portuguese
if (getLang().indexOf('pt') !== -1) {
	jQuery.extend(jQuery.fn.pickadate.defaults, {
		monthsFull: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
		monthsShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
		weekdaysFull: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
		weekdaysShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
		today: 'hoje',
		clear: 'limpar',
		close: 'fechar',
		format: 'dddd, d !de mmmm !de yyyy',
		formatSubmit: 'yyyy-mm-dd',
		weekdaysLetter: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
		// The title label to use for the month nav buttons
		labelMonthNext: 'Próximo',
		labelMonthPrev: 'Anterior',
	});
}

function getLang() {
	return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
}