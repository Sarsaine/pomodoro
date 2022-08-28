import { Injectable } from '@angular/core';
import { wait } from "../utils/wait";

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private audioContext: AudioContext;

  private oscillator: OscillatorNode;

  private gain: GainNode;

  private state: 'play' | 'stopping' | 'stop' = 'stop';

  // TODO: Make a match table between notes and frequencies
  private static WestminsterQuarters = [
      "830.61:1000;739.99:1000;659.26:1000;493.88:3000",
      "659.26:1000;830.61:1000;739.99:1000;493.88:3000",
      "659.26:1000;739.99:1000;830.61:1000;659.26:3000",
      "830.61:1000;659.26:1000;739.99:1000;493.88:3000",
      "493.88:1000;739.99:1000;830.61:1000;659.26:3000",
    ];

  constructor() {
    this.audioContext = new AudioContext();
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.connect(this.audioContext.destination);

    this.gain = this.audioContext.createGain();
    this.gain.connect(this.audioContext.destination);
    this.gain.gain.value = 0.1;

    this.oscillator.type = 'triangle';
    this.oscillator.frequency.value = 0;
    this.oscillator.start();

    // TODO: Find better event to resume AudioContext
    document.querySelector('body').addEventListener("click", async () => {
      console.log("Audio Context Resume")
      await this.audioContext.resume();
    })

  }

  stopAlarm() {
    if (this.state === 'play') {
      this.state = 'stopping';
    } else {
      this.oscillator.frequency.value = 0;
    }
  }

  private async waitForStop() {
    while (this.state !== 'stop') {
      this.stopAlarm();
      await wait(100);
    }
  }

  async breakAlarm() {
    await this.play(this.compose(SoundService.WestminsterQuarters, [2, 3]), 2)
  }

  async workAlarm() {
    await this.play(this.compose(SoundService.WestminsterQuarters, [2, 3, 4, 5]), 2)
  }

  private compose(partition, list: number[], strokes: number = 0): string {
    return [
        ...list.map(i => partition[i - 1]),
        ...[...Array(strokes).keys()].map(_ => '329.63:5000;0:1000'),
      ].join(';');
  }

  private async play(melody: string, speedModifier: number = 1, replay: boolean = false, delay: number = 0) {
    await this.waitForStop();
    const notes = melody.split(';').map(note => note.split(':').map(p => p.trim()));
    this.state = 'play';

    do {
      for (let i = 0; i < notes.length && this.state === 'play'; i++) {
        this.oscillator.frequency.value = Number(notes[i][0]);
        await wait(Number(notes[i][1]) / speedModifier);
      }
      this.oscillator.frequency.value = 0;
      if (replay) {
        await wait(delay);
      }
    } while (replay)

    this.stopAlarm();
    this.state = 'stop';
  }
}
