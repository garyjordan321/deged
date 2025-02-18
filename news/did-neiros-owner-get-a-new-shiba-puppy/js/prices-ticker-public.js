
(function ($) {
	'use strict';
	const binanceApi = 'https://api.binance.com/api/v3/';
	const priceApi = 'ticker/price';
	const tickerApi = 'ticker';

	function setPrices(data) {
		$(data).each(function () {
			const symbol = this.symbol.replace('USDT', '');
			$('.ticker-card[data-symbol=' + symbol + '] .ticker-price-row').text(
				formatCurrency(this.price)
			);
		});
	}

	function setChanges(data, windowSize) {
		$(data).each(function () {
			const symbol = this.symbol.replace('USDT', '');
			var $changeDiv = $('.ticker-card[data-symbol=' + symbol
				+ '] .ticker-change.' + windowSize);

			const text = formatPercent(this.priceChangePercent);
			$changeDiv.find('span').text(text);
			setChangeClass($changeDiv, this.priceChange);
		});
	}

	function setChangeClass($changeDiv, priceChange) {
		var isNegative = parseFloat(priceChange) < 0;
		if (isNegative) {
			$changeDiv.addClass("minus");
			$changeDiv.removeClass("plus");
		}
		else {
			$changeDiv.removeClass("minus");
			$changeDiv.addClass("plus");
		}
	}

	function getSymbols() {
		const symbols = [];
		$('.tickers-container .ticker-card').each(function () {
			symbols.push($(this).data('symbol'));
		});

		return symbols;
	}

	function getUrlWithSymbols(apiUrl, symbols) {
		const symbolsStr = "[" + $.map(symbols, function (n, i) {
			return "%22" + n + "USDT" + "%22";
		}).join() + "]";

		return apiUrl + "?symbols=" + symbolsStr;
	}

	function formatCurrency(inputStr) {
		var floatVal = parseFloat(inputStr);
		const isLowSat = floatVal < 0.01;
		
		if(isLowSat)
		{
			return "$" + floatVal.toString();
		}

		return "$" + floatVal
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
			.toString();
	}

	function formatPercent(inputStr) {
		var floatVal = parseFloat(inputStr);
		return (floatVal > 0 ? "+" : "") + floatVal
			.toFixed(2)
			.toString() + "%";
	}

	$(function () {
		const symbols = getSymbols();

		if(!symbols?.length)
		{
			return;
		}

		const priceUrl = getUrlWithSymbols(binanceApi + priceApi, symbols);
		var tickerUrl = getUrlWithSymbols(binanceApi + tickerApi, symbols);

		$.when(
			$.get(priceUrl, null),
			$.get(tickerUrl + "&windowSize=1d", null),
			$.get(tickerUrl + "&windowSize=7d", null))
			.done(function (pricesData, ticker1dData, ticker7dData) {
				setPrices(pricesData[0]);
				setChanges(ticker1dData[0], "1d");
				setChanges(ticker7dData[0], "7d");

				$.each($('.tickers-container .ticker-card'), function() {
					$(this).show();
				});

				window.swiper = new Swiper('.tickers-swiper', {
					// Optional parameters
					direction: 'horizontal',
					grabCursor: true,
					slidesPerView: 1,
					spaceBetween: 12,
					breakpoints: {
						380: {
						  slidesPerView: 2,
						},
						570: {
						  slidesPerView: 3,
						},
						760: {
						  slidesPerView: 4,
						},
						950: {
							slidesPerView: 5
						},
						1140: {
							slidesPerView: 6
						}
					}
				  });
			})
			.fail(function () {
        		$('.tickers-container').hide();
			});
	});
})(jQuery);
