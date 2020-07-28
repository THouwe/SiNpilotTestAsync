/**
 *
 **/

jsPsych.plugins["audio-audio-down"] = (function() {

	  // jsPsych.pluginAPI.registerPreload('audio-button-response', 'stimulus', 'audio');
    // jsPsych.pluginAPI.registerPreload('audio-audio-response_IV', 'audio_out', 'audio'); // audio_out was stimulus
    let plugin = {};

    plugin.info = {
        name: 'audio-audio-down',
        description: 'Present audio and image; retrieve audio response',
        parameters: {

          //////////////////////////// AUDIO OUT ///////////////////////////////
          audio_out: {
    				type: jsPsych.plugins.parameterType.AUDIO,
            pretty_name: 'Audio_out',
    				default: undefined,
    				description: 'The audio to be played.'
    			},

          ///////////////////////////// AUDIO IN ///////////////////////////////
            // buffer_length: {
            //     type: jsPsych.plugins.parameterType.INT,
            //     pretty_name: 'Buffer length',
            //     default: 10000,
            //     description: 'Length of the audio buffer.'
            // },
            postprocessing: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Postprocessing function',
                default: function(chunks) {return new Promise(
                    function(resolve) {resolve(chunks)}
                    )},
                description: 'Function to execute on the audio data prior to saving. '+
                    'Passed the audio data and the return value is saved in the '+
                    'response object. This can be used for saving a file, and generating an id '+
                    'which relates the file to the trial data in the trial response.'
            },
            allow_playback: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Allow playback',
                default: false,
                description: 'Whether to allow the participant to play back their '+
                'recording and re-record if unhappy.'
            },

            //////////////// IMAGES - TEXT - PROMPT - STYLE ////////////////////
           // image: {
           //     type: jsPsych.plugins.parameterType.IMAGE,
           //     pretty_name: 'Image',
           //     default: undefined,
           //     description: 'The image to be displayed'
           // },
           // image_duration: {
           //     type: jsPsych.plugins.parameterType.INT,
           //     pretty_name: 'image duration',
           //     default: null,
           //     description: 'How long to hide the image.'
           // },
            recording_light: {
                type: jsPsych.plugins.parameterType.HTML_STRING,
                pretty_name: 'Recording light',
                default: '<div id="jspsych-image-audio-response-light" '+
                    'style="border: 2px solid darkred; background-color: darkred; '+
                    'width: 50px; height: 50px; border-radius: 50px; margin: 20px auto; '+
                    'display: block;"></div>',
                description: 'HTML to display while recording is in progress.'
            },
            recording_light_off: {
                type: jsPsych.plugins.parameterType.HTML_STRING,
                pretty_name: 'Recording light (off state)',
                default: '<div id="jspsych-image-audio-response-light" '+
                'style="border: 2px solid darkred; background-color: inherit; '+
                'width: 50px; height: 50px; border-radius: 50px; margin: 20px auto; '+
                'display: block;"></div>',
                description: 'HTML to display while recording is not in progress.'
            },
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Prompt',
                default: null,
                description: 'Any content here will be displayed under the button.'
            },

            /////////////////////////// STOP BUTTON ////////////////////////////
            choices: {
              type: jsPsych.plugins.parameterType.STRING,
              pretty_name: 'Choices',
              default: undefined,
              array: true,
              description: 'The button labels.'
            },
            button_html: {
              type: jsPsych.plugins.parameterType.HTML_STRING,
              pretty_name: 'Button HTML',
              default: '<button class="jspsych-btn">%choice%</button>',
              array: true,
              description: 'Custom button. Can make your own style.'
            },
            margin_vertical: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Margin vertical',
                default: '0px',
                description: 'The vertical margin of the button.'
            },
            margin_horizontal: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Margin horizontal',
                default: '8px',
                description: 'The horizontal margin of the button.'
            },

            /////////////////////////// TRIAL END //////////////////////////////
            // trial_duration: {
            //   type: jsPsych.plugins.parameterType.INT,
            //   pretty_name: 'Trial duration',
            //   default: 10000,
            //   description: 'The maximum duration to wait for a response.'
            // },
            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: false,
                description: 'If true, then trial will end when user responds.'
            }
        }
    };

    plugin.trial = function(display_element, trial) {

     var recordingslist = [];

        // if(typeof trial.image === 'undefined'){
        //     console.error('Required parameter "image" missing in image-audio-response');
        // }
        if(typeof trial.postprocessing === 'undefined'){
            console.error('Required parameter "postprocessing" missing in image-audio-response');
        }

        // let playbackElements = [];

//////////////////////////////////// HTML //////////////////////////////////////
        // // display image
        // let html = '<img src="'+trial.image+'" id="jspsych-image-audio-response-image"/>';

        //display buttons
        var buttons = [];
        if (Array.isArray(trial.button_html)) {
          if (trial.button_html.length == trial.choices.length) {
            buttons = trial.button_html;
          } else {
            console.error('Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array');
          }
        } else {
          for (var i = 0; i < trial.choices.length; i++) {
            buttons.push(trial.button_html);
          }
        }

        var html = '<div id="jspsych-audio-button-response-btngroup">';
        for (var i = 0; i < trial.choices.length; i++) {
          var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
          html += '<div class="jspsych-audio-button-response-button" style="cursor: pointer; display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-audio-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
        }
        html += '</div>';

        // add recording light
        // var html += '<div id="jspsych-image-audio-response-audio-container">'+trial.recording_light_off+'</div>';
        html += '<div id="jspsych-image-audio-response-audio-container">'+trial.recording_light_off+'</div>';
        //show prompt if there is one
        if (trial.prompt !== null) {
            html += trial.prompt;
        }
        // // add button element
        // html += '<div id="jspsych-image-audio-response-buttons"></div>';
        display_element.innerHTML = html;

//  if you want to record button pressed:
        for (var i = 0; i < trial.choices.length; i++) {
          display_element.querySelector('#jspsych-audio-button-response-button-' + i).addEventListener('click', function(e){
            var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
            after_response(choice);
          });
        }
//////////////////////////////////// HTML //////////////////////////////////////



/////////////////////////////// RECORD AUDIO ///////////////////////////////////
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }); // for having just 1 mic access request

        var gumStream; 						//stream from getUserMedia()
        var rec; 							//Recorder.js object
        var input; 							//MediaStreamAudioSourceNode we'll be recording

        // shim for AudioContext when it's not avb.
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext //audio context to help us record

        // audio element processing
        function startRecording() {
            // remove existing playback elements
            // playbackElements.forEach(function (id) {
            //     let element = document.getElementById(id);
            //     element.innerHTML = "";
            // });
            var constraints = { audio: true, video:false }
            navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            // navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(process_audio);
            console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

            audioContext = new AudioContext();

        		//update the format
        		// document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        		/*  assign to gumStream for later use  */
        		gumStream = stream;

        		/* use the stream */
        		input = audioContext.createMediaStreamSource(stream);

        		/*
        			Create the Recorder object and configure to record mono sound (1 channel)
        			Recording 2 channels  will double the file size
        		*/
        		rec = new Recorder(input,{numChannels:1})
            // __log('Recorder initialised.');
            console.log(Recorder)

        		//start the recording process
        		rec.record()
        		console.log("Recording started");

            // Add visual indicators to let people know we're recording
            document.querySelector('#jspsych-image-audio-response-audio-container').innerHTML = trial.recording_light;
        });
      }

        startRecording();

        // store response
        let response = {
            rt: null,
            data: null
            // button: null
        };

        // let recorder = null;

        // // function to handle responses by the subject
        // function process_audio(stream) {
        //     // This code largely thanks to skyllo at
        //     // http://air.ghost.io/recording-to-an-audio-file-using-html5-and-js/
        //
        //     audioContext = new AudioContext();
        //
        // 		//update the format
        // 		document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"
        //
        // 		/*  assign to gumStream for later use  */
        // 		gumStream = stream;
        //
        // 		/* use the stream */
        // 		input = audioContext.createMediaStreamSource(stream);
        //
        // 		/*
        // 			Create the Recorder object and configure to record mono sound (1 channel)
        // 			Recording 2 channels  will double the file size
        // 		*/
        // 		rec = new Recorder(input,{numChannels:1})
        //
        // 		//start the recording process
        // 		rec.record()
        //     console.log("Recording started");
        //
        //
        //
        //
        //     // // store streaming data chunks in array
        //     // const chunks = [];
        //     // // create media recorder instance to initialize recording
        //     // recorder = new MediaRecorder(stream);
        //     // // recorder = new Recorder(stream);
        //     //
        //     // recorder.data = [];
        //     // recorder.wrapUp = false;
        //     // recorder.ondataavailable = function(e) {
        //     //     // add stream data to chunks
        //     //     chunks.push(e.data);
        //     //     if (recorder.wrapUp) {
        //     //         if (typeof trial.postprocessing !== 'undefined') {
        //     //             trial.postprocessing(chunks)
        //     //                 .then(function(processedData) {
        //     //                     onRecordingFinish(processedData);
        //     //                 });
        //     //         } else {
        //     //             // should never fire - trial.postprocessing is mandatory
        //     //             onRecordingFinish(chunks);
        //     //         }
        //     //         if (trial.allow_playback) {
        //     //             showPlaybackTools(chunks);
        //     //         }
        //     //     }
        //     // };
        //     //
        //     // // start recording with 1 second time between receiving 'ondataavailable' events
        //     // recorder.start(4000);
        //     // setTimeout to stop recording after 4 seconds
        //     // setTimeout(function() {
        //     //     // this will trigger one final 'ondataavailable' event and set recorder state to 'inactive'
        //     //     recorder.stop();
        //     //     recorder.wrapUp = true;
        //     // }, trial.buffer_length);
        // }
