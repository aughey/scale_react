import React from 'react';
import Button from 'material-ui/Button';


export default class Selector extends React.PureComponent {
  render() {
    var props = this.props
    var index = props.values.indexOf(props.value);
    function dec() {
      index = index - 1;
      if(index < 0) {
        index = props.values.length-1
      }
      props.onChange(props.values[index])
      props.onChangeIndex(index);
    }
    function incr() {
      index = (index + 1) % props.values.length;
      props.onChange(props.values[index],index)
      props.onChangeIndex(index);
    }
    return (
      <div>
        <h4>{props.title}</h4>
        <Button raised onClick={dec}>Back</Button>{props.value}<Button raised onClick={incr}>Forward</Button>
      </div>
    );
  }
}

Selector.defaultProps = {
  onChange: () => {},
  onChangeIndex: () => {}
}
