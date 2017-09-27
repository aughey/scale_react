import Tone from 'tone'

export function scale(props) {
  console.log("Making scale")
  var note = props.key + props.octave;
  var starting_note = props["Root Note_index"];
  var count = props.count
  var pattern = [
    2,
    2,
    1,
    2,
    2,
    2,
    1
  ];
  var pattern_index = 0;

  note = new Tone.Frequency(note);

  // Push through to find the actual starting note for this key
  var i,
    t;
  for (i = 0; i < starting_note; ++i) {
    t = pattern[pattern_index];
    note = note.transpose(t);
    pattern_index = (pattern_index + 1) % pattern.length;
  }

  var res = [note.toNote()];
  for (i = 0; i < count; ++i) {
    for (var p = 0; p < pattern.length; ++p) {
      t = pattern[pattern_index];
      pattern_index = (pattern_index + 1) % pattern.length;
      note = note.transpose(t);
      res.push(note.toNote());
    }
  }
  return res;
}

export function tonalizations(props) {
  return 'G4 B4 D5 G5 A5 B5 A5 G5 D5 E5 D5 B4 G4 D4 B3 D4 G3'.split(' ');
}

export function drone(props) {
  return [props.Note + props.octave]
}

export function interval(props) {
  console.log("Making interval")
  console.log(props);
  var s = scale({
    ...props,
    "Root Note_index": 0
  }); // Force the scale to start on the root
  var pedal_index = props["Pedal Tone_index"];
  var repeat = s[pedal_index];
  var out = [];
  s.forEach(function(n) {
    if (n === repeat) {
      return;
    }
    for (var i = 0; i < props["Repeat Count"]; ++i) {
      out.push(repeat);
      out.push(n);
    }
  });
  return out;
}
