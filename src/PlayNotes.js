import React from 'react';
import Button from 'material-ui/Button';
import Tone from 'tone'

export default class PlayNotes extends React.Component {
  constructor(props) {
    super(props);
    this.synth = new Tone.Synth({
      envelope: {
        attack: 0.01,
        decay: 100,
        sustain: 1
      }
    }).toMaster();

    this.state = {
      playing: true
    }

    console.log("Constructor")
    this.createPattern(props);

    Tone.Transport.start()
  }
  createPattern = (props) => {
    console.log("Creating pattern")
    if (this.pattern) {
      this.pattern.stop();
    }

    var notes = props.notes;
    var interval = props.interval;
    var synth = this.synth;
    var pattern = new Tone.Pattern(function(time, note) {
      synth.triggerAttackRelease(note, "" + interval + "n", time);
    }, notes, "up");
    pattern.interval = "" + interval + 'n'
    Tone.Transport.bpm.value = props.bpm;

    this.pattern = pattern;

    if (this.state.playing) {
      pattern.start()
    }
  }
  componentDidUpdate(oldprops) {
    this.createPattern(this.props);
  }
  componentWillUnmount() {
    this.pattern.stop();
    this.pattern = null;
    Tone.Transport.stop();
  }
  togglePlay = () => {
    if (this.state.playing) {
      this.pattern.stop();
    } else {
      this.pattern.start();
    }
    this.setState({
      playing: !this.state.playing
    })

  }
  render() {
    return (
      <Button raised onClick={this.togglePlay}>{this.state.playing
          ? "Pause"
          : "Play"}</Button>
    )
  }
}
