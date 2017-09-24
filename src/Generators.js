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
  var i,t;
  for (i = 0; i < starting_note; ++i) {
    t = pattern[pattern_index];
    note = note.transpose(t);
    pattern_index = (pattern_index + 1) % pattern.length;
  }

  var res = [note.toNote()];
  for ( i = 0; i < count; ++i) {
    for (var p = 0; p < pattern.length; ++p) {
      t = pattern[pattern_index];
      pattern_index = (pattern_index + 1) % pattern.length;
      note = note.transpose(t);
      res.push(note.toNote());
    }
  }
  return res;
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
      var out = [repeat];
      s.forEach(function(n) {
        if(n === repeat) {
          return;
        }
        out.push(n);
        if(n !== repeat) {
          out.push(repeat);
        }
      });
      return out;
}