/////////////////////////////// RECORD AUDIO ///////////////////////////////////



//////////////////////////////// PLAY AUDIO ////////////////////////////////////
        // // setup audio_out
        // var context = jsPsych.pluginAPI.audioContext();
        // // console.log(context)
        // // console.log(trial.audio)
        // if(context !== null){
        //   var source = context.createBufferSource();
        //   source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.audio_out);
        //   source.connect(context.destination);
        // } else {
        //   console.log(trial.audio_out)
        //   console.log(jsPsych.pluginAPI.getAudioBuffer)
        //   var audio = jsPsych.pluginAPI.getAudioBuffer(trial.audio_out);
        //   audio.currentTime = 0;
        // }

        // var context = jsPsych.pluginAPI.audioContext();
    		// console.log(context)
        // if(context !== null){
        //   var source = context.createBufferSource();
        //   source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
        //   source.connect(context.destination);
    		// 	console.log(trial.stimulus)
        // } else {
        //   var audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
        //   audio.currentTime = 0;
    		// 	console.log(trial.stimulus)
        // }

        //
        var audio = new Audio(trial.audio_out);
        audio.play();

        // start time
        var start_time = performance.now();

    		// start audio
        // if(context !== null){
        //   startTime = context.currentTime;
        //   source.start(startTime);
        // } else {
        //   audio.play();
        // }

        // end trial if time limit is set
        // if (trial.trial_duration !== null) {
        //   jsPsych.pluginAPI.setTimeout(function() {
        //     end_trial();
        //   }, trial.trial_duration);
        // }
