////////////////////////////////////////////////////////////////////////////////
////////////////////////////// CONSTANTS ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var TODAY = new Date();
var DD = String(TODAY.getDate()).padStart(2, '0');
var MM = String(TODAY.getMonth() + 1).padStart(2, '0');
var YYYY = String(TODAY.getFullYear());
var DATE = YYYY + MM + DD;
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
////////////////////////////// DEFINE TIMELINE /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
          /* create timeline */
          var timeline = [];
          var calib_timeline = {
            timeline: []
          };
          var SiN_timeline = {
            timeline: []
          };


          var stimDir_calib = "../../stimuli/calibration/";
          var stimDir_SiN = "../../stimuli/SRT/SiN/";

////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
////////////////////////////// CALIBRATION /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    /* page 1. welcome */
    var welcome = {
      data: {
        screen_ID: "Welcome"
      },
      type: "survey-html-form",
      preamble: "<p>Welcome to the experiment!</p>" +
        "Please enter your ID (numbers and/or text; e.g., YourInitials_testNr)",
      html: "<p>Participant ID: <input name='Part_ID' type='text' /></p>",
      on_finish: function(data){
        data.responses = JSON.parse(data.responses);
        console.log("data.responses: " + JSON.stringify(data.responses));
        jsPsych.data.addProperties({
          part_ID: data.responses.Part_ID,
        });
        console.log("jsPsych data: " + JSON.stringify(jsPsych.data.get().values()));
      }
    };

    /* pages 2-4. Instructions */
    var instructions_general = {
      data: {
        screen_ID: "Instructions"
      },
      type: "instructions",
      pages: [
        // page 2:
        "<p>This test is about recognising digits in noise and takes about 7 minutes.</p>" +
        "<p>To begin with, make sure that you are in a silent environment.</p>" +
        "<p>Please, wear headphones and make yourself comfortable.</p>"
      ],
      show_clickable_nav: true
    }

    var calib_preAudio = {
      type: 'html-button-response',
      stimulus: "<p>CALIBRATION</p>" +
      "<p>As a first step, please adjust the volume " +
      "of your loudspeakers while listening to a sound (a party crowd) " +
      "to a level that allows you to easily hear the sound, but which is, " +
      "at the same time, comfortable.</p>",
      choices: ["play"]
    };

    var calib_audioOut = {
      type: 'audio-keyboard-response',
      stimulus: stimDir_calib + "partyCrowd11sec_eq.wav",
      choices: jsPsych.NO_KEYS,
      trial_duration: 10000,
      prompt: "Regulate volume.",
    response_ends_trial: false
    }

    var calib_postAudio = {
      type: 'html-button-response',
      stimulus: "<p>If you have set the volume, proceed to the test, " +
      "else replay the sound</p>",
      choices: ["replay", "proceed"]
    };

    var calib_node = {
      timeline: [calib_audioOut, calib_postAudio],
      loop_function: function(data){
        if(jsPsych.data.get().last(1).values()[0].button_pressed == 0){
            return true;
        } else {
            return false;
        }
      }
    }

/////// PUSH CALIBRATION TRIALS TO CALIBRATION TIMELINE /////////
    calib_timeline.timeline.push(welcome);
    calib_timeline.timeline.push(instructions_general);
    calib_timeline.timeline.push(calib_preAudio);
    calib_timeline.timeline.push(calib_node);
    timeline.push(calib_timeline);
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// SiNRT ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    var instructions_SRT = {
      data: {screen_id: "instructions_SRT"},
      type: 'html-button-response',
      stimulus: "<p>TEST</p>" +
      "<p>As part of the test you will hear a number of male and female " +
      "speakers uttering a number between 0 and 9 in High German.</p>" +
      "<p>It will be hard to understand what number is said, as the " +
      "recording is embedded in noise.</p>" +
      "<p>Your task is to simply select with the cursor the button corresponding to the correct number.</p>" +
      "<p>Press 'Continue' to proceed to a practice trial.</p>",
      choices: ['Continue'],
      show_clickable_nav: true,
      on_finish: function() {
        // on_finish: function(data){
        console.log("INSTRUCTIONS SRT")
      }
    };
    // SRT_instructions_timeline.timeline = instructions_SRT;
    //   timeline.push(SRT_instructions_timeline);

