let focuses = [];
let onBlurCB = () => ({});
let onFocusCB = ({target, currentTarget}) => focuses.push({target, currentTarget});

export const setMediumCallbacks = (f, b) => {
  onFocusCB = f;
  onBlurCB = b;
  focuses.forEach(onFocusCB);
  focuses = [];
};

export const onBlur = e => onBlurCB(e);
export const onFocus = e => onFocusCB(e);