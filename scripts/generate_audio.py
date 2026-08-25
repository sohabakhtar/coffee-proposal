import wave
import math
import struct
import os

os.makedirs('public/audio', exist_ok=True)
output_path = 'public/audio/romantic-instrumental.mp3'
output_wav = 'public/audio/romantic-instrumental.wav'

sample_rate = 44100
bpm = 82
beat_duration = 60.0 / bpm

# Notes frequencies
notes_freq = {
    'C2': 65.41, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50
}

# Romantic chord progression (Tum Se Hi / Bollywood Romantic feel: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4/G)
chords = [
    # Bar 1: Cmaj9 (C, G, B, E, D)
    {'bass': 'C2', 'arpeggio': ['C3', 'G3', 'B3', 'E4', 'G4', 'D5', 'G4', 'E4']},
    # Bar 2: Am9 (A, E, G, C, B)
    {'bass': 'A2', 'arpeggio': ['A2', 'E3', 'A3', 'C4', 'E4', 'B4', 'C5', 'E4']},
    # Bar 3: Fmaj9 (F, C, E, A, G)
    {'bass': 'F2', 'arpeggio': ['F2', 'C3', 'A3', 'E4', 'A4', 'G5', 'E4', 'C4']},
    # Bar 4: Gsus4 -> G (G, D, G, C -> B, D)
    {'bass': 'G2', 'arpeggio': ['G2', 'D3', 'G3', 'C4', 'D4', 'B4', 'G4', 'D4']},
    # Bar 5: Em7
    {'bass': 'E2', 'arpeggio': ['E2', 'B2', 'G3', 'D4', 'G4', 'B4', 'G4', 'D4']},
    # Bar 6: Am7 / Fmaj7
    {'bass': 'A2', 'arpeggio': ['A2', 'E3', 'C4', 'G4', 'C5', 'E5', 'C5', 'G4']},
    # Bar 7: Dm9
    {'bass': 'D3', 'arpeggio': ['D3', 'A3', 'F4', 'C5', 'E5', 'F5', 'E5', 'C5']},
    # Bar 8: G7 / Gsus4 resolving warmly
    {'bass': 'G2', 'arpeggio': ['G2', 'D3', 'B3', 'F4', 'G4', 'D5', 'B4', 'G4']},
]

# Romantic vocal-like piano lead melody notes: (time_in_beats, note, duration, velocity)
lead_melody = [
    # Phrase 1: "Tum Se Hi..." gentle opening
    (0.0, 'E5', 1.5, 0.8),
    (1.5, 'D5', 0.5, 0.7),
    (2.0, 'C5', 2.0, 0.85),
    (4.0, 'B4', 1.5, 0.75),
    (5.5, 'A4', 0.5, 0.7),
    (6.0, 'G4', 2.0, 0.8),
    
    # Phrase 2: Rising emotion
    (8.0, 'A4', 1.0, 0.75),
    (9.0, 'C5', 1.0, 0.8),
    (10.0, 'E5', 2.0, 0.9),
    (12.0, 'D5', 1.5, 0.85),
    (13.5, 'C5', 0.5, 0.75),
    (14.0, 'D5', 2.0, 0.85),

    # Phrase 3: Climax warmth
    (16.0, 'G5', 2.0, 0.95),
    (18.0, 'E5', 1.5, 0.85),
    (19.5, 'D5', 0.5, 0.75),
    (20.0, 'C5', 2.0, 0.9),
    (22.0, 'B4', 1.0, 0.75),
    (23.0, 'C5', 1.0, 0.8),
    
    # Phrase 4: Tender resolution
    (24.0, 'D5', 2.0, 0.85),
    (26.0, 'C5', 1.5, 0.8),
    (27.5, 'B4', 0.5, 0.7),
    (28.0, 'C5', 4.0, 0.9),
]

total_bars = len(chords)
total_beats = total_bars * 4
total_duration = total_beats * beat_duration + 3.0 # plus reverb tail
total_samples = int(total_duration * sample_rate)

left_channel = [0.0] * total_samples
right_channel = [0.0] * total_samples

