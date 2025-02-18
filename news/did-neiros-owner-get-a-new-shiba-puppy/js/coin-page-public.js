(function ($) {
	'use strict';
	const coinGeckoMarketsApi = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={id}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d';

	function setPrice(price) {
		var formattedPrice = formatCurrency(price);
		$('.coin-page-price-info-price').text(formattedPrice);
		$('.coin-page-price-info-price-block').show();
		$('.coin-page-banner-header-price')
			.text(formattedPrice)
			.css('display', 'flex');
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

	function setHighLows(high, low) {
		$('.coin-page-banner-info-market-value-high').text(
			formatCurrency(high)
		);

		$('.coin-page-banner-info-market-value-low').text(
			formatCurrency(low)
		);

		$('.coin-page-banner-info-market-block.highlow').css('display', 'flex');
	}

	function setChange($changeDiv, change) {
		const text = formatPercent(change);
		$changeDiv.find('span').text(text);
		setChangeClass($changeDiv, change);
	}

	function setMarketData(type, value) {
		var formattedVolume = formatCurrency(value)?.split('.')[0];
		$('.coin-page-price-info-' + type).text(formattedVolume);
		$('.coin-page-price-info-' + type + '-block').show();
		$('.' + type + ' .coin-page-banner-info-market-value').text(formattedVolume);
		$('.coin-page-banner-info-market-block.' + type).css('display', 'flex');
	}

	function processMarketData(marketsData) {
		const markets = marketsData[0];
		setPrice(markets.current_price);
		setMarketData('cap', markets.market_cap);
		setMarketData('volume', markets.total_volume);
		setHighLows(markets.high_24h, markets.low_24h);
		setChange($('.coin-page-banner-info-changes>._1h'), markets.price_change_percentage_1h_in_currency);
		setChange($('.coin-page-banner-info-changes>._24h'), markets.price_change_percentage_24h_in_currency);
		setChange($('.coin-page-banner-info-changes>._7d'), markets.price_change_percentage_7d_in_currency);
		$('.coin-page-banner-info-changes').css('display', 'flex');
	}

	$(function () {
		const hasInfoBlock = $('.coin-page-price-info').length > 0 && $('.coin-page-banner').length > 0;

		if (hasInfoBlock) {
			const dateOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
			var today = new Date();
			$('.coin-page-price-info-date').text(today.toLocaleDateString("en-US", dateOptions));

			const name = $('.coin-page-price-info').data('name')
				.toLowerCase()
				.replaceAll(' ', '-');		
					
			$.when(
				$.get(coinGeckoMarketsApi.replace('{id}', name))
			).done(processMarketData);
		};
	});
})(jQuery);


