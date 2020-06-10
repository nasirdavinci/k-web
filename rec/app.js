//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record
var rec = $('.record-comment-audio-kb');

var encodingTypeSelect = document.getElementById("encodingTypeSelect");

$(document).on('click',".record-comment-audio-kb",function(event) {
    var _SELF = $(this);var rect = $(".blink");
    Wo_Delay(function(){
      if( _SELF.attr('data-record') == 0) {
		startRecording();
		rect.removeClass("hidden");
		myRecTimer = setInterval(myTimer, 1000);
		// setInterval(() => { 
			
		// }, 1000);
        recording_node = "comm";
        comm_field     = _SELF.attr('id');
		_SELF.attr('data-record','1').html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="red" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M9,9V15H15V9" <animate attributeType="XML" attributeName="fill"values="#800;#f00;#800;#800"dur="0.8s"repeatCount="indefinite"/>></path></svg>');  
		
		setTimeout(() => {
			if (_SELF.attr('data-record') == 1){
				_SELF.click();
			}
		}, 900000);
		
      }

      else if( _SELF.attr('data-record') == 1 && $("[data-record='1']").length == 1){
		stopRecording();mStopt();
	   _SELF.html('<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" x="0px" y="0px" viewBox="25 25 50 50" enable-background="new 0 0 0 0"><path fill="#000" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite" /></path></svg>').attr('data-record','2');   
	   rect.addClass("hidden");  
      }

      else if( _SELF.attr('data-record') == 2){
       _SELF.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"></path></svg>').attr('data-record','0');  
      }

      else{
        return false;
      }
    },500);
    
  });

function startRecording() {
	console.log("startRecording() called");

	
    
    var constraints = { audio: true, video:false }


	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
	

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		

		//assign to gumStream for later use
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		
		//stop the input from playing back through the speakers
		//input.connect(audioContext.destination)

		//get the encoding 
		encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
		
		//disable the encoding selector
		encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "/js/", // must end with slash
		  encoding: encodingType,
		  
		  numChannels:2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    
		  }
		});

		recorderwav = new WebAudioRecorder(input, {
			workerDir: "/js/", // must end with slash
			encoding: 'wav',
			
			numChannels:2, //2 is the default, mp3 encoding supports only 2
			onEncoderLoading: function(recorder, encoding) {
			  // show "loading encoder..." display
			},
			onEncoderLoaded: function(recorder, encoding) {
			  
			}
		  });

		recorder.onComplete = function(recorder, blob) { 
			createDownloadLink(blob,'mp3');
			encodingTypeSelect.disabled = false;	
		}

		recorderwav.onComplete = function(recorder, blob) { 
			rec.html('<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check-circle" class="svg-inline--fa fa-check-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:24px;margin-top:7px"><path fill="currentColor" d="M341.227,149.333V0l-50.133,50.133C260.267,19.2,217.707,0,170.56,0C76.267,0,0.107,76.373,0.107,170.667 s76.16,170.667,170.453,170.667c79.467,0,146.027-54.4,164.907-128h-44.373c-17.6,49.707-64.747,85.333-120.533,85.333 c-70.72,0-128-57.28-128-128s57.28-128,128-128c35.307,0,66.987,14.72,90.133,37.867l-68.8,68.8H341.227z"></path></svg>');
			
			encodingTypeSelect.disabled = false;
			var wavesurfer = WaveSurfer.create({
				container: '#waveform',
				waveColor: '#999',
				progressColor: '#333',
				height: 36
			});
			$('#waveforml').css('display', 'block');
			wavesurfer.loadBlob(blob);
			
			wavesurfer.on('ready', function() {
				var st = new window.soundtouch.SoundTouch(
					wavesurfer.backend.ac.sampleRate
				);
				var buffer = wavesurfer.backend.buffer;
				var channels = buffer.numberOfChannels;
				var l = buffer.getChannelData(0);
				var r = channels > 1 ? buffer.getChannelData(1) : l;
				var length = buffer.length;
				var seekingPos = null;
				var seekingDiff = 0;
		
				var source = {
					extract: function(target, numFrames, position) {
						if (seekingPos != null) {
							seekingDiff = seekingPos - position;
							seekingPos = null;
						}
		
						position += seekingDiff;
		
						for (var i = 0; i < numFrames; i++) {
							target[i * 2] = l[i + position];
							target[i * 2 + 1] = r[i + position];
						}
		
						return Math.min(numFrames, length - position);
					}
				};
		
				var soundtouchNode;
		
				wavesurfer.on('play', function() {
					seekingPos = ~~(wavesurfer.backend.getPlayedPercents() * length);
					st.tempo = wavesurfer.getPlaybackRate();
		
					if (st.tempo === 1) {
						wavesurfer.backend.disconnectFilters();
					} else {
						if (!soundtouchNode) {
							var filter = new window.soundtouch.SimpleFilter(source, st);
							soundtouchNode = window.soundtouch.getWebAudioNode(
								wavesurfer.backend.ac,
								filter
							);
						}
						wavesurfer.backend.setFilter(soundtouchNode);
					}
				});
		
				wavesurfer.on('pause', function() {
					soundtouchNode && soundtouchNode.disconnect();
				});
		
				wavesurfer.on('seek', function() {
					seekingPos = ~~(wavesurfer.backend.getPlayedPercents() * length);
					wavesurfer.setPlaybackRate(1.25);
				    wavesurfer.playPause();
				});
				wavesurfer.setPlaybackRate(1.25);
				wavesurfer.play();

			}); //tempo

			wavesurfer.on('finish', function() {
				setTimeout(() => {
					wavesurfer.play();
				}, 300);
			});
		}

		recorder.setOptions({
		  timeLimit:120,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: -0.1},
	      mp3: {bitRate: 160}
	    });

		//start the recording process
		recorder.startRecording();
		recorderwav.startRecording();

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
    	
	});

}

function stopRecording() {
	console.log("stopRecording() called");
	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	
	recorder.finishRecording();
	recorderwav.finishRecording();
}

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	// //link the a element to the blob
	link.href = url;
	link.download = new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;

	//add the new audio and a elements to the li element
	// li.appendChild(au);
	li.appendChild(link);

	//add the li element to the ordered list
	recordingsList.appendChild(li);

	
}



var t = 0
function myTimer() {
	t += 1
	$('.blink').html(fmtMSS(t) + " Recording...");
}
  
function mStopt() {
	clearInterval(myRecTimer);
}

var Wo_Delay = (function(){
	var timer = 0;
	return function(callback, ms){
	  clearTimeout (timer);
	  timer = setTimeout(callback, ms);
	};
  })();

  function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}