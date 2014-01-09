window.twentyfive = (function(){
	var POMODOROMILLISECS = 1500,
		BREAKMILLISECS = 300,
		count = POMODOROMILLISECS,
		timerId = 0,
		breakTimerCount  = BREAKMILLISECS,
		breakTimerId = 0,
		startButton = $(".start-btn"),
    	stopButton = $(".stop-btn"),
    	stopBreakButton = $(".stopbreak-btn");

	function breakCompleted(){
		$('.main-btns').show();
		$('.break-btns').hide();
		clearInterval(breakTimerId);
		breakTimerCount = BREAKMILLISECS;
		reset();
	}	

	function timerCompleted(){
		$('.main-btns').hide();
		$('.break-btns').show();
		$('#sec').text('00');
		$('#min').text('05'); 			
		clearInterval(timerId);
		startBreakTime();
	}	

	function zeroPad(num, places){
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;		
	}

	function reset(){
		count = POMODOROMILLISECS;
		clearInterval(timerId);
    	startButton.removeClass('disabled');
    	stopButton.addClass('disabled');		
		$('#sec').text('00');
		$('#min').text('25'); 		
	}

	function timer(){
		count = count-1;
		if (count <= 0)
		{
			$(document.body).trigger('timer:done');			
			return;
		}
		updateVisual();		
	}

	function breakTimer(){
		breakTimerCount = breakTimerCount-1;
		if (breakTimerCount <= 0)
		{
			$(document.body).trigger('break:done');
			return;
		}
		updateVisual();
	}

	function updateVisual(){
		var secs = parseInt($('#sec').text(), 10);
		var mins = parseInt($('#min').text(), 10);

		if (secs === 0) {
			mins--;
			secs = 59;
		} else {
			secs--;
		}

		$('#sec').text(zeroPad(secs,2));
		$('#min').text(zeroPad(mins,2)); 		
	}

	function startBreakTime(){			
		breakTimerId = setInterval(breakTimer, 1000);
	}

	function startPomodoro(){
		timerId = setInterval(timer, 1000);
	}

    function touchStartCallback(){
    	if (startButton.hasClass('disabled'))
    		return;
    	reset();
    	startPomodoro();
    	startButton.addClass('disabled');
    	stopButton.removeClass('disabled');
    };

    function touchStopCallback(){
    	if (stopButton.hasClass('disabled'))
    		return;
    	reset();
    	startButton.removeClass('disabled');
    	stopButton.addClass('disabled');
    };	

    function touchStopBreakCallback(){
		$(document).trigger('break:done');
    }

    function init(){
		$(document).on('break:done', breakCompleted);		
		$(document).on('timer:done', timerCompleted);

   		stopBreakButton.on("touchstart", touchStopBreakCallback)
    	startButton.on("touchstart", touchStartCallback);
    	stopButton.on("touchstart", touchStopCallback);
    }

	return {
		init : init
	};
})();


$(function(){
	twentyfive.init();
	$('#infoModal').data('reveal-init', {
    	animation: 'none'
	});
});