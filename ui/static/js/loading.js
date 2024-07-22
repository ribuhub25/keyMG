const frequencyBase = 560.0;
const frequencyThreshold = 5.0;
const frequencyStep = 100.0;
const gainOffValue = 0.00001;
const vinylGainValue = 0.2;
const oscillatorGainValue = 0.15;

let currentFrequency = frequencyBase;
let scratching = false;
let record;
let recordGroup;
let surfaceGroup;
let angle = 0;
let rotationStart = 0;
let rotationOffset = 0;
let lastX = 0;
let lastY = 0;
let size = 512;

let context;
let oscillator;
let vinylGain;
let oscillatorGain;

function onMouseDown(ev) {
  vinylGain.gain.value = gainOffValue;
  scratching = true;
  lastX = ev.offsetX;
  lastY = ev.offsetY;
}

function onMouseUp() {
  oscillatorGain.gain.cancelScheduledValues(context.currentTime);
  oscillatorGain.gain.value = gainOffValue;
  vinylGain.gain.value = vinylGainValue;
  scratching = false;
  rotationOffset = angle;
  rotationStart = -1;
  rotateRecord();
}

function onMouseMove(ev) {
  if (scratching) {
    oscillatorGain.gain.cancelScheduledValues(context.currentTime);

    const deltaX = ev.offsetX - lastX;
    const deltaY = ev.offsetY - lastY;

    let rotation = 0;
    let frequency = frequencyBase;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const direction = ev.offsetY > size / 2.0 ? -1.0 : 1.0;
      rotation = (deltaX / size) * 180.0 * direction;
      frequency += (Math.abs(deltaX) - frequencyThreshold) * frequencyStep;
    } else {
      const direction = ev.offsetX > size / 2.0 ? 1.0 : -0.5;
      rotation = (deltaY / size) * 180.0 * direction;
      frequency += (Math.abs(deltaY) - frequencyThreshold) * frequencyStep;
    }

    oscillator.frequency.exponentialRampToValueAtTime(frequency, context.currentTime + 0.02)
    oscillatorGain.gain.value = oscillatorGainValue;

    angle += rotation;
    recordGroup.setAttribute('transform', 'rotate(' + angle + ', 256, 256)');
    surfaceGroup.setAttribute('transform', 'rotate(' + angle + ', 256, 256)');

    oscillatorGain.gain.setValueAtTime(gainOffValue, context.currentTime + 0.06);

    lastX = ev.offsetX;
    lastY = ev.offsetY;
  }
}

function rotateRecord(timestamp) {
  if (!scratching) {
    if (timestamp >= 0) {
      if (rotationStart < 0) {
        rotationStart = timestamp;
      }

      angle = (((timestamp - rotationStart) / 5.0) % 360.0) + rotationOffset;
      recordGroup.setAttribute('transform', 'rotate(' + angle + ', 256, 256)');
      surfaceGroup.setAttribute('transform', 'rotate(' + angle + ', 256, 256)');
    }
    window.requestAnimationFrame(rotateRecord);
  }
}

function disk() {
  context = new AudioContext();

  // setup 2-channel audio for simulated vinyl "silence"
  const numChannels = 2;

  // set frame count to equivalent of one rotation at 33 rpm
  const frameCount = context.sampleRate * 1.8;

  // audio data buffer
  let dataBuffer = context.createBuffer(numChannels, frameCount, context.sampleRate);

  // create audio data: channel 0 - white noise, channel 1 - pops
  let channelData0 = dataBuffer.getChannelData(0);
  let channelData1 = dataBuffer.getChannelData(1);

  let popCount = 0; // only used for channel 1

  for (let i = 0; i < frameCount; i++) {
    const rVal = Math.random() * 0.05 - 0.025;

    channelData0[i] = i < frameCount / 2.0 ? rVal * 0.8 : rVal;
    channelData1[i] = popCount < 3 && Math.abs(rVal) > 0.0249975 ? (rVal < 0 ? -0.9 : 0.9) : 0.0;
  }

  // create AudioBufferSourceNode and set data buffer
  let vinylSource = context.createBufferSource();
  vinylSource.buffer = dataBuffer;

  // create gain for vinyl audio and connect
  vinylGain = context.createGain();
  vinylGain.gain.value = vinylGainValue;

  vinylSource.connect(vinylGain);
  vinylGain.connect(context.destination);
  vinylSource.loop = true;

  // setup oscillator for "scratching" sounds
  oscillator = context.createOscillator();
  oscillator.frequency.value = frequencyBase;
  oscillator.type = 'sawtooth';

  oscillatorGain = context.createGain();
  oscillatorGain.gain.value = gainOffValue;

  oscillator.connect(oscillatorGain);
  oscillatorGain.connect(context.destination);

  // start record svg rotation
  record = document.getElementById('record_svg');
  recordGroup = document.getElementById('record_group');
  surfaceGroup = document.getElementById('surface_group');
  rotateRecord(0);

  // register events
  if(window.PointerEvent) {
    record.addEventListener('pointerdown', onMouseDown);
    document.addEventListener('pointerup', onMouseUp);
    document.addEventListener('pointermove', onMouseMove);
  }
  else {
    // provide fallback if pointer events are not supported
    record.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
  }
};

const loadingContainer = document.querySelector(".loading");
const loadingText = document.querySelector(".loading-text");

const loadingAlternatives = [
  "Spinning up the beats",
  "Tuning in the sound waves",
  "Syncing the rhythms",
  "Setting the stage",
  "Mixing the tracks",
  "Preparing the audio journey",
  "Building up the energy",
  "Sampling the vibes",
  "Generating sonic magic",
  "Dropping the bass"
];
let currentIndexLoading = 0;
let loadingInterval;

function updateLoadingText() {
  loadingText.textContent = loadingAlternatives[currentIndexLoading];
  currentIndexLoading = (currentIndexLoading + 1) % loadingAlternatives.length;
}

function startLoading() {
  loadingContainer.style.display = "block";
  updateLoadingText();
  disk();
  loadingInterval = setInterval(updateLoadingText, 2000);
}

function stopLoading() {
  loadingContainer.style.display = "none";
  clearInterval(loadingInterval);
}