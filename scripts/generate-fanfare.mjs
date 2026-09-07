/**
 * Generates assets/fanfare.wav — the sound played when a puzzle is solved.
 *
 * The asset is synthesised rather than downloaded so that its provenance is
 * unambiguous: it is our own work, with no third-party licence attached.
 * Re-run with `node scripts/generate-fanfare.mjs` to regenerate it.
 */

const SAMPLE_RATE = 44100;
const BITS_PER_SAMPLE = 16;
const CHANNELS = 1;

/** Equal-tempered pitches, in hertz. */
const PITCH = { C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5 };

/** One note: start time and duration in seconds, plus a peak amplitude. */
const SCORE = [
  { freq: PITCH.C5, start: 0.0, duration: 0.16, gain: 0.5 },
  { freq: PITCH.E5, start: 0.14, duration: 0.16, gain: 0.5 },
  { freq: PITCH.G5, start: 0.28, duration: 0.16, gain: 0.5 },
  // Final chord: the octave on top, the triad held underneath.
  { freq: PITCH.C6, start: 0.42, duration: 0.95, gain: 0.5 },
  { freq: PITCH.G5, start: 0.42, duration: 0.95, gain: 0.28 },
  { freq: PITCH.E5, start: 0.42, duration: 0.95, gain: 0.22 },
];

const DURATION = 1.45;

/**
 * A brass-like timbre: a handful of harmonics with falling amplitude. Richer
 * than a sine, and cheaper than anything that would need a dependency.
 */
function timbre(freq, t) {
  let sample = 0;
  for (let harmonic = 1; harmonic <= 6; harmonic++) {
    sample += Math.sin(2 * Math.PI * freq * harmonic * t) / harmonic;
  }
  return sample / 2.45; // normalised so the harmonic sum stays within [-1, 1]
}

/** Percussive attack, gentle decay — no clicks at either end. */
function envelope(t, duration) {
  const attack = 0.012;
  const release = 0.09;
  if (t < 0) return 0;
  if (t > duration) return 0;
  if (t < attack) return t / attack;
  const remaining = duration - t;
  const tail = remaining < release ? remaining / release : 1;
  return tail * Math.exp(-1.6 * (t - attack));
}

function renderSamples() {
  const total = Math.floor(SAMPLE_RATE * DURATION);
  const samples = new Float64Array(total);
  for (const note of SCORE) {
    const from = Math.floor(note.start * SAMPLE_RATE);
    const to = Math.min(total, Math.floor((note.start + note.duration) * SAMPLE_RATE));
    for (let i = from; i < to; i++) {
      const t = (i - from) / SAMPLE_RATE;
      samples[i] += note.gain * timbre(note.freq, t) * envelope(t, note.duration);
    }
  }
  // Normalise to just under full scale, so no sample clips.
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const scale = peak > 0 ? 0.89 / peak : 1;
  for (let i = 0; i < total; i++) samples[i] *= scale;
  return samples;
}

function toWav(samples) {
  const blockAlign = (CHANNELS * BITS_PER_SAMPLE) / 8;
  const dataSize = samples.length * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8, 'ascii');
  buffer.write('fmt ', 12, 'ascii');
  buffer.writeUInt32LE(16, 16); // PCM header size
  buffer.writeUInt16LE(1, 20); // format: uncompressed PCM
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * blockAlign, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  buffer.write('data', 36, 'ascii');
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * blockAlign);
  }
  return buffer;
}

const wav = toWav(renderSamples());
const target = new URL('../assets/fanfare.wav', import.meta.url);
const { writeFileSync } = await import('node:fs');
writeFileSync(target, wav);
console.log(`Wrote ${target.pathname} — ${wav.length} bytes, ${DURATION}s`);