//////////////////////////////// PLAY AUDIO ////////////////////////////////////



/////////////////////////////// PLAYBACK TOOL //////////////////////////////////
        // function showPlaybackTools(data) {
        //     // Audio Player
        //     let playerDiv = display_element.querySelector('#jspsych-image-audio-response-audio-container');
        //     const blob = new Blob(data, { type: 'audio/webm' });
        //     let url = (URL.createObjectURL(blob));
        //     let player = playerDiv.appendChild(document.createElement('audio'));
        //     player.id = 'jspsych-image-audio-response-audio';
        //     player.src = url;
        //     player.controls = true;
        //     // Okay/rerecord buttons
        //     let buttonDiv = display_element.querySelector('#jspsych-image-audio-response-buttons');
        //     let okay = buttonDiv.appendChild(document.createElement('button'));
        //     let rerecord = buttonDiv.appendChild(document.createElement('button'));
        //     okay.id = 'jspsych-image-audio-response-okay';
        //     rerecord.id = 'jspsych-image-audio-response-rerecord';
        //     okay.textContent = 'Okay';
        //     rerecord.textContent = 'Rerecord';
        //     okay.className = 'jspsych-audio-response-button jspsych-btn';
        //     rerecord.className = okay.className;
        //     okay.addEventListener('click', end_trial);
        //     rerecord.addEventListener('click', startRecording);
        //     // Save ids of things we want to delete later:
        //     playbackElements = [playerDiv.id, buttonDiv.id];
        // }
/////////////////////////////// PLAYBACK TOOL //////////////////////////////////



