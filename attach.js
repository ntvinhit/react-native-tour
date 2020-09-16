import React from 'react';
import { View } from 'react-native';
import { Consumer } from './context';

let timer;

export default class Attach extends React.Component {
  render() {
    const { center, name, children, style } = this.props;
    if (!name) return children;

    return (
      <Consumer>
        {({ onLayout, step }) => {
          if (step.name !== name) return children;

          const newChildren = React.cloneElement(children, {
            onLayout: (event) => {
              if (children.props.onLayout) children.props.onLayout(event);

              event.persist();

              timer = setInterval(() => {
                event.target &&
                event.target.measure((x, y, width, height, pageX, pageY) => {
                  if (
                    this.x === x &&
                    this.y === y &&
                    this.pageX === pageX &&
                    this.pageY === pageY
                  )
                    clearInterval(timer);
                  else {
                    this.x = x;
                    this.y = y;
                    this.pageX = pageX;
                    this.pageY = pageY;
                    return;
                  }

                  const circleSize = height > width ? height : width;

                  onLayout(name, {
                    center,
                    style: {
                      // make sure the highlight is always a circle
                      height: circleSize,
                      width: circleSize,
                      top: pageY - ((circleSize - height) / 2),
                      left: pageX - ((circleSize - width) / 2),
                      borderRadius: circleSize,
                      ...(style
                        ? style({ height, width, pageX, pageY, x, y })
                        : {}),
                    },
                    overlay: children,
                  });
                })
              }, 250);
            }
          });

          return newChildren;
        }}
      </Consumer>
    );
  }
}
