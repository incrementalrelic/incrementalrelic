import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

const loadingIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="spinner"
    className="reactive-btn-loading-svg reactive-spin"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
    ></path>
  </svg>
);

const successIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="check"
    className="reactive-btn-success-svg"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
    ></path>
  </svg>
);

const errorIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="times"
    className="reactive-btn-error-svg"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 352 512"
  >
    <path
      fill="currentColor"
      d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
    ></path>
  </svg>
);

const ReactiveButton = (props) => {
  const color = props.color ? props.color : 'primary';

  const idleText = props.idleText ? props.idleText : 'Click Me';

  let [translate, setTranslate] = useState(0);
  let [shouldTransition, setShouldTransition] = useState(true);
  const [clicked, setClicked ] =  useState(false);
  const [seconds, setSeconds ] =  useState(props.loadDuration-1);

  useInterval(()=>{
    if (seconds > 0) {
      setSeconds(seconds - 1);
    }
    else{
      setClicked(false);
    }
  }, props.buttonState =="loading" ? 1000: null);

  const successText =
    props.successText && props.successText !== ''
      ? props.successText
      : 'Success';

  const errorText =
    props.errorText && props.errorText !== '' ? props.errorText : 'Error';

  const type = props.type ? props.type : 'button';

  const className = `reactive-btn${
    props.className ? ' ' + props.className : ''
  }`;

  const outline = props.outline ? true : false;

  const shadow = props.shadow ? true : false;

  const style = props.style ? props.style : {};

  const rounded = props.rounded ? true : false;

  const size = props.size ? props.size : 'normal';

  const animation =
    typeof props.animation !== 'undefined' && props.animation === false
      ? false
      : true;

  const [buttonState, setButtonState] = useState(
    props.buttonState ? props.buttonState : 'idle'
  );

  const onClickHandler = () => {
    setClicked(true)
    setShouldTransition(false);
    setTranslate(-100);
    if (typeof props.onClick !== 'undefined') {
      props.onClick();
    }
  };

  useEffect(() => {
    if (typeof props.buttonState !== 'undefined') {
      if (props.buttonState === 'loading' || props.buttonState.startsWith("charging") ){
        setSeconds(props.loadDuration-1);
        setButtonState(props.buttonState);
        setShouldTransition(false); 
        setTranslate(-100);
      }
      else if (props.buttonState === 'idle' ){
        setButtonState(props.buttonState); 
      }
      else if (props.buttonState === 'success' || props.buttonState === 'error') {
        setTimeout(
          () => {
            setButtonState('idle');
          },
          props.messageDuration ? props.messageDuration : 2000
        );
      }
    }
  }, [props.buttonState, props.messageDuration]);

  useEffect(() => {
    if (translate === -100) {
      setTimeout(() => {setShouldTransition(true);
      setTranslate(0);},200)
    }
  }, [translate]);

  const getButtonText = (currentButtonState) => {
    if (currentButtonState === 'idle' || currentButtonState.startsWith("charging")) {
      return idleText;
    } else if (currentButtonState === 'loading') {
      return <React.Fragment>
          {loadingIcon} {seconds>9 ? `00:${seconds}`: `00:0${seconds}`}
        </React.Fragment>
    } else if (currentButtonState === 'success') {
      return successText === 'Success' ? (
        <React.Fragment>
          {successIcon} {successText}
        </React.Fragment>
      ) : (
        successText
      );
    } else if (currentButtonState === 'error') {
      return errorText === 'Error' ? (
        <React.Fragment>
          {errorIcon} {errorText}
        </React.Fragment>
      ) : (
        errorText
      );
    }
  };
  
  return ( 
    <React.Fragment>
      <span
        className={`reactive-btn-wrapper ${size}${props.block ? ' block' : ''}`}
        style={{ width: props.width, height: props.height }}
      >
        <button
          ref={typeof props.buttonRef !== 'undefined' ? props.buttonRef : null}
          disabled={(buttonState !== 'idle' && !buttonState.startsWith("charging")) || props.disabled}
          data-button-state={buttonState}
          type={type}
          className={`${className} ${color}${outline ? ' outline' : ''}${
            !animation ? ' no-animation' : ''
          }${rounded ? ' rounded' : ''}${shadow ? ' shadow' : ''}${
            props.disabled ? ' disabled' : ''
          }`}
          onClick={onClickHandler}
          style={style}
        >
              <span className="progress" style={ buttonState !== 'idle' ? {
                  transform: `translateX(${translate}%)`,
                  transition: shouldTransition ? `transform ${props.loadDuration ?? 3}s cubic-bezier(0.59, 0.01, 0.41, 0.99)` : "transform 0.15s ease"
                }
              : {
                transform: "translateX(-100%)",
                transition: "transform 0.15s ease"
              }}></span>
          <span className="content">
            <React.Fragment>{getButtonText(buttonState)}</React.Fragment>
          </span>
        </button>
      </span>
    </React.Fragment>
  );
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

ReactiveButton.propTypes = {
  color: PropTypes.string,
  idleText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  loadingText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  successText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  type: PropTypes.string,
  className: PropTypes.string,
  outline: PropTypes.bool,
  shadow: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  rounded: PropTypes.bool,
  size: PropTypes.string,
  animation: PropTypes.bool,
  buttonState: PropTypes.string,
  onClick: PropTypes.func,
  messageDuration: PropTypes.number,
  loadDuration: PropTypes.number,
  block: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  buttonRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  disabled: PropTypes.bool,
};

export default ReactiveButton;