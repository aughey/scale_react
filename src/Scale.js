import React from 'react';
import Button from 'material-ui/Button';

import Slider from 'react-rangeslider'
import Selector from './Selector'
// To include the default styles
import 'react-rangeslider/lib/index.css'
import Store from 'store'
import * as Generators from './Generators'
import DrawScore from './DrawScore'
import Checkbox from 'material-ui/Checkbox';
import {FormGroup, FormControlLabel} from 'material-ui/Form';
import PlayNotes from './PlayNotes'

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

const allNotes = ('c c# d d# e f f# g g# a a# b'.toUpperCase().split(' '))

var patterns = [
  {
    title: "Scale",
    generate: Generators.scale,
    parameters: [
      {
        title: "Root Note",
        values: note_values
      }
    ]
  }, {
    title: "Interval",
    generate: Generators.interval,
    parameters: [
      {
        title: "Pedal Tone",
        values: note_values
      },
      {
        title: "Repeat Count",
        values: [1,2,3,4]
      }
    ]
  },
  {
    title: "Tonalizations",
    generate: Generators.tonalizations,
    parameters: []
  },
  {
    title: "Drone",
    generate: Generators.drone,
    parameters: [
      {
      title: "Note",
      values: allNotes
}
    ]
  }
]

export default class Scale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bpm: 120,
      key: 'C',
      interval: 'Half Note',
      pattern: 'Scale',
      octave: 4,
      count: 1
    }

    patterns.forEach(p => {
      p.parameters.forEach(param => {
        var s = this.state;
        if (!s[param.title]) {
          s[param.title] = param.values[0];
          s[param.title + "_index"] = 0;
        }
      })
    })

    var saved_data = Store.get('practice_data_react');
    if (saved_data) {
      this.state = {
        ...this.state,
        ...saved_data
      }
    }
  }
  toggleState = (key) => {
    // Helper method to bind buttons to toggle state
    return () => {
      this.doSetStateValue(key, !this.state[key]);
    }
  }
  doSetStateValue = (key, value) => {
    console.log("Setting state value " + key + " to " + value)
    var toset = {};
    toset[key] = value;

    this.setState((prevstate) => {
      var newstate = {
        ...prevstate,
        ...toset
      };
      Store.set('practice_data_react', newstate);
      return newstate;
    })
  }
  setStateValue = (key) => {
    return (value) => {
      this.doSetStateValue(key, value);
    }
  }
  render() {
    var s = this.state;

    var interval_int = parseInt(Math.pow(2, intervals.indexOf(s.interval)), 10);

    var pattern = patterns[patterns.findIndex(p => p.title === s.pattern)]

    var paramhtml = (param) => {
      return (<Selector key={param.title} onChangeIndex={this.setStateValue(param.title + "_index")} onChange={this.setStateValue(param.title)} values={param.values} value={s[param.title]} title={param.title}/>)
    }

    var patternparams = pattern.parameters.map(paramhtml)

    var patternhtml = (
      <div>
        <h1>{pattern.title}</h1>
        {patternparams}
      </div>
    )

    var notes = pattern.generate(s);

    if (s.updown) {
      notes = notes.slice().concat(notes.slice().reverse());
    }

    // The patterns are defined outside

    return (
      <div>
        <Slider labels={{
          120: "BPM"
        }} min={90} max={160} value={s.bpm} onChange={this.setStateValue('bpm')}/>
        <Selector onChange={this.setStateValue('key')} values={keys} value={s.key} title="Key Signature"/>
        <Selector onChange={this.setStateValue('interval')} values={intervals} value={s.interval} title="Note Length"/>
        <Selector onChange={this.setStateValue('octave')} values={[2, 3, 4, 5]} value={s.octave} title="Octave"/>
        <Selector onChange={this.setStateValue('count')} values={[1, 2, 3]} value={s.count} title="Number of octaves"/>
        <FormControlLabel control={< Checkbox checked = {
          s.updown
        }
        onChange = {
          this.toggleState('updown')
        } />} label="Up and Down"/>
        <Selector onChange={this.setStateValue('pattern')} values={patterns.map(p => p.title)} value={s.pattern} title="Patterns"/> {patternhtml}
        <PlayNotes bpm={s.bpm} interval={interval_int} notes={notes}/>
        <DrawScore keysig={s.key} interval={interval_int} notes={notes}/>
      </div>
    );
  }
}