var fixation_cross = {
  data: {screen_id: "fixation"},
  type: 'html-keyboard-response',
  stimulus: "<div style='font-size: 60px'><b>+</b></div>",
  choices: jsPsych.NO_KEYS,
  trial_duration: 1000
}

var practice_trial_SiN = {
  type: 'audio-button-response-simple',
  data: {screen_id: "practice_trial", dB_SNR:-8, speaker:33, digit_id: "2", ITI:3},
  stimulus: stimDir_SiN + "PRACTICE_Speaker33_Digit2_-8dB_SNR_3secITI_16k.wav",
  choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  prompt: "<p>What number was said?</p>" //,
  // on_finish: function(data){
  //   if (data.button_pressed == data.digit_id){
  //     data.accuracy = 1
  //   } else {
  //     data.accuracy = 0
  //   }
  // }
};

var start_SiNRT = {
  data: {screen_id: "start_SiNRT"},
  type: 'html-button-response',
  stimulus: "<p>Click below to get started with the actual test.</p>",
  choices: ['Start Test']
};

var STIMULI = [
  {stimulus: stimDir_SiN + "STIM_Speaker13_Digit0_-8dB_SNR_2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:13, digit_id: "0", ITI:2}},
  {stimulus: stimDir_SiN + "STIM_Speaker61_Digit0_-8dB_SNR_2-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:61, digit_id: "0", ITI:2.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker49_Digit0_-8dB_SNR_2-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:49, digit_id: "0", ITI:2.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker25_Digit0_-8dB_SNR_2-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:25, digit_id: "0", ITI:2.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker01_Digit0_-8dB_SNR_2-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:1, digit_id: "0", ITI:2.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker48_Digit0_-8dB_SNR_3secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:48, digit_id: "0", ITI:3}},
  {stimulus: stimDir_SiN + "STIM_Speaker06_Digit0_-8dB_SNR_3-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:6, digit_id: "0", ITI:3.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker05_Digit0_-8dB_SNR_3-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:5, digit_id: "0", ITI:3.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker21_Digit0_-8dB_SNR_3-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:21, digit_id: "0", ITI:3.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker14_Digit0_-8dB_SNR_3-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:14, digit_id: "0", ITI:3.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker12_Digit0_-8dB_SNR_4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:12, digit_id: "0", ITI:4}},
  {stimulus: stimDir_SiN + "STIM_Speaker07_Digit1_-8dB_SNR_2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:7, digit_id: "1", ITI:2}},
  {stimulus: stimDir_SiN + "STIM_Speaker21_Digit1_-8dB_SNR_2-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:21, digit_id: "1", ITI:2.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker14_Digit1_-8dB_SNR_2-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:14, digit_id: "1", ITI:2.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker33_Digit1_-8dB_SNR_2-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:33, digit_id: "1", ITI:2.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker05_Digit1_-8dB_SNR_2-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:5, digit_id: "1", ITI:2.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker01_Digit1_-8dB_SNR_3secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:1, digit_id: "1", ITI:3}},
  {stimulus: stimDir_SiN + "STIM_Speaker06_Digit1_-8dB_SNR_3-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:6, digit_id: "1", ITI:3.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker13_Digit1_-8dB_SNR_3-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:13, digit_id: "1", ITI:3.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker16_Digit1_-8dB_SNR_3-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:16, digit_id: "1", ITI:3.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker25_Digit1_-8dB_SNR_3-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:25, digit_id: "1", ITI:3.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker61_Digit1_-8dB_SNR_4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:61, digit_id: "1", ITI:4}},
  {stimulus: stimDir_SiN + "STIM_Speaker01_Digit2_-8dB_SNR_2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:1, digit_id: "2", ITI:2}},
  {stimulus: stimDir_SiN + "STIM_Speaker33_Digit2_-8dB_SNR_2-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:33, digit_id: "2", ITI:2.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker21_Digit2_-8dB_SNR_2-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:21, digit_id: "2", ITI:2.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker49_Digit2_-8dB_SNR_2-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:49, digit_id: "2", ITI:2.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker25_Digit2_-8dB_SNR_2-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:25, digit_id: "2", ITI:2.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker12_Digit2_-8dB_SNR_3secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:12, digit_id: "2", ITI:3}},
  {stimulus: stimDir_SiN + "STIM_Speaker10_Digit2_-8dB_SNR_3-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:10, digit_id: "2", ITI:3.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker13_Digit2_-8dB_SNR_3-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:13, digit_id: "2", ITI:3.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker61_Digit2_-8dB_SNR_3-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:61, digit_id: "2", ITI:3.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker05_Digit2_-8dB_SNR_3-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:5, digit_id: "2", ITI:3.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker16_Digit2_-8dB_SNR_4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:16, digit_id: "2", ITI:4}},
  {stimulus: stimDir_SiN + "STIM_Speaker05_Digit3_-8dB_SNR_2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:5, digit_id: "3", ITI:2}},
  {stimulus: stimDir_SiN + "STIM_Speaker48_Digit3_-8dB_SNR_2-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:48, digit_id: "3", ITI:2.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker33_Digit3_-8dB_SNR_2-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:33, digit_id: "3", ITI:2.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker06_Digit3_-8dB_SNR_2-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:6, digit_id: "3", ITI:2.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker10_Digit3_-8dB_SNR_2-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:10, digit_id: "3", ITI:2.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker21_Digit3_-8dB_SNR_3secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:21, digit_id: "3", ITI:3}},
  {stimulus: stimDir_SiN + "STIM_Speaker12_Digit3_-8dB_SNR_3-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:12, digit_id: "3", ITI:3.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker61_Digit3_-8dB_SNR_3-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:61, digit_id: "3", ITI:3.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker01_Digit3_-8dB_SNR_3-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:1, digit_id: "3", ITI:3.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker07_Digit3_-8dB_SNR_3-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:7, digit_id: "3", ITI:3.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker49_Digit3_-8dB_SNR_4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:49, digit_id: "3", ITI:4}},
  {stimulus: stimDir_SiN + "STIM_Speaker49_Digit4_-8dB_SNR_2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:49, digit_id: "4", ITI:2}},
  {stimulus: stimDir_SiN + "STIM_Speaker10_Digit4_-8dB_SNR_2-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:10, digit_id: "4", ITI:2.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker05_Digit4_-8dB_SNR_2-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:5, digit_id: "4", ITI:2.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker01_Digit4_-8dB_SNR_2-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:1, digit_id: "4", ITI:2.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker08_Digit4_-8dB_SNR_2-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:8, digit_id: "4", ITI:2.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker21_Digit4_-8dB_SNR_3secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:21, digit_id: "4", ITI:3}},
  {stimulus: stimDir_SiN + "STIM_Speaker61_Digit4_-8dB_SNR_3-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:61, digit_id: "4", ITI:3.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker16_Digit4_-8dB_SNR_3-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:16, digit_id: "4", ITI:3.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker07_Digit4_-8dB_SNR_3-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:7, digit_id: "4", ITI:3.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker06_Digit4_-8dB_SNR_3-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:6, digit_id: "4", ITI:3.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker12_Digit4_-8dB_SNR_4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:12, digit_id: "4", ITI:4}},
  {stimulus: stimDir_SiN + "STIM_Speaker21_Digit5_-8dB_SNR_2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:21, digit_id: "5", ITI:2}},
  {stimulus: stimDir_SiN + "STIM_Speaker12_Digit5_-8dB_SNR_2-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:12, digit_id: "5", ITI:2.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker07_Digit5_-8dB_SNR_2-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:7, digit_id: "5", ITI:2.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker14_Digit5_-8dB_SNR_2-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:14, digit_id: "5", ITI:2.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker25_Digit5_-8dB_SNR_2-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:25, digit_id: "5", ITI:2.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker16_Digit5_-8dB_SNR_3secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:16, digit_id: "5", ITI:3}},
  {stimulus: stimDir_SiN + "STIM_Speaker49_Digit5_-8dB_SNR_3-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:49, digit_id: "5", ITI:3.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker08_Digit5_-8dB_SNR_3-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:8, digit_id: "5", ITI:3.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker01_Digit5_-8dB_SNR_3-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:1, digit_id: "5", ITI:3.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker10_Digit5_-8dB_SNR_3-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:10, digit_id: "5", ITI:3.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker05_Digit5_-8dB_SNR_4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:5, digit_id: "5", ITI:4}},
  {stimulus: stimDir_SiN + "STIM_Speaker08_Digit6_-8dB_SNR_2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:8, digit_id: "6", ITI:2}},
  {stimulus: stimDir_SiN + "STIM_Speaker21_Digit6_-8dB_SNR_2-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:21, digit_id: "6", ITI:2.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker10_Digit6_-8dB_SNR_2-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:10, digit_id: "6", ITI:2.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker61_Digit6_-8dB_SNR_2-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:61, digit_id: "6", ITI:2.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker33_Digit6_-8dB_SNR_2-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:33, digit_id: "6", ITI:2.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker01_Digit6_-8dB_SNR_3secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:1, digit_id: "6", ITI:3}},
  {stimulus: stimDir_SiN + "STIM_Speaker12_Digit6_-8dB_SNR_3-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:12, digit_id: "6", ITI:3.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker16_Digit6_-8dB_SNR_3-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:16, digit_id: "6", ITI:3.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker49_Digit6_-8dB_SNR_3-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:49, digit_id: "6", ITI:3.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker48_Digit6_-8dB_SNR_3-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:48, digit_id: "6", ITI:3.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker06_Digit6_-8dB_SNR_4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:6, digit_id: "6", ITI:4}},
  {stimulus: stimDir_SiN + "STIM_Speaker25_Digit8_-8dB_SNR_2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:25, digit_id: "8", ITI:2}},
  {stimulus: stimDir_SiN + "STIM_Speaker12_Digit8_-8dB_SNR_2-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:12, digit_id: "8", ITI:2.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker10_Digit8_-8dB_SNR_2-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:10, digit_id: "8", ITI:2.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker01_Digit8_-8dB_SNR_2-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:1, digit_id: "8", ITI:2.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker21_Digit8_-8dB_SNR_2-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:21, digit_id: "8", ITI:2.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker08_Digit8_-8dB_SNR_3secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:8, digit_id: "8", ITI:3}},
  {stimulus: stimDir_SiN + "STIM_Speaker49_Digit8_-8dB_SNR_3-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:49, digit_id: "8", ITI:3.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker48_Digit8_-8dB_SNR_3-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:48, digit_id: "8", ITI:3.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker13_Digit8_-8dB_SNR_3-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:13, digit_id: "8", ITI:3.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker61_Digit8_-8dB_SNR_3-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:61, digit_id: "8", ITI:3.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker06_Digit8_-8dB_SNR_4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:6, digit_id: "8", ITI:4}},
  {stimulus: stimDir_SiN + "STIM_Speaker05_Digit9_-8dB_SNR_2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:5, digit_id: "9", ITI:2}},
  {stimulus: stimDir_SiN + "STIM_Speaker10_Digit9_-8dB_SNR_2-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:10, digit_id: "9", ITI:2.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker13_Digit9_-8dB_SNR_2-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:13, digit_id: "9", ITI:2.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker16_Digit9_-8dB_SNR_2-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:16, digit_id: "9", ITI:2.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker12_Digit9_-8dB_SNR_2-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:12, digit_id: "9", ITI:2.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker25_Digit9_-8dB_SNR_3secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:25, digit_id: "9", ITI:3}},
  {stimulus: stimDir_SiN + "STIM_Speaker07_Digit9_-8dB_SNR_3-2secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:7, digit_id: "9", ITI:3.2}},
  {stimulus: stimDir_SiN + "STIM_Speaker33_Digit9_-8dB_SNR_3-4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:33, digit_id: "9", ITI:3.4}},
  {stimulus: stimDir_SiN + "STIM_Speaker14_Digit9_-8dB_SNR_3-6secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:14, digit_id: "9", ITI:3.6}},
  {stimulus: stimDir_SiN + "STIM_Speaker61_Digit9_-8dB_SNR_3-8secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:61, digit_id: "9", ITI:3.8}},
  {stimulus: stimDir_SiN + "STIM_Speaker01_Digit9_-8dB_SNR_4secITI_16k.wav", data: {screen_id: TRIALS, dB_SNR:-8, speaker:1, digit_id: "9", ITI:4}}
];

var TRIALS = {
 type: 'audio-button-response-simple',
 data: jsPsych.timelineVariable("data"),
 stimulus: jsPsych.timelineVariable("stimulus"),
 choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
 prompt: "<p>What number was said?</p>",
 on_finish: function(data){
   if (data.button_pressed == data.digit_id){
     data.accuracy = 1
   } else {
     data.accuracy = 0
   }
   console.log('TRIALS digit ' + data.digit_id);
 }
};

var procedure_practiceSiN = {
 timeline: [fixation_cross, practice_trial_SiN, start_SiNRT]
};

var PROCEDURE = {
 timeline: [fixation_cross, TRIALS],
 // timeline: [fixation_cross, WRAPPER],
 timeline_variables: STIMULI,
 randomize_order: true,
 on_finish: function(data){
 }
};

SiN_timeline.timeline.push(instructions_SRT);
SiN_timeline.timeline.push(procedure_practiceSiN);
SiN_timeline.timeline.push(PROCEDURE);
timeline.push(SiN_timeline);
// SRT_timeline.timeline.push(instructions_SRT)
// SRT_timeline.timeline.push(SiN_timeline)


////////////////////////////////////////////////////////////////////////////////
//////////////////////// START EXPERIMENT //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function start_SiNpilotTestAsync() {
  console.log("startExp reached")

  var audioFiles = [stimDir_calib + "partyCrowd11sec_eq.wav",
    stimDir_SiN + "PRACTICE_Speaker33_Digit2_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker13_Digit0_-8dB_SNR_2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker61_Digit0_-8dB_SNR_2-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker49_Digit0_-8dB_SNR_2-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker25_Digit0_-8dB_SNR_2-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker01_Digit0_-8dB_SNR_2-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker48_Digit0_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker06_Digit0_-8dB_SNR_3-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker05_Digit0_-8dB_SNR_3-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker21_Digit0_-8dB_SNR_3-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker14_Digit0_-8dB_SNR_3-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker12_Digit0_-8dB_SNR_4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker07_Digit1_-8dB_SNR_2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker21_Digit1_-8dB_SNR_2-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker14_Digit1_-8dB_SNR_2-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker33_Digit1_-8dB_SNR_2-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker05_Digit1_-8dB_SNR_2-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker01_Digit1_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker06_Digit1_-8dB_SNR_3-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker13_Digit1_-8dB_SNR_3-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker16_Digit1_-8dB_SNR_3-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker25_Digit1_-8dB_SNR_3-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker61_Digit1_-8dB_SNR_4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker01_Digit2_-8dB_SNR_2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker33_Digit2_-8dB_SNR_2-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker21_Digit2_-8dB_SNR_2-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker49_Digit2_-8dB_SNR_2-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker25_Digit2_-8dB_SNR_2-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker12_Digit2_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker10_Digit2_-8dB_SNR_3-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker13_Digit2_-8dB_SNR_3-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker61_Digit2_-8dB_SNR_3-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker05_Digit2_-8dB_SNR_3-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker16_Digit2_-8dB_SNR_4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker05_Digit3_-8dB_SNR_2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker48_Digit3_-8dB_SNR_2-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker33_Digit3_-8dB_SNR_2-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker06_Digit3_-8dB_SNR_2-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker10_Digit3_-8dB_SNR_2-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker21_Digit3_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker12_Digit3_-8dB_SNR_3-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker61_Digit3_-8dB_SNR_3-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker01_Digit3_-8dB_SNR_3-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker07_Digit3_-8dB_SNR_3-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker49_Digit3_-8dB_SNR_4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker49_Digit4_-8dB_SNR_2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker10_Digit4_-8dB_SNR_2-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker05_Digit4_-8dB_SNR_2-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker01_Digit4_-8dB_SNR_2-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker08_Digit4_-8dB_SNR_2-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker21_Digit4_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker61_Digit4_-8dB_SNR_3-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker16_Digit4_-8dB_SNR_3-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker07_Digit4_-8dB_SNR_3-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker06_Digit4_-8dB_SNR_3-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker12_Digit4_-8dB_SNR_4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker21_Digit5_-8dB_SNR_2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker12_Digit5_-8dB_SNR_2-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker07_Digit5_-8dB_SNR_2-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker14_Digit5_-8dB_SNR_2-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker25_Digit5_-8dB_SNR_2-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker16_Digit5_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker49_Digit5_-8dB_SNR_3-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker08_Digit5_-8dB_SNR_3-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker01_Digit5_-8dB_SNR_3-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker10_Digit5_-8dB_SNR_3-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker05_Digit5_-8dB_SNR_4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker08_Digit6_-8dB_SNR_2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker21_Digit6_-8dB_SNR_2-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker10_Digit6_-8dB_SNR_2-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker61_Digit6_-8dB_SNR_2-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker33_Digit6_-8dB_SNR_2-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker01_Digit6_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker12_Digit6_-8dB_SNR_3-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker16_Digit6_-8dB_SNR_3-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker49_Digit6_-8dB_SNR_3-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker48_Digit6_-8dB_SNR_3-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker06_Digit6_-8dB_SNR_4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker25_Digit8_-8dB_SNR_2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker12_Digit8_-8dB_SNR_2-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker10_Digit8_-8dB_SNR_2-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker01_Digit8_-8dB_SNR_2-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker21_Digit8_-8dB_SNR_2-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker08_Digit8_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker49_Digit8_-8dB_SNR_3-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker48_Digit8_-8dB_SNR_3-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker13_Digit8_-8dB_SNR_3-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker61_Digit8_-8dB_SNR_3-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker06_Digit8_-8dB_SNR_4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker05_Digit9_-8dB_SNR_2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker10_Digit9_-8dB_SNR_2-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker13_Digit9_-8dB_SNR_2-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker16_Digit9_-8dB_SNR_2-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker12_Digit9_-8dB_SNR_2-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker25_Digit9_-8dB_SNR_3secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker07_Digit9_-8dB_SNR_3-2secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker33_Digit9_-8dB_SNR_3-4secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker14_Digit9_-8dB_SNR_3-6secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker61_Digit9_-8dB_SNR_3-8secITI_16k.wav",
    stimDir_SiN + "STIM_Speaker01_Digit9_-8dB_SNR_4secITI_16k.wav"
  ];

  /* start the experiment */
  jsPsych.init({
   preload_audio: audioFiles,
   timeline: timeline,
   // timeline: calib_timeline,
    use_webaudio: true,
    // use_webaudio: false,
    on_interaction_data_update: function(data) {
      var cTrial = jsPsych.currentTrial();
    //   // cTrial.data.event = data.event;
      cTrial.event = data.event;
    },
    on_finish: function() {
      $.ajax({
        type: "POST",
        url: "/experiment-data",
        data: JSON.stringify(jsPsych.data.get().values()),
        contentType: "application/json"
      })

      .done(function(){
        // jsPsych.data.displayData();
        window.location.href = "finish";
        // alert("You have completed the experiment and the data have been saved!");
      })

      .fail(function(){
        alert("Problem occurred while writing data to Dropbox. " +
              "Data will be saved to your computer. " +
              "Please contact the experimenter!");
        var csv = jsPsych.data.get().csv();
        var filename = "SiNpilotTestData" + jsPsych.data.get().values()[0].part_ID + "_" + DATE + ".csv";
        // var filename = "ACexp_part" + jsPsych.data.get().values()[0].Part_ID + "_" + " + DATE + " + ".csv";
        downloadCSV(csv,filename);
        window.location.href = "finish";
      })

      // jsPsych.data.displayData();
    }
  });
};