def render_note(freq, start_time, duration, volume, pan=0.5, timbre='piano'):
    start_sample = int(start_time * sample_rate)
    num_samples = int(duration * sample_rate)
    
    for i in range(num_samples):
        idx = start_sample + i
        if idx >= total_samples:
            break
            
        t = i / sample_rate
        
        # Piano ADSR envelope
        if t < 0.015:
            env = t / 0.015
        elif t < 0.1:
            env = 1.0 - (1.0 - 0.7) * ((t - 0.015) / 0.085)
        else:
            # exponential decay
            decay_rate = 1.8 if timbre == 'melody' else 2.2
            env = 0.7 * math.exp(-decay_rate * (t - 0.1))
            
        # Add overtone harmonics for rich acoustic piano / Rhodes feel
        h1 = math.sin(2.0 * math.pi * freq * t)
        h2 = 0.45 * math.sin(2.0 * math.pi * freq * 2.0 * t)
        h3 = 0.25 * math.sin(2.0 * math.pi * freq * 3.0 * t)
        h4 = 0.12 * math.sin(2.0 * math.pi * freq * 4.0 * t)
        h5 = 0.06 * math.sin(2.0 * math.pi * freq * 5.0 * t)
        
        # Gentle warmth / subtle detune chorus
        sub = 0.15 * math.sin(2.0 * math.pi * (freq * 1.002) * t)
        
        sample = (h1 + h2 + h3 + h4 + h5 + sub) * env * volume
        
        left_channel[idx] += sample * (1.0 - pan)
        right_channel[idx] += sample * pan

# Render Bass & Arpeggio Chords
for bar_idx, chord in enumerate(chords):
    bar_start_beat = bar_idx * 4.0
    bar_start_time = bar_start_beat * beat_duration
    
    # Deep warm bass note
    bass_f = notes_freq.get(chord['bass'], 100.0)
    render_note(bass_f, bar_start_time, beat_duration * 3.8, 0.45, pan=0.5, timbre='bass')
    
    # 8-note arpeggio pattern per bar (eighth notes)
    arp_notes = chord['arpeggio']
    for step_idx, note_name in enumerate(arp_notes):
        step_time = bar_start_time + (step_idx * (beat_duration * 0.5))
        freq = notes_freq.get(note_name, 261.63)
        p = 0.35 + 0.3 * (step_idx % 2) # subtle stereo panning
        render_note(freq, step_time, beat_duration * 1.8, 0.3, pan=p, timbre='arpeggio')

# Render Lead Melody
for beat_pos, note_name, dur_beats, vel in lead_melody:
    start_t = beat_pos * beat_duration
    freq = notes_freq.get(note_name, 523.25)
    render_note(freq, start_t, dur_beats * beat_duration + 0.8, vel * 0.55, pan=0.52, timbre='melody')
    # Soft upper octave sparkle
    render_note(freq * 2.0, start_t, (dur_beats * beat_duration) * 0.5, vel * 0.12, pan=0.6, timbre='melody')

# Apply Reverb (Feedback Delay Network simulation)
delay_samples_1 = int(0.28 * sample_rate)
delay_samples_2 = int(0.42 * sample_rate)
wet = 0.28

for i in range(total_samples):
    if i >= delay_samples_1:
        left_channel[i] += right_channel[i - delay_samples_1] * wet * 0.5
    if i >= delay_samples_2:
        right_channel[i] += left_channel[i - delay_samples_2] * wet * 0.5

# Normalize audio
max_val = 0.0001
for i in range(total_samples):
    max_val = max(max_val, abs(left_channel[i]), abs(right_channel[i]))

gain = 0.92 / max_val

# Write WAV file
with wave.open(output_wav, 'wb') as wav_file:
    wav_file.setnchannels(2)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    
    frames = bytearray()
    for i in range(total_samples):
        l = max(-32767, min(32767, int(left_channel[i] * gain * 32767.0)))
        r = max(-32767, min(32767, int(right_channel[i] * gain * 32767.0)))
        frames.extend(struct.pack('<hh', l, r))
        
    wav_file.writeframes(frames)

print(f"Generated {output_wav} successfully, duration: {total_duration:.2f}s")

# Also write as mp3 or copy so both paths work
import shutil
shutil.copyfile(output_wav, output_path)
print(f"Saved copy to {output_path}")
