import React from 'react';
import Button from 'material-ui/Button';

import Slider from 'react-rangeslider'
import Selector from './Selector'
// To include the default styles
import 'react-rangeslider/lib/index.css'

const keys = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'Gb',
  'Db',
  'Ab',
  'Eb',
  'Bb',
  'F'
];
const intervals = ['Whole Note', 'Half Note', 'Quarter Note', 'Eighth Note', "Sixteenth Note"];
const note_values = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th'
]

var patterns = [
  {
    title: "Scale",
    parameters: [
      {
        title: "Root Note",
        values: note_values
      }
    ]
  }, {
    title: "Interval",
    parameters: [
      {
        title: "Pedal Tone",
        values: note_values
      }
    ]
  }
]

export default class Scale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      bpm: 120,
      key: 'C',
      interval: 'Half Note',
      pattern: 'Scale'
    }
  }
  toggleState = (key) => {
    // Helper method to bind buttons to toggle state
    return () => {
      this.doSetStateValue(key, !this.state[key]);
    }
  }
  doSetStateValue = (key, value) => {
    var toset = {};
    toset[key] = value;
    console.log("Setting state " + key + " to " + value)
    this.setState({
      ...this.state,
      ...toset
    })
  }
  setStateValue = (key) => {
    return (value) => {
      this.doSetStateValue(key, value);
    }
  }
  render() {
    var s = this.state;

    var pattern = patterns[
      patterns.findIndex(p => p.title === s.pattern)
    ]

    var paramhtml = (param) => {
      if(!s[param.title]) {
        s[param.title] = param.values[0];
      }
      return (
        <Selector key={param.title} onChange={this.setStateValue(param.title)} values={param.values} value={s[param.title]} title={param.title}/>
      )
    }

    var patternparams = pattern.parameters.map(paramhtml)

    var patternhtml = (
      <div>
      <h1>{pattern.title}</h1>
      {patternparams}
    </div>
    )

    // The patterns are defined outside

    return (
      <div>
        <pre>
        {JSON.stringify(s,null,2)}
      </pre>
        <Button onClick={this.toggleState('playing')} raised>{s.playing
            ? "Play"
            : "Pause"}</Button>
        <Slider labels={{
          120: "BPM"
        }} min={90} max={160} value={s.bpm} onChange={this.setStateValue('bpm')}/>
        <Selector onChange={this.setStateValue('key')} values={keys} value={s.key} title="Key Signature"/>
        <Selector onChange={this.setStateValue('interval')} values={intervals} value={s.interval} title="Intervals"/>
        <Selector onChange={this.setStateValue('pattern')} values={patterns.map(p => p.title)} value={s.pattern} title="Patterns"/>
        {patternhtml}
      </div>
    );
  }
}