//////////////////////////////// ON FINISH /////////////////////////////////////
      // function to handle responses by the subject
      function after_response(choice) {

            // visual indicator
            let light = document.querySelector('#jspsych-image-audio-response-audio-container');
            if (light !== null)
                light.innerHTML = trial.recording_light_off;

        // disable all the buttons after a response
        var btns = document.querySelectorAll('.jspsych-audio-button-response-button button');
        for(var i=0; i<btns.length; i++){
          //btns[i].removeEventListener('click');
          btns[i].setAttribute('disabled', 'disabled');
        }

        rec.stop();

      	//stop microphone access
      	gumStream.getAudioTracks()[0].stop();

        var filename = new Date().toISOString();
        console.log(filename)

        // rec.exportWAV(function(blob){
        //   console.log(blob)
        //   rec.clear();
        //   Recorder.forceDownload(blob, filename + ".wav");
        // });

      	// //create the wav blob and pass it on to createDownloadLink
      	rec.exportWAV(createDownloadLink);
        // // rec.forceDownload(gumStream); // blob[, filename]
        // //   rec.exportWAV(function(blob){
        // //   Recorder.forceDownload(blob);
        // // });
        // //   // recorder.clear();
        // rec.clear();

        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();
        audio.pause();
      }

        function createDownloadLink(blob) {

        	var url = URL.createObjectURL(blob);
        	var au = document.createElement('audio');
        	var li = document.createElement('li');
        	var link = document.createElement('a');

          const div = document.getElementById('jspsych-content')
              .appendChild(document.createElement('div'));
              // console.log(div)


        	// //add controls to the <audio> element
        	// au.controls = true;
        	// au.src = url;
          var filename = new Date().toISOString();

        	//save to disk link
        	link.href = url;
        	link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
        	link.innerHTML = "Save to disk";

          link.addEventListener("click", function(event){
          	  end_trial();
            });

        	//add the new audio element to li
        	// li.appendChild(au);

        	//add the filename to the li
        	li.appendChild(document.createTextNode(filename + trial.prompt + ".wav "))

        	//add the save to disk link to li
        	li.appendChild(link);

        	//upload link
        	// var upload = document.createElement('a');
        	// upload.href="#";
        	// upload.innerHTML = "Upload";
        	// upload.addEventListener("click", function(event){
        	// 	  var xhr=new XMLHttpRequest();
        	// 	  xhr.onload=function(e) {
        	// 	      if(this.readyState === 4) {
        	// 	          console.log("Server returned: ",e.target.responseText);
        	// 	      }
        	// 	  };
        	// 	  var fd=new FormData();
        	// 	  fd.append("audio_data",blob, filename);
        	// 	  xhr.open("POST","upload.php",true);
        	// 	  xhr.send(fd);
        	// })
        	// li.appendChild(document.createTextNode (" "))//add a space in between
        	// li.appendChild(upload)//add the upload link to li

        	//add the li element to the ol
        	div.appendChild(li);
          // rec.forceDownload(li);
        }

//         recorder.stop();
//
// //         This will generate a Blob object containing the recording in WAV format.
// // The callback will be called with the Blob as its sole argument.
//  // If a callback is not specified, the default callback (as defined in the config) will be used.
//   // If no default has been set, an error will be thrown.
// // In addition, you may specify the type of Blob to be returned (defaults to 'audio/wav').
//         recorder.exportWAV();
//         recorder.forceDownload(); // blob[, filename]
//
//         recorder.wrapUp = true;
//         audio.pause();
        // onRecordingFinish(chunks);
        // }


        // function onRecordingFinish(data) {
        //     // visual indicator
        //     let light = document.querySelector('#jspsych-image-audio-response-audio-container');
        //     if (light !== null)
        //         light.innerHTML = trial.recording_light_off;
        //     // measure rt
        //     let end_time = performance.now();
        //     let rt = end_time - start_time;
        //     response.data = data;
        //     response.rt = rt;
        //     // response.button = choice;
        //
        //     if (trial.response_ends_trial) {
        //         end_trial();
        //     }
        // }

        // function to end trial when it is time
        function end_trial() {
          // li.click(),
            //
            // // gather the data to store for the trial
            // let trial_data = {
            //     "rt": response.rt,
            //     // "image": trial.image,
            //     // "audio_out": trial.audio_out,
            //     "data": response.data
            // };

            // clear the display
            // display_element.innerHTML = '';

            // move on to the next trial
            // jsPsych.finishTrial(trial_data);
            jsPsych.finishTrial();
        }

        // // hide image if timing is set
        // if (trial.image_duration !== null) {
        //     jsPsych.pluginAPI.setTimeout(function() {
        //         display_element.querySelector('#jspsych-image-audio-response-image').style.visibility = 'hidden';
        //     }, trial.image_duration);
        // }
//////////////////////////////// ON FINISH /////////////////////////////////////

    };

    return plugin;
})();
